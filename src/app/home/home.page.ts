import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { LoadingController, IonSelect, ToastController, AlertController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';

import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' , '../app.component.scss' ],
})
export class HomePage implements OnInit {

  orderId         = '';
  custId          = '';
  shopId          = '';
  deliveryBoyId   = '';
  orderInfo: any  = {};
  productsList    = [];
  newProductsList = [];
  oldProductsList = [];
  order: any      = {};
  orderDelivered  = false;
  hasChangesInQuantity  = false;
  updatedProducts = {};
  cancellationReason  = [
                            {
                                order_cancel_reason_id : 8,
                                order_cancel_reason: 'Damage Product',
                                reason_flag: 2
                            },
                            {
                                order_cancel_reason_id : 9,
                                order_cancel_reason: 'Wrong Product',
                                reason_flag: 2
                            },
                            {
                                order_cancel_reason_id : 10,
                                order_cancel_reason: 'Expected Better Quality',
                                reason_flag: 2
                            }
                        ];

  customQuantitySelectOptions: any = {
    header: 'Select Quantity'
  };

  customCancellationReasonSelectOptions: any = {
    header: 'Select reason for cancellation'
  };

  @ViewChildren('quantitySelectElem') quantitySelect: IonSelect[];
  @ViewChildren('removeSelectElem') removeSelect: IonSelect[];

  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               private loadingCtrl: LoadingController,
               private ordersService: OrdersService,
               public toastController: ToastController,
               public alertController: AlertController,
               public cookieService: CookieService ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( paramMap => {
      if ( !paramMap.has( 'customerId' ) && !paramMap.has( 'orderId' ) && !paramMap.has('shopId') ) {
        this.router.navigate( [ `/login` ] );
        return;
      }
      this.orderId = paramMap.get( 'orderId' );
      this.custId  = paramMap.get( 'customerId' );
      this.shopId  = paramMap.get( 'shopId' );
      this.deliveryBoyId  = this.cookieService.get( 'delPerId' );
      this.fetchOrderDetails();
      // this.fetchCancellationReason();
    });
  }

  fetchCancellationReason() {
    this.ordersService.getCacellationReason().subscribe( (data: any) => {
      if ( data && data.status === 'success' ) {
        this.cancellationReason = data.result;
      }
    });
  }

  fetchOrderDetails() {
    //this.showLoading();
    this.ordersService.getOrderDetails( this.custId, this.orderId, this.shopId ).subscribe( ( data: any ) => {
      this.hideLoading();
      if ( data.status && data.status === 'success' && data.result ) {
        this.productsList     = data.result.product_info;
        this.oldProductsList  = this.productsList.map( p => ({...p})); // to set the initial value for comparison
        this.orderInfo    = data.result.Order_info;
        this.order        = this.ordersService.getOrderById( data.result.Order_info.order_id );
      }
    });
  }

  markOrderAsDelivered() {
    this.showLoading('Processing...');
    this.ordersService.markOrderAsDelivered( this.orderId, this.custId, this.shopId, this.deliveryBoyId )
      .subscribe( (data: any) => {
        this.hideLoading();
        if ( data.status === 'success' ) {
          this.orderDelivered = true;
          this.fetchOrderDetails();

        } else {
          this.presentToast( data.message , 2000, 'danger' );
        }
      });
  }

  onSaveChangesClick() {
    this.showLoading('Processing...');
    this.ordersService.bulkUpdate( this.custId,this.shopId , Object.values(this.updatedProducts) )
      .subscribe( (data: any) => {
        this.hideLoading();
        if ( data.status === 'success' ) {
          this.presentToast( data.message );
          this.hasChangesInQuantity = false;
          this.updatedProducts  = {};
          this.oldProductsList  = this.productsList.map( p => ({...p}));
        } else {
          this.presentToast( data.message , 2000, 'danger' );
        }
      });
  }

  onChangeQuantity( $event, selectedProduct ) {
    const productId   =  selectedProduct.product_id ,
          newQuantity = $event.detail.value;
    this.oldProductsList.forEach( (product: any, i: number) => {
      if ( product.product_id === productId ) {
        if ( product.product_quantity !== newQuantity ) {
          if ( this.oldProductsList[i].product_quantity !== newQuantity ) {
            this.productsList[i].product_quantity = newQuantity;
            this.hasChangesInQuantity = true;
            this.updatedProducts[productId] = {
              product_id: productId,
              order_id: this.orderId,
              old_quantity: this.oldProductsList[i].product_quantity,
              new_quantity: newQuantity
              // cancellation_reason: "8"
            };
          } else {
            this.removeProductFromUpdateList( productId );
          }
        } else {
          this.removeProductFromUpdateList( productId );
        }
        return;
      }
    });
  }

  onReasonSelect( $event: any , selectedProduct: any ) {
    const productId     =   selectedProduct.product_id ,
          cancelReason  =   $event.detail.value;
    this.oldProductsList.forEach( (product: any, i: number) => {
      if ( product.product_id === productId ) {
            this.removeProductFromList( productId );
            this.updatedProducts[productId] = {
              product_id: productId,
              order_id: this.orderId,
              old_quantity: this.oldProductsList[i].product_quantity,
              new_quantity: 0,
              cancellation_reason: cancelReason
            };
            return;
        }
    });
  }

  removeProductFromList( productId: string ) {
    if ( productId ) {
      this.productsList = this.productsList.filter( product => product.product_id !== productId );
      this.hasChangesInQuantity = true;
    }
  }

  removeProductFromUpdateList( productId: any ) {
    delete this.updatedProducts[productId];
    this.hasChangesInQuantity = Object.keys( this.updatedProducts ).length > 0;
  }

  getTotalAmount( orderInfo: any ) {
    return this.getSubTotalAmount()+( parseInt(orderInfo.delivery_charges) ? parseInt(orderInfo.delivery_charges) : 0 ) - ( orderInfo.discount_amount ? orderInfo.discount_amount : 0 );
  }

  getSubTotalAmount() {
    let totalAmount = 0;
    this.productsList.forEach( (product: any , i: number) => {
      totalAmount +=  product.product_rate * product.product_quantity;
    });
    return totalAmount;
  }

  onSelectClick( i: number ) {
    const selectBox: any = this.quantitySelect;
    selectBox.toArray()[i].open();
  }

  onRemoveSelectClick( i: number ) {
    const selectBox: any = this.removeSelect;
    selectBox.toArray()[i].open();
  }

  async presentToast( message: string = '' , duration: number = 2000 , color: string = 'dark' ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'middle',
      color
    });
    toast.present();
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
