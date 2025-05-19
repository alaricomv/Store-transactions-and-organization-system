import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListPageComponent } from './transaction-list-page.component';

describe('TransactionListPageComponent', () => {
  let component: TransactionListPageComponent;
  let fixture: ComponentFixture<TransactionListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
