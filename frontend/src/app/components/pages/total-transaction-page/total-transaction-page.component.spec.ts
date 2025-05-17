import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTransactionPageComponent } from './total-transaction-page.component';

describe('TotalTransactionPageComponent', () => {
  let component: TotalTransactionPageComponent;
  let fixture: ComponentFixture<TotalTransactionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTransactionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalTransactionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
