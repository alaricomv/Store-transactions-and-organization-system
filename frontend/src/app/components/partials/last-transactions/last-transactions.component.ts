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


registerLocaleData(localeEs); // Register Spanish locale

@Component({
  selector: 'app-last-transactions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './last-transactions.component.html',
  styleUrl: './last-transactions.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class LastTransactionsComponent {
  lasttransactions: Transaction[] = [];

  user!: User;

  constructor(private transactionService: TransactionService, userService: UserService) {
    this.transactionService.getLastthree().subscribe({
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
}
