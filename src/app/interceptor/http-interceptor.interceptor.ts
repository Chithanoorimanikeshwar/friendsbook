import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserDetails, userDetailsModel } from '../store/state/user-details.service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private store:Store
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const {url}=request
    if(url==="https://api.countrystatecity.in/v1/countries"){
      return next.handle(request);
    }
    const userData = this.store.selectSnapshot((state) => state.UserDetails.userDetails);
    const token=userData.token;
    
    if(token){
    // console.log(token);
        const req = request.clone({
          setHeaders: {
            Authorization:`Bearer ${token}`
          }
        });
        return next.handle(req)
      }
      // return new Observable<HttpEvent<any>>();
      return next.handle(request);
   

    // Pass the modified request to the next handler
   
  }

}
