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
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';
import { Router } from '@angular/router';

@Component({
    selector: 'app-transaction-list-page',
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
    templateUrl: './transaction-list-page.component.html',
    styleUrl: './transaction-list-page.component.css'
})
export class TransactionListPageComponent {

  user!: User;
  transactions: Transaction[] = [];

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


  constructor(private transactionService: TransactionService, private cdr: ChangeDetectorRef, private userService: UserService, private router: Router) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit() {
    // If not logged in, set datepicker to 30/05/2025
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

  mockupRows = [
  { id: "1-10", user: 1, date: '2025-05-30 21:00:00', total: '500.00', deleted: false },
  { id: "1-9",  user: 1, date: '2025-05-30 20:00:00', total: '90.00',  deleted: false },
  { id: "1-8",  user: 1, date: '2025-05-30 19:00:00', total: '150.00', deleted: false },
  { id: "1-7",  user: 1, date: '2025-05-30 18:00:00', total: '210.00', deleted: false },
  { id: "1-6",  user: 1, date: '2025-05-30 17:00:00', total: '60.00',  deleted: false },
  { id: "1-5",  user: 1, date: '2025-05-30 16:00:00', total: '320.00', deleted: true  },
  { id: "1-4",  user: 1, date: '2025-05-30 15:00:00', total: '180.00', deleted: false },
  { id: "1-3",  user: 1, date: '2025-05-30 14:00:00', total: '75.00',  deleted: false },
  { id: "1-2",  user: 1, date: '2025-05-30 13:00:00', total: '250.00', deleted: true  },
  { id: "1-1",  user: 1, date: '2025-05-30 12:00:00', total: '100.00', deleted: false }
];


get mockupPaginatedRows() {
  const start = this.pageIndex * this.pageSize;
  return this.mockupRows.slice(start, start + this.pageSize);
}


  get paginatedTransactions(): Transaction[] {
    const start = this.pageIndex * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.markForCheck();
  }

  
  fetchTransactions() {
    this.transactionService.getAllTransactionsByDate(this.dateString).subscribe({
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

  onLoginClick(){
    // Redirect to login page
    this.router.navigate(['/login']);
  }

}
