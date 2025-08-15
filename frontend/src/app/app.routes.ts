import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { AddgoodComponent } from './pages/addgood/addgood.component';
import { AddcategoryComponent } from './pages/addcategory/addcategory.component';
import { AllgoodsComponent } from './pages/allgoods/allgoods.component';
import { AddorderComponent } from './pages/addorder/addorder.component';
import { AllordersComponent } from './pages/allorders/allorders.component';
import { LowstockComponent } from './pages/lowstock/lowstock.component';

export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products/new', component: AddgoodComponent },
      { path: 'categories/new', component: AddcategoryComponent},
      { path: 'products', component: AllgoodsComponent},
      { path: 'orders/new', component: AddorderComponent},
      { path: 'orders', component: AllordersComponent},
      { path: 'products/low', component: LowstockComponent}


      // { path: '/users/edit', component: DashboardComponent },
      // { path: '/orders', component: DashboardComponent },
];
