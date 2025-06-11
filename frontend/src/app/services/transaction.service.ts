import { Injectable } from '@angular/core';
import { Transaction } from '../shared/models/transaction';
import { sample_transactions } from '../../data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LAST_TOTAL_TRANSACTIONS_URL, LAST_TRANSACTIONS_URL, TOTAL_TRANSACTIONS_BY_DATE_URL, TOTAL_TRANSACTIONS_BY_ID_URL, TOTAL_TRANSACTIONS_URL, TRANSACTION_BY_DATE_URL, TRANSACTION_BY_ID_URL, TRANSACTIONS_URL } from '../shared/constants/urls';
import { Total_transaction } from '../shared/models/total_transactions';

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
    return this.http.get<Transaction[]>(url);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(TRANSACTION_BY_ID_URL + id);
  }

  getAllTransactionsByDate(date: string): Observable<Transaction[]> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const userId = user.id; // Get the user ID from local storage
    const url = `${TRANSACTION_BY_DATE_URL}${date}/${userId}`; // Construct the full URL
    return this.http.get<Transaction[]>(url);
  }

  deleteTransaction(id: string): Observable<any> {
    const url = `${TRANSACTION_BY_ID_URL}${id}`; // Construct the full URL
    return this.http.put<Transaction>(url, { deleted: true });
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    const url = TRANSACTIONS_URL; // Construct the full URL
    return this.http.post<Transaction>(url, transaction);
  }

  //Total Transactions

  createTotalTransaction(totalTransaction:Total_transaction): Observable<Total_transaction> {
    const url = TOTAL_TRANSACTIONS_URL; // Construct the full URL
    return this.http.post<Total_transaction>(url, totalTransaction); 
  }

  getLastTotalTransactions(): Observable<Total_transaction[]> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const userId = user.id; // Get the user ID from local storage
    const url = `${LAST_TOTAL_TRANSACTIONS_URL}/${userId}`; // Construct the full URL
    return this.http.get<Total_transaction[]>(url);
  }

  getTotalTransactionbyId(id: number): Observable<Total_transaction> {
    return this.http.get<Total_transaction>(TOTAL_TRANSACTIONS_BY_ID_URL + id);
  }

  getAllTotalTransactionsByDate(date: string): Observable<Total_transaction[]> {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const userId = user.id; // Get the user ID from local storage
    const url = `${TOTAL_TRANSACTIONS_BY_DATE_URL}${date}/${userId}`; // Construct the full URL
    return this.http.get<Total_transaction[]>(url);
  }

  deleteTotalTransaction(id: string): Observable<any> {
    const url = `${TOTAL_TRANSACTIONS_BY_ID_URL}${id}`; // Construct the full URL
    return this.http.delete(url);
  }


}
