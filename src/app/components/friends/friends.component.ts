import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { concatMap, debounceTime, distinctUntilChanged, filter, from, map, of, switchMap, take, tap, toArray } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { userResponseModel } from 'src/app/models/usermodule';
import { FriendsService, RequestModel } from 'src/app/services/friends/friends.service';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { UserProfilePic } from 'src/app/store/actions/files-action.service';
import { userProfile } from 'src/app/store/state/custom-seletor.factory';
export interface friendModel extends userResponseModel{
  imageUrl?:string,
}
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
  animations:[fadeInOut]
})
export class FriendsComponent implements OnInit{
  public loading=true
  @ViewChild('searchform') search!: NgForm;
  public userdata=this.store.selectSnapshot((state)=>state.UserDetails.userDetails)
  private friendRequests:RequestModel[]
  public isloading:boolean;
  public userFriends:friendModel[]
  constructor(
    private friendsService:FriendsService,
    private store:Store,
    private userhttp:HttpclientService,
    private route:Router
  ){
    this.friendRequests=[]
    this.isloading=true;
    this.userFriends=[]
  }
  ngOnInit(): void {
    this.FriendRequestz();
  }
  FriendRequestz() {
    this.friendsService.FriendRequests().pipe(
      concatMap((res)=>from(res)),
      filter((res)=>res.userId===this.userdata._id || res.friendId===this.userdata._id),
      filter((res)=>res.status==="you are friend"),
      filter((res)=>res.userId!==this.userdata._id),
      toArray()
     ).subscribe({
      next:(res)=>{
        console.log('friendRequest',res);
      this.isloading=false;
      this.friendRequests=res;
        this.fetchUsers(10)
    },
      error:(err)=>console.log(err)
     })
  
  }
  fetchUsers(howMuch:number) {
    from(this.friendRequests).pipe(
      take(howMuch),
      concatMap((res)=>{
        
        return this.userhttp.getUser(res.userId)
      
      }),
      toArray()
    ).subscribe({
      next:(res)=>{
        console.log(res)
        this.userFriends=res
        this.loading=false
      }
    })
  }
 public getImageUrl(userId:string,photoId:string){
  let imageUrl:string
  const selector=userProfile(userId);
  return this.store.select(selector).pipe(
    switchMap((res)=>{
      if(res){
        return of(res)
      }
      else{
        this.store.dispatch(new UserProfilePic(photoId,userId))
        return this.store.select(selector)
      }
    })
  )
 
}
public userMoreInfo(userId:string){
  this.route.navigate(['friendspace',userId])
  return true
}
public isEmpty(){
  return this.userFriends.length<=0?false:true
}
}
