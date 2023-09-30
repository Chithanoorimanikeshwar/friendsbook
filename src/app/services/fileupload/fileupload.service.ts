import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  constructor(
    private http:HttpClient
  ) { }
  public profilePicService(photoId:string,):Observable<any>{
    return this.http.get(`${env.apiBaseUrl}files/${photoId}`,{responseType:'blob'})
  }
  public uploadFile(picture:File):Observable<any>{
    console.log(picture);
    const formData=new FormData()
    formData.append('picture',picture,picture.name)
    console.log(formData);
    return this.http.post<any>(`${env.apiBaseUrl}files/uploadfile`,formData)
    
  }
}
