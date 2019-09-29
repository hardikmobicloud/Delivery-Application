import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { OrdersService } from '../services/orders.service';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: [ 'list.page.scss' , '../app.component.scss' ]
})
export class ListPage implements OnInit {

  orders: Array<any> = [];
  shopId = '';

  constructor( private router: Router ,
               private activatedRoute: ActivatedRoute,
               private orderService: OrdersService,
               private loadingCtrlr: LoadingController ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( paramMap => {
      if ( !paramMap.has( 'shopId' ) ) {
        this.router.navigate( [ `/login` ] );
        return;
      }
      this.shopId = paramMap.get( 'shopId' );
    });

    if ( this.shopId ) {
      this.fetchPendingOrders();
    }
  }

  onRefresh() {
    this.fetchPendingOrders( true );
  }

  fetchPendingOrders( forceFetch: boolean = false ) {
    if ( this.orders.length < 1 || forceFetch ) {
      this.showLoading();
      this.orderService.getPendeingOrders( this.shopId  ).subscribe( (data: any) => {
        this.hideLoading();
        if ( data.status === 'success' ) {
          this.orders = data.result;
        }
      });
    }
  }

  showLoading( message: string = '') {
    this.loadingCtrlr.create({
      message
    }).then( loader => {
        loader.present();
    });
  }

  hideLoading() {
    try {
      this.loadingCtrlr.dismiss();
    } catch ( e ) { }
  }

  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
