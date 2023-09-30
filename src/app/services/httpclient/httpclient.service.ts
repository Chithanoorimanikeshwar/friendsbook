import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loginModel, userModel, userResponseModel } from 'src/app/models/usermodule';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  constructor(
    private http:HttpClient
  ) { }
  public registrationFormPost(userdata:userModel):Observable<any>{
    return this.http.post<userModel>(`${env.apiBaseUrl}users/register`,userdata)
  }
  public loginFormPost(userdata:loginModel):Observable<any>{
    console.log(userdata.email);
    console.log(userdata.password)
    return this.http.post<loginModel>(`${env.apiBaseUrl}users/authenticate`,{email:userdata.email,password:userdata.password})
  }
  public getAllUsers():Observable<userResponseModel[]>{
    return this.http.get<userResponseModel[]>(`${env.apiBaseUrl}users/`)
  }
  public getUser(userId:string):Observable<userResponseModel>{
    return this.http.get<userResponseModel>(`${env.apiBaseUrl}users/${userId}`)
  }
  public updateUserPhotoId(id:string,photoId:string){
     this.http.post(`${env.apiBaseUrl}users/updateuserphotoId`,{id,photoId}).subscribe({
      next:(res)=>console.log(res)
     })
  }
  public updateUserInfo(userId:string,data:any):Observable<{}>{
    return this.http.put(`${env.apiBaseUrl}users/${userId}`,data)
  }
}
