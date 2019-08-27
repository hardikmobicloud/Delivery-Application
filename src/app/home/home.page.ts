import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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

  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               private loadingCtrl: LoadingController,
               private ordersService: OrdersService ) {}

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
        this.productsList     = data.result.product_info;
        this.orderInfo        = data.result.Order_info;
        this.order  = this.ordersService.getOrderById( data.result.Order_info.order_id );
        this.hideLoading();
      }
    });
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
