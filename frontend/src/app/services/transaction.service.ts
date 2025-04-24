import { Injectable } from '@angular/core';
import { Transaction } from '../shared/models/transaction';
import { sample_transactions } from '../../data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LAST_TRANSACTIONS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http:HttpClient) { }

  getAll():Transaction[]{
    return sample_transactions;
  }

  getLastthree():Observable<Transaction[]>{
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const userId = user.id; // Get the user ID from local storage
    const url = `${LAST_TRANSACTIONS_URL}/${userId}`; // Construct the full URL
    console.log('HTTP Request URL:', url); // Log the URL to the console
    return this.http.get<Transaction[]>(url);
  }

  getTransactionById(id: number):Transaction {
    return this.getAll().find(transaction => transaction.id == id) ?? new Transaction();
  }
}
