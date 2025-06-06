import { Component } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransactionPageComponent } from '../../pages/transaction-page/transaction-page.component';


registerLocaleData(localeEs); // Register Spanish locale

@Component({
    selector: 'app-last-transactions',
    imports: [RouterLink, CommonModule, MatDialogModule],
    templateUrl: './last-transactions.component.html',
    styleUrl: './last-transactions.component.css',
    providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class LastTransactionsComponent {
  lasttransactions: Transaction[] = [];

  demoLastTransactions: Transaction[] = [
    { id: "1-283", user_id: 1, date: new Date('2025-05-30T12:00:00'), total: 100.00, deleted: 0 },
    { id: "1-282", user_id: 1, date: new Date('2025-05-30T13:00:00'), total: 250.00, deleted: 0 },
    { id: "1-281", user_id: 1, date: new Date('2025-05-30T14:00:00'), total: 75.00, deleted: 0 }
  ];

  user!: User;

  constructor(private transactionService: TransactionService, userService: UserService, private dialog: MatDialog) {
    if (!this.user?.token) {
        // No token? Use the demo transactions.
        this.lasttransactions = this.demoLastTransactions;
      } else {
    this.transactionService.getLastthree().subscribe({
      next: (transactions) => {
        console.log('Received transactions:', transactions); // Log the JSON response
        this.lasttransactions = transactions; // Assign the response to the component property
      },
      error: (err) => {
        console.error('Error fetching transactions:', err); // Log any errors
      }
    });

      }

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  openTransactionDialog(transaction: Transaction): void {
    this.dialog.open(TransactionPageComponent, {
      data: transaction,
      width: '600px'
    });
  }
}
