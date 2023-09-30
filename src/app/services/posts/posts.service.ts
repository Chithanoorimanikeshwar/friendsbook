import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environment';
export type postModel={
  
  createdDate:string
  id: string
  isActive: boolean
  isAdmin: boolean
  post: string
  postImageId?: string
  postImageUrl?:string
  profession:string
  userId: string
  userName: string
  userPhotoId: string
  __v: number
  _id: string
  }
  export type sendPostModel={
    post:string;
    userId:string;
    userName:string;
    userPhotoId:string;
    postImageId?:string;
    isActive:boolean;
    isAdmin:boolean;
    profession:string;

  }
@Injectable({
  providedIn: 'root'
})

export class PostsService {

  constructor(
    private http:HttpClient
  ) { }
  public fetchAllPost():Observable<postModel[]>{
    return this.http.get<postModel[]>(`${env.apiBaseUrl}posts/`)
  }
  public uploadPost(userpost:sendPostModel):Observable<{message:string}>{
    return this.http.post<{message:string}>(`${env.apiBaseUrl}posts/createpost`,userpost)
  }
  public fetchPostByPostId(postid:string):Observable<postModel[]>{
    return this.http.get<postModel[]>(`${env.apiBaseUrl}posts/${postid}`)

  }
  public fetchPostByUserId(userid:string):Observable<postModel[]>{
    return this.http.post<postModel[]>(`${env.apiBaseUrl}posts/findpostbyuserid`,{id:userid})

  }
  public deletePost(postId:string){
    return this.http.delete(`${env.apiBaseUrl}posts/${postId}`)
  }
  public updateBulkPosts(userId:string,photoId:string){
    return this.http.post(`${env.apiBaseUrl}posts/updatemanyposts`,{photoId,userId}).subscribe()
  }

}
