import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, map, share, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  getCurrencyExchangeRate(dateRange: any): Observable<any> {
    let headers = new HttpHeaders({});

    return this.http.get(`https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/json?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`, { headers: headers }).pipe(share()).pipe(map((response: any) => {
      return response;
    }), catchError(err => {
      console.log(err);
      return err;
    }));
  }
}
