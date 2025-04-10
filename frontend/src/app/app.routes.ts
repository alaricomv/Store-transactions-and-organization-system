import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { TransactionPageComponent } from './components/pages/transaction-page/transaction-page.component'; 
import { CalculatorPageComponent } from './components/pages/calculator-page/calculator-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'transaction/:id', component: TransactionPageComponent }, // Transactions page
  { path: 'calculator', component: CalculatorPageComponent }, // Transactions page
  { path: '**', redirectTo: '' } // Redirect unknown routes to the home page
];