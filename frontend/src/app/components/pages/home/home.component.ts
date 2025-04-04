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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalculatorComponent, LastTransactionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }] // Set locale to Spanish
})
export class HomeComponent {

  lasttransactions:Transaction[] = [];

  transactions:Transaction[] = [];
  constructor(private transactionService:TransactionService) {
    this.lasttransactions = transactionService.getLastthree();

    this.transactions = transactionService.getAll();
  }

}
