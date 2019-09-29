import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    if ( !this.getCookieInfo( 'delPerId' ) ) {
      this.router.navigate( [ `/login` ] );
    }
  }

  onLogoutClick() {
    this.menu.enable( false );
    this.cookieService.deleteAll('/');
    this.cookieService.deleteAll();
    // this.router.navigate( [ `/login` ] );
    location.href = '/login';
  }

  getAvatarText() {
    const avT = this.getCookieInfo( 'delPerName' );
    return avT && avT.length > 1 ? avT.slice( 0, 2 ) : '';
  }

  getCookieInfo( cookieName: string ) {
    return this.cookieService.get( cookieName );
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
