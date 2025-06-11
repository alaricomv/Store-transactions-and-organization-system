import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastTotalTransactionsComponent } from './last-total-transactions.component';

describe('LastTotalTransactionsComponent', () => {
  let component: LastTotalTransactionsComponent;
  let fixture: ComponentFixture<LastTotalTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastTotalTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastTotalTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
