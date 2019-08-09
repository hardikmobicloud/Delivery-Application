import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  {
    path: 'otp',
    children : [
      {
        path : '',
        loadChildren: './otp/otp.module#OtpPageModule'
      },
      {
        path : ':mobileNo',
        loadChildren: './otp/otp.module#OtpPageModule'
      }
    ]
  },
  {
    path: 'detail',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'pending',
    children : [
      {
        path : '',
        loadChildren: './list/list.module#ListPageModule'
      },
      {
        path : ':shopId',
        loadChildren: () => import('./list/list.module').then(m => m.ListPageModule) // Just another way to loadChildren
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
