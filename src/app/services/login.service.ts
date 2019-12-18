import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public otpObj: object = {};

  constructor(private httpClient: HttpClient) { }

  doLogin( mobile_no: string ) {

    const payload = { mobile_no };

    console.log( 'payload-->>', payload );

    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.httpClient.post(
              // 'http://13.234.250.245/g2d/api/delivery_api.php?function=deliveryLogin',
              'http://newwavestech.com/grocery/api/delivery_api.php?function=deliveryLogin' ,
              payload ,
              // {responseType: 'text', headers}
              {responseType: 'json', headers}
            );
  }
}
