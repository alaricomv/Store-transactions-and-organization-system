import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTransactionListPageComponent } from './total-transaction-list-page.component';

describe('TotalTransactionListPageComponent', () => {
  let component: TotalTransactionListPageComponent;
  let fixture: ComponentFixture<TotalTransactionListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTransactionListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalTransactionListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
