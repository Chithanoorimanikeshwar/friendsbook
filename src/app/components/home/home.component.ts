import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { UserProfilePic } from 'src/app/store/actions/files-action.service';
import { ClearNavbar, SetNavbar } from 'src/app/store/actions/navbar-action.service';
import { SetData } from 'src/app/store/actions/user-action.service';
import { UserDetails } from 'src/app/store/state/user-details.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations:[fadeInOut]
})
export class HomeComponent implements OnInit {
@Select(UserDetails.getBasicUserInfo) userdetails$!:Observable<any>
  @Select(UserDetails.userLoaded) userloaded$!:Observable<boolean>
  constructor(
    private store:Store,
    private userService:HttpclientService
  ){}
  ngOnInit(): void {
    this.userdetails$.subscribe({
      next:(res)=>{
        this.userService.updateUserInfo(res._id,{isActive:true})
      }
    })
   
    console.log(this.store.selectSnapshot)
    // this.store.dispatch(new SetData({ key: 'UserDetails' }));
    this.userloaded$.subscribe({
    
      next:(userloaded)=>{
        console.log(userloaded)
        if(userloaded){
          this.store.dispatch([new ClearNavbar,new SetNavbar(['profile'])])
        }
        else{
          this.store.dispatch([new ClearNavbar,new SetNavbar(['register','login'])])
        }
      }
    })

  }

}
