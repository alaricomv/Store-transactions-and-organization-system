import { Component } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { User } from '../../../shared/models/user';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-calculator',
    imports: [],
    templateUrl: './calculator.component.html',
    styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  input:string = '';
  result:string = '';
  user!: User;

  constructor(
    private transactionService:TransactionService,
    private userService: UserService
  ){
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }
  
 
  pressNum(num: string) {
    
    //Do Not Allow . more than once
    if (num==".") {
      if (this.input !="" ) {
 
        const lastNum=this.getLastOperand()
        console.log(lastNum.lastIndexOf("."))
        if (lastNum.lastIndexOf(".") >= 0) return;
      }
    }
 
    //Do Not Allow 0 at beginning. 
    //Javascript will throw Octal literals are not allowed in strict mode.
    if (num=="0") {
      if (this.input=="" ) {
        return;
      }
      const PrevKey = this.input[this.input.length - 1];
      if (PrevKey === '/' || PrevKey === '*' || PrevKey === '-' || PrevKey === '+')  {
          return;
      }
    }
 
    this.input = this.input + num
    this.calcAnswer();
  }
 
 
  getLastOperand() {
    let pos:number;
    console.log(this.input)
    pos=this.input.toString().lastIndexOf("+")
    if (this.input.toString().lastIndexOf("-") > pos) pos=this.input.lastIndexOf("-")
    if (this.input.toString().lastIndexOf("*") > pos) pos=this.input.lastIndexOf("*")
    if (this.input.toString().lastIndexOf("/") > pos) pos=this.input.lastIndexOf("/")
    console.log('Last '+this.input.substr(pos+1))
    return this.input.substr(pos+1)
  }
 
 
  pressOperator(op: string) {
 
    //Do not allow operators more than once
    const lastKey = this.input[this.input.length - 1];
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+')  {
      return;
    }
   
    this.input = this.input + op
    this.calcAnswer();
  }
 
 
  clear() {
    if (this.input !="" ) {
      this.input=this.input.substr(0, this.input.length-1)
    }
  }
 
  allClear() {
    this.result = '';
    this.input = '';
  }
 
  calcAnswer() {
    let formula = this.input;
 
    let lastKey = formula[formula.length - 1];
 
    if (lastKey === '.')  {
      formula=formula.substr(0,formula.length - 1);
    }
 
    lastKey = formula[formula.length - 1];
 
    if (lastKey === '/' || lastKey === '*' || lastKey === '-' || lastKey === '+' || lastKey === '.')  {
      formula=formula.substr(0,formula.length - 1);
    }
 
    console.log("Formula " +formula);
    this.result = eval(formula);
  }
 
  getAnswer() {
    this.calcAnswer();
    this.input = this.result;
    if (this.input=="0") this.input="";
  }

  addTransaction() {
    const totalvalue = Number(this.result);
    const transaction = {
      user_id: this.user.id,
      total: totalvalue
    };
    this.transactionService.createTransaction(transaction).subscribe((response) => {
      console.log('Transaction added successfully:', response);
      window.location.reload();
    }
    , (error) => {
      console.error('Error adding transaction:', error);
    }
    );
  }

  addTotalTransaction() {
    const now = new Date();
    const datetoday: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()); // Create a Date object in YYYY-MM-DD format

    const totaltransaction = {
      user_id: this.user.id,
      date: datetoday
    }

    console.log(totaltransaction);
    this.transactionService.createTotalTransaction(totaltransaction).subscribe((response) => {
      console.log('Total Transaction added successfully:', response);
      //window.location.reload();
    }
    , (error) => {
      console.error('Error adding Total Transaction:', error);
    }
    );
  }

}
