import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { LoadingController, IonSelect, ToastController } from '@ionic/angular';

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
               public toastController: ToastController ) {}

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
    this.ordersService.getOrderDetails( this.custId, this.orderId ).subscribe( ( data ) => {
      if ( data.status && data.status === 'success' && data.result ) {
        this.productsList = data.result.product_info;
        this.orderInfo    = data.result.Order_info;
        this.order        = this.ordersService.getOrderById( data.result.Order_info.order_id );
        this.hideLoading();
      }
    });
  }

  arrayFill( x: string ) {
    return Array( parseInt( x , 10 ) ).fill().map( ( n, i ) => i + 1 );
  }

  onChangeQuantity( event, product ) {
    if ( parseInt( event.detail.value , 10 ) > 0 ) { // Update product quantity
      this.ordersService.updateProductQuantity(this.orderId , product.product_id, event.detail.value )
          .subscribe( data => {
              if ( data.status === 'success' ) {
                this.presentToast( data.message );
              } else {
                this.presentToast( data.message , 2000, 'danger' );
              }
          });
    } else { // Remove Product
      this.ordersService.removeProduct( this.orderId , product.product_id )
          .subscribe( data => {
              if ( data.status === 'success' ) {
                this.presentToast( data.message );
              } else {
                this.presentToast( data.message , 2000, 'danger' );
              }
          });
    }
  }

  onSelectClick( i: number ) {
    this.quantitySelect._results[i].open();
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
