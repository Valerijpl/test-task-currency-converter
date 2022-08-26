import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CurrencyService } from '../../services/currency/currency.service';
import * as moment from "moment";


@Component({
  selector: 'app-currency-converter-input',
  templateUrl: './currency-converter-input.component.html',
  styleUrls: ['./currency-converter-input.component.scss']
})
export class CurrencyConverterInputComponent implements OnInit {
  public currencyConverterForm!: FormGroup;

  public currencies: string[] = [
    "USD", "EUR", "JPY", "GBP", "AUD", "CHF", "CNY", "HKD", "MXN", "INR"
  ];

  public dateRange = {
    startDate: moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD').toString(),
    endDate: moment(new Date()).format('YYYY-MM-DD').toString()
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

  getCurrencyExchangeRate(){
    this.currencyService.getCurrencyExchangeRate(this.dateRange).subscribe(result => {
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
    this.dateRange = {
      startDate: moment(event.startDate).subtract(1, 'days').format('YYYY-MM-DD').toString(),
      endDate: moment(event.startDate).format('YYYY-MM-DD').toString()
    }

    this.getCurrencyExchangeRate();
  }
}
