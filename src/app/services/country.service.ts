import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'https://restcountries.com/v3.1/all';

  constructor(private httpClient: HttpClient) {}


  // return Observable of an array of countries.
  getCountries(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);

  }
  

}
