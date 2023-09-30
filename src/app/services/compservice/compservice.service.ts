import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, delay } from 'rxjs';
import { friendModel } from 'src/app/components/friends/friends.component';

@Injectable({
  providedIn: 'root'
})
export class CompserviceService implements OnInit {
  private postman$!:Subject<friendModel>
  private postBox$!:Observable<friendModel>
  constructor() {
    
   }
  ngOnInit(): void {
    this.postman$=new Subject<friendModel>
    this.postBox$=this.postman$.asObservable()
  }
  public post(userDetails:friendModel){
    this.postman$.next(userDetails)
  }
  public get():Observable<friendModel>{
    return this.postBox$.pipe(delay(2000))
  }
  public complete(){
    this.postman$.complete()
  }

}
