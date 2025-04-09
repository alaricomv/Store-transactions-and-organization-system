import { Component } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { CalculatorComponent } from "../../partials/calculator/calculator.component";
import { LastTransactionsComponent } from "../../partials/last-transactions/last-transactions.component";

registerLocaleData(localeEs); // Register Spanish locale

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [CommonModule, CalculatorComponent, LastTransactionsComponent],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }] 
})
export class CalculatorPageComponent {

  lasttransactions:Transaction[] = [];

  transactions:Transaction[] = [];
  constructor(private transactionService:TransactionService) {
    this.lasttransactions = transactionService.getLastthree();

    this.transactions = transactionService.getAll();
  }
}
