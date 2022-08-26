import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyConverterInputComponent } from './currency-converter-input.component';

describe('CurrencyConverterInputComponent', () => {
  let component: CurrencyConverterInputComponent;
  let fixture: ComponentFixture<CurrencyConverterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrencyConverterInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyConverterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
