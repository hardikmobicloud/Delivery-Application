import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private headers     = new HttpHeaders({ 'Content-Type': 'application/json'});
  private ordersList  = new BehaviorSubject<any>([]);
  orderCast = this.ordersList.asObservable();

  constructor( private httpClient: HttpClient ) {}

  loadOrderList( shop_id: string ) {
    this.httpClient.post(
      'http://mobicloudtechnologies.com/grocery/api/delivery_api.php?function=getMyOrderList' ,
      { shop_id } ,
      {responseType: 'json', headers: this.headers}
    ).subscribe( data => {
      if ( data.status === 'success' ) {
        this.ordersList.next( data.result );
      }
    });
  }

  getOrdersRx() {
    return this.orderCast;
  }

  getOrderById( orderId: string ) {
    let orderInfo: object;
    if ( orderId ) {
      this.ordersList.getValue().forEach( (order) => {
        if ( order.order_id === orderId ) {
          orderInfo = order;
        }
      });
    }
    return orderInfo;
  }

  getOrderDetails( customer_Id: string, order_id: string ) {
    return this.httpClient.post(
      'http://mobicloudtechnologies.com/grocery/api/delivery_api.php?function=getOrdersDetail' ,
      { customer_Id , order_id } ,
      {responseType: 'json', headers: this.headers}
    );
  }
}
