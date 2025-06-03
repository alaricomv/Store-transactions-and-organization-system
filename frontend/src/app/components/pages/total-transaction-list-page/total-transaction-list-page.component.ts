import { Component } from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../shared/models/transaction';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Total_transaction } from '../../../shared/models/total_transactions';
import { User } from '../../../shared/models/user';
import { Route, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-total-transaction-list-page',
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './total-transaction-list-page.component.html',
    styleUrl: './total-transaction-list-page.component.css'
})
export class TotalTransactionListPageComponent {

  user!: User;
  transactions: Total_transaction[] = [];

  pageIndex = 0;
  pageSize = 10;

  readonly date = new FormControl(new Date());
  readonly serializedDate = new FormControl(new Date().toISOString());



  //Prepares date in a YYYY-MM-DD format string
  get dateString(): string {
    const value = this.date.value ?? new Date();
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  constructor(private transactionService: TransactionService, private cdr: ChangeDetectorRef, private router: Router, userService: UserService) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

  }

  ngOnInit() {
     if (!this.user?.token) {
    this.date.setValue(new Date(2025, 4, 30)); 
    }

    // Initial load
    this.fetchTransactions();

    // Subscribe to date changes
    this.date.valueChanges.subscribe(() => {
      this.fetchTransactions();
    });
  }

  // Add this to your component
mockupCortes = [
  { id: 1, user_id: 'demo_user', date: '2025-05-30', number_transactions: 5, total: '625.00' }
];

get mockupPaginatedCortes() {
  const start = this.pageIndex * this.pageSize;
  return this.mockupCortes.slice(start, start + this.pageSize);
}

  get paginatedTransactions(): Total_transaction[] {
    const start = this.pageIndex * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.markForCheck();
  }

  
  fetchTransactions() {
    this.transactionService.getAllTotalTransactionsByDate(this.dateString).subscribe({
      next: (transactions) => {
        this.transactions = [...transactions];
        this.pageIndex = 0; // Reset to first page on new data
        this.cdr.markForCheck();
      },
      error: (err) => {
        if (err.status === 404) {
          this.transactions = [];
          this.pageIndex = 0;
          this.cdr.markForCheck();
        } else {
          console.error('Error fetching transactions:', err);
        }
      }
    });
  }

  createTotalTransaction() {
    const newTransaction: Total_transaction = {
      user_id: JSON.parse(localStorage.getItem('User') || '{}').id, // Example user ID
      date: new Date(this.dateString)
    };

    this.transactionService.createTotalTransaction(newTransaction).subscribe({
      next: (transaction) => {
        this.transactions.unshift(transaction);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
      }
    });
  }

  onLoginClick(){
    // Redirect to login page
    this.router.navigate(['/login']);
  }

}
