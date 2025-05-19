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

@Component({
  selector: 'app-total-transaction-list-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatPaginatorModule, 
    MatDatepickerModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './total-transaction-list-page.component.html',
  styleUrl: './total-transaction-list-page.component.css'
})
export class TotalTransactionListPageComponent {
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


  constructor(private transactionService: TransactionService, private cdr: ChangeDetectorRef) {
    

  }

  ngOnInit() {
    // Initial load
    this.fetchTransactions();

    // Subscribe to date changes
    this.date.valueChanges.subscribe(() => {
      this.fetchTransactions();
    });
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

}
