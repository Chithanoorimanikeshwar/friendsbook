import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ForgotPassResponse } from 'src/app/models/usermodule';
import { env } from 'src/environment';
export type forgetForm={
  email:string;
  dob:string
};
export type UserValidation={
  isUserValid:boolean,
  message:string ;
}
@Injectable({
  providedIn: 'root'
})
export class ForgetpasswordService {
  public userValidation:UserValidation;
  public responseCompleted:boolean
  constructor(
    private http:HttpClient
  ) { 
    this.userValidation={} as UserValidation;
    this.responseCompleted=false;
  }

  public TestUserIdentity(form:forgetForm):Observable<UserValidation>{
    return this.http.post<ForgotPassResponse[]>(`${env.apiBaseUrl}users/finduserbyemail`,{email:form.email}).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error here, e.g., log it
        console.error('An error occurred:', error);

        // Return a boolean indicating that the response is not valid
        throw new Error();
      }),
      map((userInfo)=>{
        if(userInfo.length>0){
       
            const userData=userInfo[0] as ForgotPassResponse;
            const OrginalDate=new Date(userData.dob);
            const ProvidedDate=new Date(form.dob);
    
          if (
            OrginalDate.getFullYear() ===ProvidedDate.getFullYear() &&
            OrginalDate.getMonth() ===ProvidedDate.getMonth() &&
            OrginalDate.getDate() ===ProvidedDate.getDate()
          ) {
            console.log('Dates are on the same day.');
            return {
              isUserValid:true,
              message:userData._id 
            }
          }else{
          console.log('Dates are not on the same day.');
          return {
            isUserValid:false,
            message:'provided date of birth is invalid'
          }}
        }
        return {
          isUserValid:false,
          message:'provided details are invalid'
        }
      }),
     
    )
  }
  public ResetPassword(userId:string,newPassword:string):Observable<any>{
    return this.http.put(`${env.apiBaseUrl}users/${userId}`,{password:newPassword})
  }
}
