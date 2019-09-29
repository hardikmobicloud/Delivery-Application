import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private headers     = new HttpHeaders({ 'Content-Type': 'application/json'});
  orderList = [];
  private readonly apiUrl = 'http://newwavestech.com/grocery/api/delivery_api.php';

  constructor( private httpClient: HttpClient ) {}

  cachePendingOrders( request ) {
    request.subscribe( (data: any) => {
      if ( data.status === 'success' ) {
        this.orderList = data.result;
      }
    });
  }

  getPendeingOrders( shop_id: string ) {
    const request = this.httpClient.post(
      `${this.apiUrl}?function=getMyOrderList`,
      { shop_id } ,
      {responseType: 'json', headers: this.headers}
    );
    this.cachePendingOrders( request ); // To cache the data
    return request;
  }

  getOrderDetails( customer_id: string, order_id: string, shop_id: string ) {
    return this.httpClient.post(
      `${this.apiUrl}?function=getOrdersDetail`,
      { customer_id , order_id , shop_id } ,
      { responseType: 'json', headers: this.headers }
    );
  }

  getCacellationReason() {
    return this.httpClient.post(
      `${this.apiUrl}?function=productRejectionReason`,
      { responseType: 'json', headers: this.headers }
    );
  }

  bulkUpdate( order_id: string, productsArr = [] ) {
    return this.httpClient.post(
      `${this.apiUrl}?function=updateOrRemoveProduct`,
      { customer_id: 2, product_list: productsArr } ,
      { responseType: 'json', headers: this.headers }
    );
  }

  // updateProductQuantity( order_id: string, product_id: string, product_quantity: string ) {
  //   return this.httpClient.post(
  //     `${this.apiUrl}?function=updateOrRemoveProduct`,
  //     { order_id , product_id , product_quantity } ,
  //     { responseType: 'json', headers: this.headers }
  //   );
  // }


  // removeProduct( order_id: string, product_id: string ) {
  //   return this.httpClient.post(
  //     `${this.apiUrl}?function=updateOrRemoveProduct`,
  //     { order_id , product_id } ,
  //     { responseType: 'json', headers: this.headers }
  //   );
  // }

  getOrderById( orderId: string ) {
    let orderInfo: object;
    if ( orderId ) {
      this.orderList.forEach( (order) => {
        if ( order.order_id === orderId ) {
          orderInfo = order;
        }
      });
    }
    return orderInfo;
  }
}
