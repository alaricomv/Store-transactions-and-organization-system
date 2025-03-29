import { Injectable } from '@angular/core';
import { Transaction } from '../shared/models/transaction';
import { sample_transactions } from '../../data';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }

  getAll():Transaction[]{
    return sample_transactions;
  }

  getLastthree():Transaction[]{
    return sample_transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
      .slice(0, 3); // Get the last 3 transactions
  }
}
