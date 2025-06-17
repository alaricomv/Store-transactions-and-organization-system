import { Component } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { CalculatorComponent } from "../../partials/calculator/calculator.component";
import { LastTransactionsComponent } from "../../partials/last-transactions/last-transactions.component";
import { Observable } from 'rxjs';
import { LastTotalTransactionsComponent } from '../../partials/last-total-transactions/last-total-transactions.component';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

registerLocaleData(localeEs); // Register Spanish locale

@Component({
    selector: 'app-calculator-page',
    imports: [CommonModule, CalculatorComponent, LastTransactionsComponent, LastTotalTransactionsComponent],
    templateUrl: './calculator-page.component.html',
    styleUrl: './calculator-page.component.css',
    providers: []
})
export class CalculatorPageComponent {
  user!: User;

  lasttransactions:Transaction[] = [];

  transactions:Transaction[] = [];
  constructor(private transactionService:TransactionService, private router: Router, private userService: UserService) {
    let transactionsObservable:Observable<Transaction[]>;

    transactionsObservable = transactionService.getLastthree();

    this.transactions = transactionService.getAll();

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

   onLoginClick(){
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
