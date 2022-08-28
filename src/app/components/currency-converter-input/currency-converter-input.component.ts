import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CurrencyService } from '../../services/currency/currency.service';
import * as moment from "moment";
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-currency-converter-input',
  templateUrl: './currency-converter-input.component.html',
  styleUrls: ['./currency-converter-input.component.scss']
})
export class CurrencyConverterInputComponent implements OnInit, OnDestroy {
  public currencyConverterForm!: FormGroup;

  private destroyed$ = new ReplaySubject<boolean>();

  public currencies: string[] = [
    "USD", "EUR", "JPY", "GBP", "AUD", "CHF", "CNY", "HKD", "MXN", "INR"
  ];

  public dateRange = {
    startDate: this.getStartDateRange(new Date()),
    endDate: moment(new Date()).utcOffset('-0400').format('YYYY-MM-DD').toString()
  };

  public maxDate = moment(new Date());

  public minDate = moment(new Date('2017-01-03'));

  public exchangeRateDaily: any = null;

  constructor(private fb: FormBuilder, private currencyService: CurrencyService) {
  }

  ngOnInit(): void {
    this.getCurrencyExchangeRate();

    this.currencyConverterForm = this.fb.group({
      amount: [0, Validators.required],
      currency: ['USD'],
      convertedAmount: [0],
      conversionRate: [0]
    });

    this.currencyConverterForm.get('currency')?.valueChanges.subscribe((selectedValue: string) => {
      this.resetAmountValues(selectedValue);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  getStartDateRange(endDate: Date){
    // THIS SCRIPT ALLOWS TO DEFINE LATEST UPDATE OF DAILY EXCHANGE RATE FROM BANK OF CANADA, COVERING WEEKEND DAYS AND TIME BEFORE DAILY UPDATE

    let weekDay = moment(endDate).utcOffset('-0400').format('dddd').toString();

    if (weekDay == 'Sunday'){
      return moment(endDate).subtract(2, 'days').utcOffset('-0400').format('YYYY-MM-DD').toString()
    } else if (weekDay == 'Saturday'){
      return moment(endDate).subtract(1, 'days').utcOffset('-0400').format('YYYY-MM-DD').toString()
    } else {
      if (moment(endDate).utcOffset('-0400').set({hour:16,minute:30}).toDate() > endDate){
        return moment(endDate).subtract(1, 'days').utcOffset('-0400').format('YYYY-MM-DD').toString()
      } else {
        return moment(endDate).utcOffset('-0400').format('YYYY-MM-DD').toString();
      }
    }
  }

  getCurrencyExchangeRate(){
    this.currencyService.getCurrencyExchangeRate(this.dateRange).pipe(takeUntil(this.destroyed$)).subscribe(result => {
      this.exchangeRateDaily = result.observations[result.observations.length - 1];
      this.resetAmountValues(this.currencyConverterForm.value.currency);
    }, err => {

    });
  }

  calculateAmount(){
    let amount = this.currencyConverterForm.value.convertedAmount * this.currencyConverterForm.value.conversionRate;
    this.currencyConverterForm.patchValue({amount: amount.toFixed(4)});
  }

  calculateConvertedAmount(){
    let convertedAmount = this.currencyConverterForm.value.amount / this.currencyConverterForm.value.conversionRate;
    this.currencyConverterForm.patchValue({convertedAmount: convertedAmount.toFixed(4)});
  }

  resetAmountValues(selectedValue: string){
    this.currencyConverterForm.patchValue({
      amount: 0,
      convertedAmount: 0,
      conversionRate: this.exchangeRateDaily['FX' + selectedValue + 'CAD'].v
    });
  }

  setCustomDate(event: any){
    let selectedDate;

    if (moment(event.startDate).isSame(moment(), 'day')){
      selectedDate = new Date()
    } else {
      selectedDate = moment(event.startDate).set({hour: 23, minute: 59}).toDate();
    }

    this.dateRange = {
      startDate: this.getStartDateRange(selectedDate),
      endDate: moment(selectedDate).format('YYYY-MM-DD').toString()
    }

    this.getCurrencyExchangeRate();
  }
}
