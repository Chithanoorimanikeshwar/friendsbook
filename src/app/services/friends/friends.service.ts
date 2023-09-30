import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { env } from 'src/environment';
export interface Friend{
  message:string
}
export interface RequestModel{
  _id:string;
  userId:string;
  friendId:string;
  status:string;
  createdDate:string;
  _v:number;
  id:string;
  friend?:boolean
}
@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  public userId=this.store.selectSnapshot((state)=>state.UserDetails.userDetails)
  constructor(
    private http:HttpClient,
    private store:Store
  ) { }
  public sendRequest(friendId:string):Observable<Friend>{
    return this.http.post<Friend>(`${env.apiBaseUrl}friends/createrequest`,{
      userId:this.userId._id,
      friendId,
      status:"Request Pending"
    })
  }
  public acceptFriendRequest(friendId:string,requestId:string):Observable<{}>{
    return this.http.put<{}>(`${env.apiBaseUrl}friends/${requestId}`,{
      userId:this.userId._id,
      friendId,
      status:"you are friend"
    })
  }
  public FriendRequests():Observable<RequestModel[]>{
    return this.http.get<RequestModel[]>(`${env.apiBaseUrl}friends/`)
  }
  public FriendRequestById(RequestId:string):Observable<RequestModel>{
    return this.http.get<RequestModel>(`${env.apiBaseUrl}friends/${RequestId}`)
  }
}
