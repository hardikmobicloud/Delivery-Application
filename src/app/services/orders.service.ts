import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private headers     = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'});
  orderList = [];
  private readonly apiUrl = 'https://mobicloudtech.com/grocery/api/delivery_api.php';

  constructor( private httpClient: HttpClient ) {}

  cachePendingOrders( request ) {
    request.subscribe( (data: any) => {
      if ( data.status === 'success' ) {
        this.orderList = data.result;
      }
    });
  }

  getPendeingOrders( shop_id: string, delivery_person_id: string ) {
    const request = this.httpClient.post(
      `${this.apiUrl}?function=getMyOrderList`,
      { shop_id , delivery_person_id } ,
      {responseType: 'json', headers: this.headers}
    );
    this.cachePendingOrders( request ); // To cache the data
    return request;
  }

  markOrderAsDelivered( order_id: string, customer_id: string, shop_id: string, delivery_boy_id: string ) {
    return this.httpClient.post(
      `${this.apiUrl}?function=orderStatus`,
      { customer_id , order_id , shop_id, delivery_boy_id } ,
      { responseType: 'json', headers: this.headers }
    );
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

  bulkUpdate( customer_id: string,shop_id:string, productsArr = [] ) {
    return this.httpClient.post(
      `${this.apiUrl}?function=updateOrRemoveProduct`,
      { customer_id: customer_id,shop_id:shop_id, product_list: productsArr } ,
      { responseType: 'json', headers: this.headers }
    );
  }

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
