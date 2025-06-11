import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { TransactionPageComponent } from './components/pages/transaction-page/transaction-page.component'; 
import { CalculatorPageComponent } from './components/pages/calculator-page/calculator-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { TransactionListPageComponent } from './components/pages/transaction-list-page/transaction-list-page.component';
import { TotalTransactionListPageComponent } from './components/pages/total-transaction-list-page/total-transaction-list-page.component';
import { authGuard, guestGuard } from './auth.guard';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'transaction/:id', component: TransactionPageComponent }, // Transactions page
  { path: 'calculator', component: CalculatorPageComponent, }, // Calculator page
  { path: 'login', component: LoginPageComponent, canActivate: [guestGuard] }, // Login page
  { path: 'register', component: RegisterPageComponent, canActivate: [guestGuard] }, // Register page
  { path: 'transactions', component: TransactionListPageComponent }, // Transactions List page
  { path: 'totaltransactions', component: TotalTransactionListPageComponent }, // Total Transactions List page
  { path: '**', redirectTo: '' } // Redirect unknown routes to the home page
];