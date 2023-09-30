import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { userResponseModel } from 'src/app/models/usermodule';
import { UserProfilePic } from 'src/app/store/actions/files-action.service';
import { userProfile } from 'src/app/store/state/custom-seletor.factory';
import { UserDetails } from 'src/app/store/state/user-details.service';
export interface ProfileModel extends userResponseModel{
  profileUrl?:string
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public userDetails:ProfileModel
@Input() isfriendspaceactive!:boolean
@Input() profileUrl!:string
public username:string;
@Input('UserDetails') userdetails$!:Observable<any>
constructor(
  private store:Store
){
  this.username="user"
  this.userDetails={
    profileUrl:"assets/person-fill.svg",
  } as ProfileModel
}
  ngOnInit(): void {
    this.userdetails$.subscribe({
      next:(userinfo)=>{
        userinfo as userResponseModel
        this.username=userinfo.firstName + userinfo.lastName
        this.userDetails=userinfo
        const selector=userProfile(this.userDetails._id)
        this.store.select(selector).subscribe({
          next:(res)=>{
            if(res) this.userDetails.profileUrl=res
            else this.store.dispatch(new UserProfilePic(this.userDetails.photoId,this.userDetails._id));
          }
        })
      }
    }) 
  }
  public updateForeProfile(){
    console.log('iam ckcicked');
    
  }
}
