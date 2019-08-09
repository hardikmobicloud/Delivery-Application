import { Component, OnInit } from '@angular/core';

import { LoginService } from '../services/login.service';
import { ActivatedRoute , Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: [ './otp.page.scss' , '../app.component.scss' ],
})
export class OtpPage implements OnInit {

  mobileNo = '';
  otp = '';

  constructor( private loginService: LoginService ,
               private activatedRoute: ActivatedRoute,
               private router: Router ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( paramMap => {
      if ( !paramMap.has( 'mobileNo' ) ) {
        this.router.navigate( ['/login'] );
        return;
      }

      this.mobileNo =  paramMap.get( 'mobileNo' );

      this.loginService.doLogin( this.mobileNo ).subscribe( data => {
        console.log( 'data--->>>' , data );

        // TODO check the response and navigate to orders page

        this.router.navigate( [`/pending/94`] );
      });
    });
  }

}
