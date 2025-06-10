import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { CalculatorComponent } from "../../partials/calculator/calculator.component";
import { LastTransactionsComponent } from "../../partials/last-transactions/last-transactions.component";
import { Observable } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ButtonModule } from 'primeng/button';
import AOS from "aos";


registerLocaleData(localeEs); // Register Spanish locale

@Component({
    selector: 'app-home',
    imports: [CommonModule, CalculatorComponent, LastTransactionsComponent, AnimateOnScrollModule, ButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    providers: [{ provide: LOCALE_ID, useValue: 'es' }],// Set locale to Spanish
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent{

  ngOnInit() {
    AOS.init();
  }

  lasttransactions:Transaction[] = [];

  transactions:Transaction[] = [];
  constructor(private transactionService:TransactionService) {
    let transactionsObservable:Observable<Transaction[]>;

    transactionsObservable = transactionService.getLastthree();

    this.transactions = transactionService.getAll();
  }

  spaceBetween = 10;

  onProgress(event: CustomEvent<[Swiper, number]>) {
    const [swiper, progress] = event.detail;
  }



}
