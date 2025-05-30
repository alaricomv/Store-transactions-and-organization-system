import { Component, Inject } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';

@Component({
    selector: 'app-transaction-page',
    imports: [CommonModule],
    templateUrl: './transaction-page.component.html',
    styleUrl: './transaction-page.component.css'
})
export class TransactionPageComponent {

  user!: User;

  constructor(@Inject(MAT_DIALOG_DATA) public transaction: Transaction, 
  activatedRoute:ActivatedRoute,
  private transactionService: TransactionService,
  private userService: UserService,
  private dialogRef: MatDialogRef<TransactionPageComponent>) {
    activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.transactionService.getTransactionById(params['id']).subscribe((transaction) => {
          this.transaction = transaction;
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

  // Function to print the page, includes a small html call to css file to format the print page.
  printPage(): void {
    const printContent = document.getElementById('printable-section');
    if (printContent) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <link id="print-stylesheet" rel="stylesheet" type="text/css" href="/assets/print-styles.css">
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
  
        // Wait for the CSS to load before triggering the print dialog
        const stylesheet = printWindow.document.getElementById('print-stylesheet') as HTMLLinkElement;
        if (stylesheet) {
          stylesheet.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          };
        }
      }
    }
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id).subscribe(() => {
      console.log('Transaction deleted successfully');
      this.dialogRef.close();
      window.location.reload();
    }, error => {
      console.error('Error deleting transaction:', error);
    });
  }

}
