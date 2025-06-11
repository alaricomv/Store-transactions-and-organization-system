import { Component } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../services/user.service';
import { DateTime } from 'luxon';  // Import Luxon for time zone handling

@Component({
    selector: 'app-calculator',
    templateUrl: './calculator.component.html',
    styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  input: string = '';
  result: string = '';
  user!: User;

  transactionClicked = false;
  totalTransactionClicked = false;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }
  
  pressNum(num: string) {
    // Do Not Allow . more than once
    if (num === ".") {
      if (this.input !== "") {
        const lastNum = this.getLastOperand();
        if (lastNum.lastIndexOf(".") >= 0) return;
      }
    }
 
    // Do Not Allow 0 at beginning. 
    if (num === "0") {
      if (this.input === "") return;
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+') {
        return;
      }
    }
 
    this.input = this.input + num;
    this.calcAnswer();
  }
 
  getLastOperand() {
    let pos: number;
    pos = this.input.lastIndexOf("+");
    if (this.input.lastIndexOf("-") > pos) pos = this.input.lastIndexOf("-");
    if (this.input.lastIndexOf("*") > pos) pos = this.input.lastIndexOf("*");
    if (this.input.lastIndexOf("/") > pos) pos = this.input.lastIndexOf("/");
    return this.input.substr(pos + 1);
  }
 
  pressOperator(op: string) {
    // Do not allow consecutive operators
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+') {
      return;
    }
    this.input = this.input + op;
    this.calcAnswer();
  }
 
  clear() {
    if (this.input !== "") {
      this.input = this.input.substr(0, this.input.length - 1);
    }
  }
 
  allClear() {
    this.result = '';
    this.input = '';
  }

  backspace() {
    if (this.input.length > 0) {
      this.input = this.input.slice(0, -1);
      if (this.input.length > 0) {
        this.calcAnswer();
      } else {
        this.result = '';
      }
    }
  }
 
  calcAnswer() {
    let formula = this.input;
    let lastKey = formula[formula.length - 1];
    if (lastKey === '.') {
      formula = formula.substr(0, formula.length - 1);
    }
    lastKey = formula[formula.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.') {
      formula = formula.substr(0, formula.length - 1);
    }
    console.log("Formula " + formula);
    this.result = eval(formula);
  }
 
  getAnswer() {
    this.calcAnswer();
    this.input = this.result;
    if (this.input == "0") this.input = "";
  }

  addTransaction() {
    // Prevent multiple clicks
    if (this.transactionClicked) {
      return;
    }
    this.transactionClicked = true;


    const totalvalue = Number(this.result);
    const transaction = {
      user_id: this.user.id,
      total: totalvalue
    };
    this.transactionService.createTransaction(transaction).subscribe((response) => {
      console.log('Transaction added successfully:', response);
      window.location.reload();
    },
    (error) => {
      console.error('Error adding transaction:', error);
      // Optionally re-enable the button in case of an error:
        this.transactionClicked = false;
    });
  }

  addTotalTransaction(): void {
    if (this.totalTransactionClicked) { return; }
    this.totalTransactionClicked = true;

    /* 1. grab local wall-clock time */
    const localNow = DateTime.local();                    // 2025-06-11 17:00 PDT

    /* 2. re-label it as UTC without changing the digits     *
     *    (so 17:00 “Pacific” becomes 17:00 “UTC”)           */
    const utcWallClock = localNow
      .setZone('utc', { keepLocalTime: true })            // 2025-06-11 17:00 UTC
      .toJSDate();                                        // plain JS Date

    
    const totaltransaction = {
      user_id: this.user.id,
      date: utcWallClock                                  // type is Date
    };

    this.transactionService.createTotalTransaction(totaltransaction)
      .subscribe({
        next: res => {
          console.log('✅ Total Transaction added', res);
           window.location.reload();
          this.totalTransactionClicked = false;
        },
        error: err => {
          console.error('❌ Error adding Total Transaction', err);
          this.totalTransactionClicked = false;
        }
      });
  }


}
