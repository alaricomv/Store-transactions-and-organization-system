import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Total_transaction } from '../../../shared/models/total_transactions';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';

@Component({
    selector: 'app-total-transaction-page',
    imports: [CommonModule],
    templateUrl: './total-transaction-page.component.html',
    styleUrl: './total-transaction-page.component.css'
})
export class TotalTransactionPageComponent {

  user!: User;

  constructor(@Inject(MAT_DIALOG_DATA) public totaltransaction: Total_transaction, 
    activatedRoute:ActivatedRoute,
    private transactionService: TransactionService,
    private userService: UserService,
    private dialogRef: MatDialogRef<TotalTransactionPageComponent>) { activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.transactionService.getTotalTransactionbyId(params['id']).subscribe((totaltransaction) => {
          this.totaltransaction = totaltransaction;
        });
      }
    });

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });

  }

  closedDialog(): void{
    this.dialogRef.close();
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTotalTransaction(id).subscribe(() => {
      console.log('Transaction deleted successfully');
      this.dialogRef.close();
      window.location.reload();
    }, error => {
      console.error('Error deleting transaction:', error);
    });
  }

}
