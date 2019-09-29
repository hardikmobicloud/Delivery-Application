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
    path: 'detail',
    children : [
      {
        path : '',
        loadChildren : () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path : ':customerId/:orderId/:shopId',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) // Just another way to loadChildren
      }
    ]
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
