import { Component, LOCALE_ID } from '@angular/core';
import { Total_transaction } from '../../../shared/models/total_transactions';
import { User } from '../../../shared/models/user';
import { TransactionService } from '../../../services/transaction.service';
import { UserService } from '../../../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TotalTransactionPageComponent } from '../../pages/total-transaction-page/total-transaction-page.component';
import { RouterLink } from '@angular/router';


registerLocaleData(localeEs); // Register Spanish locale
@Component({
    selector: 'app-last-total-transactions',
    imports: [RouterLink, CommonModule, MatDialogModule, TotalTransactionPageComponent],
    templateUrl: './last-total-transactions.component.html',
    styleUrl: './last-total-transactions.component.css',
    providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class LastTotalTransactionsComponent {
  lasttransactions: Total_transaction[] = [];
  user!: User;
  
  demoLastTransactions: Total_transaction[] = [
    { id: "1-13", user_id: 1, date: new Date('2025-05-30T00:00:00'), total: 100.00, number_transactions: 3 },
    { id: "1-12", user_id: 1, date: new Date('2025-05-30T12:00:00'), total: 250.00, number_transactions: 6 },
    { id: "1-11", user_id: 1, date: new Date('2025-05-30T09:00:00'), total: 75.00, number_transactions: 2 }
  ];

  // New modal management properties
  showModal: boolean = false;
  selectedTransaction!: Total_transaction;

  constructor(
    private transactionService: TransactionService, 
    userService: UserService,
    private dialog: MatDialog 
  ) {
    

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;

      if (!this.user?.token) {
      // No token? Use the demo transactions.
      this.lasttransactions = this.demoLastTransactions;
    } else {
      this.transactionService.getLastTotalTransactions().subscribe({
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

  openTransactionDialog(transaction: Total_transaction): void {
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

  ngOnInit(){
    console.log('LastTotalTransactionsComponent initialized with transactions:', this.lasttransactions);
  }
}
