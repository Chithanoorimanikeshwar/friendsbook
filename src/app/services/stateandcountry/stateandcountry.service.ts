import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export type countryModel={
 
    id: number,
    name:string,
    iso2: string
 
}
export type stateModel={
  id: number,
    name:string,
    iso2: string
}
export type cityModel={
  id:number,
  name:string
}
@Injectable({
  providedIn: 'root'
})
export class StateandcountryService {

  constructor(
    private http:HttpClient
  ) {}
   getCountriesList():Observable<countryModel[]>{
    const headers = new HttpHeaders()
    .set('X-CSCAPI-KEY','cHFlaEFmendRRDZsdFZKY3NPOUVBZXkwWm90NHpNNUcwM3pydlpqTQ==')
    const requestOptions = {
      headers: headers,
      redirect: 'follow'
    };

    // Make the API request using HttpClient
    return this.http.get<countryModel[]>('https://api.countrystatecity.in/v1/countries', requestOptions)
    
  }
  getStateListByCountry(country:string):Observable<stateModel[]>{
    const headers = new HttpHeaders()
    .set('X-CSCAPI-KEY','cHFlaEFmendRRDZsdFZKY3NPOUVBZXkwWm90NHpNNUcwM3pydlpqTQ==')
    const requestOptions = {
      headers: headers,
      redirect: 'follow'
    };

    // Make the API request using HttpClient
    return this.http.get<countryModel[]>(`https://api.countrystatecity.in/v1/countries/${country}/states`, requestOptions)
    
  }
  getCitiesListByCity(country:string,city:string):Observable<cityModel[]>{
    const headers = new HttpHeaders()
    .set('X-CSCAPI-KEY','cHFlaEFmendRRDZsdFZKY3NPOUVBZXkwWm90NHpNNUcwM3pydlpqTQ==')
    const requestOptions = {
      headers: headers,
      redirect: 'follow'
    };

    // Make the API request using HttpClient
    return this.http.get<cityModel[]>(`https://api.countrystatecity.in/v1/countries/${country}/states/${city}/cities`, requestOptions)
    
  }
}



