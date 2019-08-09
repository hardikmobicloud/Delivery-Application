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
      this.fetchPendingOrders();
    });
  }

  onRefresh() {
    this.fetchPendingOrders( true );
  }

  fetchPendingOrders( forceFetch: boolean = false ) {
    if ( this.orders.length < 1 || forceFetch ) {
      this.showLoading();
      this.orderService.getOrders( this.shopId ).subscribe( data => {
        this.hideLoading();
        // TODO Replace with actual data from the api response
        this.fillMockData();
        console.log('MOCK DATA FILLED!!!');
      });
    }
  }

  fillMockData() {
    this.orders = [
      {
          "order_id": "2",
          "customer_id": null,
          "first_name": "Yogesh",
          "last_name": "",
          "flat_plot_no": "105",
          "building_name": "Lunkad plaza",
          "landmark": "Viman nagar",
          "location": "",
          "city": "",
          "order_date": "01\/01\/1970",
          "total_amount": null,
          "order_status": "3"
      },
      {
          "order_id": "2",
          "customer_id": null,
          "first_name": "Yogesh",
          "last_name": "",
          "flat_plot_no": "105",
          "building_name": "Lunkad plaza",
          "landmark": "Viman nagar",
          "location": "",
          "city": "",
          "order_date": "01\/01\/1970",
          "total_amount": null,
          "order_status": "3"
      },
      {
          "order_id": "2",
          "customer_id": null,
          "first_name": "Yogesh",
          "last_name": "",
          "flat_plot_no": "102",
          "building_name": "Lunkad plaza",
          "landmark": "Viman nagar",
          "location": "",
          "city": "",
          "order_date": "01\/01\/1970",
          "total_amount": null,
          "order_status": "3"
      }];
  }

  showLoading( message: string = '') {
    this.loadingCtrlr.create({
      message
    }).then( loader => {
        loader.present();
    });
  }

  hideLoading() {
    this.loadingCtrlr.dismiss();
  }

  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
