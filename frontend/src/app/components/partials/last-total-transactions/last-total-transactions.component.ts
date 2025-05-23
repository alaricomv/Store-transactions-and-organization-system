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
    imports: [RouterLink, CommonModule, MatDialogModule],
    templateUrl: './last-total-transactions.component.html',
    styleUrl: './last-total-transactions.component.css',
    providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class LastTotalTransactionsComponent {
    lasttransactions: Total_transaction[] = [];
  
    user!: User;
  
    constructor(private transactionService: TransactionService, userService: UserService, private dialog: MatDialog) {
      this.transactionService.getLastTotalTransactions().subscribe({
        next: (transactions) => {
          console.log('Received transactions:', transactions); // Log the JSON response
          this.lasttransactions = transactions; // Assign the response to the component property
        },
        error: (err) => {
          console.error('Error fetching transactions:', err); // Log any errors
        }
      });
  
      userService.userObservable.subscribe((newUser) => {
        this.user = newUser;
      });
    }
  
    openTransactionDialog(transaction: Total_transaction): void {
      this.dialog.open(TotalTransactionPageComponent, {
        data: transaction,
        width: '400px'
      });
    }

}
