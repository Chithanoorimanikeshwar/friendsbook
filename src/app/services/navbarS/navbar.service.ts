import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private subject:Subject<string>
  public observable$:Observable<string>
  constructor() { 
    this.subject=new Subject();
    this.observable$=this.subject.asObservable();
  }
  public post(data:string){
    this.subject.next(data)
  }
}
