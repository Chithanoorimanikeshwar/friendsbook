import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { updatedUserProfile } from 'src/app/components/settings/settings.component';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserProfileServiceService {

  constructor(
    private http:HttpClient
  ) { }
  public updateUserInfo(userId:string,data:updatedUserProfile):Observable<{}>{
    return this.http.put(`${env.apiBaseUrl}users/${userId}`,data)
  }
}
