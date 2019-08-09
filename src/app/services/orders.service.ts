import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor( private httpClient: HttpClient ) { }

  getOrders( shopId: string ) {
    const payload = `{
      shop_id : ${shopId}
    }`;

    return this.httpClient.post(
              'http://mobicloudtechnologies.com/grocery/api/delivery_api.php?function=getMyOrderList' ,
              payload ,
              // {responseType: 'text', headers}
              {responseType: 'text'}
            );
  }
}
