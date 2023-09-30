import { Component, HostListener, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, filter } from 'rxjs';
// import { timeout } from 'rxjs';
import { NavbarService } from 'src/app/services/navbarS/navbar.service';
import { NavList } from 'src/app/store/state/navbar-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
public shownavbar:boolean;
public shortcutactivated:boolean;
public routes:string[]
@Select(NavList.getState) navlist$!:Observable<string[] | boolean>
@HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY;
    // console.log('Vertical scroll position:', scrollPosition);
        if(scrollPosition>=290 || scrollPosition>=250){
          this.shortcutactivated=false;
          this.shownavbar=false;
        }
        else{
        this.shownavbar=true
        this.shortcutactivated=false;

        }
  }
constructor(
  private routeService:NavbarService,
  private store:Store
){
  this.shownavbar=true;
  this.shortcutactivated=false;
  this.routes=[]
}
ngOnInit(): void {
  this.navlist$.subscribe({
    next:(navitems)=>{
      if(navitems){
        this.routes=navitems as string[]
      }
    }
  })
}



public navbarShortcutClicked(){
  this.shownavbar=true;
  this.shortcutactivated=true;
}
public closeNavbarShortcut(){
  if(this.shortcutactivated && this.shownavbar){
    this.shortcutactivated=false;
    this.shownavbar=false;
  }
}
// ngDoCheck(): void {
//     this.routeService.observable$.pipe(
//       // tap(value=>console.log(value)),
//       filter(value=>
//         !(this.routes.includes(value))
//       ))
//     .subscribe({
//       next:(data)=>{
//         this.routes.push(data)
//       }
//     })
//   }
}

