import { Component } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../services/user.service';
import { TransactionPageComponent } from '../../pages/transaction-page/transaction-page.component';

registerLocaleData(localeEs); // Register Spanish locale

@Component({
  selector: 'app-last-transactions',
  imports: [RouterLink, CommonModule, TransactionPageComponent],
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class LastTransactionsComponent {
  lasttransactions: Transaction[] = [];

  demoLastTransactions: Transaction[] = [
    { id: "1-10", user_id: 1, date: new Date('2025-05-30T21:00:00'), total: 500.00 },
    { id: "1-9",  user_id: 1, date: new Date('2025-05-30T20:00:00'), total: 90.00},
    { id: "1-8",  user_id: 1, date: new Date('2025-05-30T19:00:00'), total: 150.00},
    { id: "1-7",  user_id: 1, date: new Date('2025-05-30T18:00:00'), total: 210.00},
    { id: "1-6",  user_id: 1, date: new Date('2025-05-30T17:00:00'), total: 60.00},
  ];

  user!: User;

  // Properties to manage the custom modal
  showModal: boolean = false;
  selectedTransaction!: Transaction;

  constructor(
    private transactionService: TransactionService,
    userService: UserService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      if (!this.user?.token) {
        this.lasttransactions = this.demoLastTransactions;
      } else {
        this.transactionService.getLastthree().subscribe({
          next: (transactions) => {
            console.log('Received transactions:', transactions);
            this.lasttransactions = transactions;
          },
          error: (err) => {
            console.error('Error fetching transactions:', err);
          }
        });
      }
    });
  }

  openTransactionModal(transaction: Transaction): void {
    
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl) {
      activeEl.blur();
    }
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
