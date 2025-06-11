import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Total_transaction } from '../../../shared/models/total_transactions';
import { TransactionService } from '../../../services/transaction.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-total-transaction-page',
  imports: [CommonModule],
  templateUrl: './total-transaction-page.component.html',
  styleUrls: ['./total-transaction-page.component.css']
})
export class TotalTransactionPageComponent {
  // Receive the total transaction via an input property instead of MAT_DIALOG_DATA
  @Input() totaltransaction!: Total_transaction;

  // Output event emitter to signal the parent to close the modal
  @Output() close = new EventEmitter<void>();

  user!: User;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {
    // Subscribe to user observable to get user details
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  // When the close button is clicked, emit the close event
  closedDialog(): void {
    this.close.emit();
  }

  // Delete the transaction, then emit the close event and reload the page
  deleteTransaction(id: string): void {
    this.transactionService.deleteTotalTransaction(id).subscribe(() => {
      console.log('Transaction deleted successfully');
      this.close.emit();
      window.location.reload();
    }, error => {
      console.error('Error deleting transaction:', error);
    });
  }

  ngOnInit(){
    console.log('TotalTransactionPageComponent initialized with transaction:', this.totaltransaction);
  }
}
