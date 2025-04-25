import { Component, Inject } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-page.component.html',
  styleUrl: './transaction-page.component.css'
})
export class TransactionPageComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public transaction: Transaction, 
  activatedRoute:ActivatedRoute,
  private transactionService: TransactionService,
  private dialogRef: MatDialogRef<TransactionPageComponent>) {
    activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.transactionService.getTransactionById(params['id']).subscribe((transaction) => {
          this.transaction = transaction;
        });
      }
    });

  }

  closedDialog(): void{
    this.dialogRef.close();
  }
  printPage(): void {
    window.print();
  }

}
