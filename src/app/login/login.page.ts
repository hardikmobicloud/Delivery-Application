import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss' , '../app.component.scss'],
})
export class LoginPage implements OnInit {

  mobileNo = '';
  hasLoginSubmitted = false;
  otpInput: number;
  otp: number;
  shopId: string;
  isValidMobileNo = true;
  loginErrorMsg: string;
  otpErrorMsg: string;

  constructor( private router: Router,
               private loginService: LoginService,
               private loadingCtrlr: LoadingController ) { }

  ngOnInit() {}

  onLoginSubmit() {
    if ( this.mobileNo.toString().length === 10 ) {
      this.doLogin();
    } else {
      this.showLoginErrorMsg( 'Enter valid mobile no.' );
    }
    return;
  }

  doLogin() {
    this.showLoading( 'Please wait' );
    this.hideLoginErrorMsg();
    this.loginService.doLogin( this.mobileNo ).subscribe( (data: any) => {
      this.hideLoading();

      if ( data.status === 'success' ) {
        this.otp = data.result && data.result.otp ? data.result.otp : 0;
        this.shopId = data.result && data.result.shop_id ? data.result.shop_id : '';

        /**
         * Make it true only if mobile number is valid and received the otp in response
         * To HIDE login and SHOW otp
         */
        this.hasLoginSubmitted = true;
      } else {
        this.showLoginErrorMsg( data.message ? data.message : 'Login has failed!' );
      }
    });
  }

  onOTPSubmit() {
    this.hideOtpErrorMsg();

    if ( this.otpInput.toString().length === 4 ) {
      if ( this.otp ) {
        if ( this.otpInput && this.otp === this.otpInput ) {
          this.router.navigate( [`/pending/${this.shopId}`] );
        } else {
          this.showOtpErrorMsg( 'Invalid OTP!' );
        }
      }
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
    this.loadingCtrlr.dismiss();
  }

  showLoginErrorMsg( message: string ) {
    this.loginErrorMsg = message;
  }

  showOtpErrorMsg( message: string ) {
    this.otpErrorMsg = message;
  }

  hideLoginErrorMsg() {
    this.loginErrorMsg = '';
  }

  hideOtpErrorMsg() {
    this.otpErrorMsg = '';
  }

}
