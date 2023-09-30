import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, combineLatestAll, concatMap, debounceTime, distinctUntilChanged, filter, from, fromEvent, map, pluck, take, tap, toArray } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { userResponseModel } from 'src/app/models/usermodule';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { FriendsService, RequestModel } from 'src/app/services/friends/friends.service';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { UserProfilePic } from 'src/app/store/actions/files-action.service';
import { userProfile } from 'src/app/store/state/custom-seletor.factory';
import { FileServices } from 'src/app/store/state/files-state.services';
export interface searchUserModel extends userResponseModel{
  FriendRequestSent:boolean;
  FriendRequestReceived:boolean;
  AlreadyFriend:boolean;
  RequestId:string

}
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css'],
  animations:[fadeInOut]
})
export class NetworkComponent implements OnInit,AfterViewInit{
  public users:searchUserModel[];
  public friendRequest:userResponseModel[];
  public isloading:boolean;
  public userdata=this.store.selectSnapshot((state)=>state.UserDetails.userDetails)
  @ViewChild('searchform') search!: NgForm;
  private searchData:string
  public requestbtnClass:string;
  private usersData:userResponseModel[]
  private friendRequests:RequestModel[]
  constructor(
    private render:Renderer2,
    private http:HttpclientService,
    private friendsService:FriendsService,
    private store:Store,
    private fileService:FileuploadService
  ){
    this.requestbtnClass="btn-outline-secondary";
    this.users=[];
    this.searchData='';
    this.usersData=[];
    this.friendRequest=[];
    this.friendRequests=[];
    this.isloading=true;
  }
  ngAfterViewInit(): void {
    this.FriendRequestz();
    this.Users();
   this.search.valueChanges?.pipe(
    debounceTime(500),
    distinctUntilChanged()
   ).subscribe({
    next:(res)=>{
      this.searchData=res.search
      console.log('searchResult',this.searchData);
      this.fetchUsers()
    }
   });
  }
 
  ngOnInit(): void {
  
  
  }
  
  public fetchUsers(){
    from(this.usersData).pipe(
      // tap((res)=>console.log(res)),
      filter((res)=>{
        // console.log('searchlength',this.searchData.length)
        if(this.searchData.length<=0){
          return this.friendRequests.some(friendRequest=>friendRequest.friendId === res._id || friendRequest.userId === res._id)
        }
         return res.email.indexOf(this.searchData)>=0
      }),
      take(10),
      
      map(res => {
        let friendRequestStatus={
          RequestId:"",
          FriendRequestSent:false,
          FriendRequestReceived:false,
          AlreadyFriend:false,
        }
        this.friendRequests.map(friendRequest=>{
          if(friendRequest.friendId === res._id || friendRequest.userId === res._id){
            if(friendRequest.friendId === res._id) friendRequestStatus.FriendRequestSent=true;
            if(friendRequest.userId === res._id)  friendRequestStatus.FriendRequestReceived=true;
            if(friendRequest.status === 'you are friend') friendRequestStatus.AlreadyFriend=true;
            friendRequestStatus.RequestId=friendRequest._id
          }
        })
        return { ...res, 
           ...friendRequestStatus}
  


        // const isFriendRequestSent = this.friendRequests.some(friendRequest =>{
        //   RequestId=friendRequest._id
        //   return friendRequest.friendId === res._id
        // }
        //   );
        // const isFriendRequestReceived=this.friendRequests.some(friendRequest=>friendRequest.userId === res._id);
        
        // return { ...res, 
        //   FriendRequestSent: isFriendRequestSent,
        //   FriendRequestReceived:isFriendRequestReceived,
        //   AlreadyFriend:false,
        //   RequestId };

      }),
      toArray()).subscribe({
      next:(res)=>{
        console.log(res);
        this.users=res
      },
      error:(res)=>console.log(res),
    }) 
  }
  public FriendRequestz(){
    this.friendsService.FriendRequests().pipe(
      concatMap((res)=>from(res)),
      filter((res)=>res.userId===this.userdata._id || res.friendId===this.userdata._id),
      toArray()
     ).subscribe({
      next:(res)=>{
        console.log('friendRequest',res);
    this.isloading=false;
      this.friendRequests=res;
      this.fetchUsers()
    },
      error:(err)=>console.log(err)
     })
  }
  public Users(){
    this.http.getAllUsers().subscribe({
      next:(res)=>{
        this.usersData=res;
        
      }
     })
  }
  public btnClicked(event:any,requestId:string,requestReceived:boolean){
    if(requestReceived){
      this.requestAcceptpbtnClicked(event,requestId);
    }
    else{
      this.requestbtnClicked(event);
    }
  }
public requestAcceptpbtnClicked(event:any,requestId:string){
  console.log("acceptbtnClicked",requestId)
  const element=event.target
  this.friendsService.acceptFriendRequest(element.id,requestId).subscribe({
    next:()=>{
      this.render.removeClass(element,'btn-success');
      this.render.removeClass(element,'btn-primary')
          this.render.addClass(element,'btn-outline-success');
          this.render.setAttribute(element,'aria-label','mutual friend');
          this.render.setProperty(element,'innerHTML','mutual friend');
    }
  })
}
  public requestbtnClicked(event:any){
    const addfriend=event.target.id
     const element=event.target;
  
    this.friendsService.sendRequest(addfriend).subscribe({
      next:(res)=>{
        console.log(res);
          this.render.removeClass(element,'btn-primary')
          this.render.addClass(element,'btn-outline-secondary');
          this.render.setAttribute(element,'aria-label','requestPending');
          this.render.setProperty(element,'innerHTML','Request Pending');
      }
    })
  }
  public friendshipStatus(user:searchUserModel){
    if (user.AlreadyFriend) {
      // User is already a friend
      return 'Mutual Friend';
  } else if (user.FriendRequestReceived) {
      // User has received a friend request
      return 'Accept Request';
  } else if (user.FriendRequestSent) {
      // User has sent a friend request, and it's pending
      return 'pending Request';
  } else {
      // User has no friend-related status
      return 'send Request';
  }
  }
  public userMoreInfo(userDetails:userResponseModel,profilePicElement:HTMLImageElement,event:MouseEvent){

   const imgElement=profilePicElement
   console.log(imgElement);
    const element=event.target as HTMLButtonElement
    console.log(element)
    console.log(element.ariaExpanded)
   
      if(element.ariaExpanded=='true'){
        
        const selector=userProfile(userDetails._id)
        this.store.select(selector).subscribe({
          next:(res)=>{
            console.log(`blob:${res}`);
            if(res) imgElement.src=`${res}`;
            else this.store.dispatch(new UserProfilePic(userDetails.photoId,userDetails._id));
    

            // Replace 'blobURL' with your actual Blob URL
            
          }
        })
      }
    return true;

  
  }
}
