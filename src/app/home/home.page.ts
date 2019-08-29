import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { LoadingController, IonSelect, ToastController, AlertController } from '@ionic/angular';

import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' , '../app.component.scss' ],
})
export class HomePage implements OnInit {

  orderId         = '';
  custId          = '';
  orderInfo: any  = {};
  productsList    = [];
  order: any      = {};

  customAlertOptions: any = {
    header: 'Select Quantity'
  };

  @ViewChildren(IonSelect) quantitySelect: IonSelect[];

  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               private loadingCtrl: LoadingController,
               private ordersService: OrdersService,
               public toastController: ToastController,
               public alertController: AlertController ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( paramMap => {
      if ( !paramMap.has( 'customerId' ) && !paramMap.has( 'orderId' ) ) {
        this.router.navigate( [ `/login` ] );
        return;
      }
      this.orderId = paramMap.get( 'orderId' );
      this.custId  = paramMap.get( 'customerId' );
      this.fetchOrderDetails();
    });
  }

  fetchOrderDetails() {
    this.showLoading();
    this.ordersService.getOrderDetails( this.custId, this.orderId ).subscribe( ( data: any ) => {
      if ( data.status && data.status === 'success' && data.result ) {
        this.productsList = data.result.product_info;
        this.orderInfo    = data.result.Order_info;
        this.order        = this.ordersService.getOrderById( data.result.Order_info.order_id );
        this.hideLoading();
      }
    });
  }

  onChangeQuantity( event, product ) {
      this.ordersService.updateProductQuantity(this.orderId , product.product_id, event.detail.value )
          .subscribe( (data: any) => {
              if ( data.status === 'success' ) {
                this.presentToast( data.message );
              } else {
                this.presentToast( data.message , 2000, 'danger' );
              }
          });
  }

  onRemoveProduct( product: any ) {
    this.presentAlertConfirm( () => {
      this.ordersService.removeProduct( this.orderId , product.product_id )
      .subscribe( (data: any) => {
          if ( data.status === 'success' ) {
            this.presentToast( data.message );
            this.removeProductFromList( product.product_id );
          } else {
            this.presentToast( data.message , 2000, 'danger' );
          }
      });
    });
  }

  removeProductFromList( productId: string ) {
    this.productsList = this.productsList.filter( (product: any) => product.product_id !== productId );
  }

  onSelectClick( i: number ) {
    const selectBox: any = this.quantitySelect;
    selectBox.toArray()[i].open();
  }

  async presentToast( message: string = '' , duration: number = 2000 , color: string = 'primary' ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color
    });
    toast.present();
  }

  async presentAlertConfirm( confirmHandler ) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure, you want to <strong>remove</strong> this product from the order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: confirmHandler
        }
      ]
    });

    await alert.present();
  }

  arrayFill( x: string ) {
    const y = parseInt( x , 10 );
    return Array(y).fill(y , 0 , y).map( ( n, i ) => i + 1 );
  }

  showLoading( message: string = '') {
    this.loadingCtrl.create({
      message
    }).then( loader => {
        loader.present();
    });
  }

  hideLoading() {
    this.loadingCtrl.dismiss();
  }
}
