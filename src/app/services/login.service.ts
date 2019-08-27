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

    const headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.httpClient.post(
              'http://mobicloudtechnologies.com/grocery/api/delivery_api.php?function=deliveryLogin' ,
              payload ,
              // {responseType: 'text', headers}
              {responseType: 'json', headers}
            );
  }
}
