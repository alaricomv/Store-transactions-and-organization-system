import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-transaction-page',
  imports: [CommonModule],
  templateUrl: './transaction-page.component.html',
  styleUrls: ['./transaction-page.component.css']
})
export class TransactionPageComponent {

  // Transaction data provided by the parent
  @Input() transaction!: Transaction;

  // Output to signal that the modal should be closed
  @Output() close = new EventEmitter<void>();

  user!: User;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  closedDialog(): void {
    // Emit the close event so the parent hides this modal
    this.close.emit();
  }

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
      this.close.emit();
      window.location.reload();
    }, error => {
      console.error('Error deleting transaction:', error);
    });
  }

  formatDate(date: string | Date | undefined): string {
  if (!date) {
    return 'Fecha no disponible'; // Fallback
  }

  // Explicitly check for English and default to Spanish otherwise
  const language = window.navigator.language.includes('en') ? 'en-GB' : 'es-ES';

  return new Intl.DateTimeFormat(language, 
    language === 'es-ES'
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } // Spanish format
      : { day: '2-digit', month: '2-digit', year: '2-digit' } // English format
  ).format(new Date(date));
}
}