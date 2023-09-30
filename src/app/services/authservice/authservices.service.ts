import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private store:Store
  ) { }
  public isAuthenticated():boolean{
    const userData = this.store.selectSnapshot((state) => state.UserDetails.userDetails);
    const token=userData.token;
    console.log(token)
    if(token){
      return true
    }
    else{
      return false
    }

  }
}