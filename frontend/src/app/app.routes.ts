import { Routes } from '@angular/router';
import {LoginComponent} from './pages/home2/home2.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { AddgoodComponent } from './pages/addgood/addgood.component';
import { AddcategoryComponent } from './pages/addcategory/addcategory.component';

export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products/new', component: AddgoodComponent },
      { path: 'categories/new', component: AddcategoryComponent}

      // { path: '/orders/new', component: DashboardComponent },
      // { path: '/users/edit', component: DashboardComponent },
      // { path: '/orders', component: DashboardComponent },
      // { path: '/products', component: DashboardComponent }
];
