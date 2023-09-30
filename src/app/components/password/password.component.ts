import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, Subscription, catchError, map, mergeAll, of, tap } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { ForgetpasswordService, UserValidation } from 'src/app/services/forgotPass/fotgetpassword.service';
import { SetNavbar } from 'src/app/store/actions/navbar-action.service';
@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  animations:[fadeInOut]
})
export class PasswordComponent implements OnInit,OnDestroy {
  public alertBoxMessage:string;
  public alertBoxOn:boolean;
  public alertBoxClass:boolean;
  public currentComponent:string;
  public componentHeading:string
  public label1="";
  public label2="";
  public isForgetComponentActive:boolean;
  public isSetPasswordComponentActive:boolean;
  private userValidation:UserValidation;
  private subscribition1:Subscription;
  private subscribition2:Subscription;

  // public isResetComponentActive:boolean;

  public isloading:boolean;
  constructor(
    private activatedRoute:ActivatedRoute,
    private forgetPasswordService:ForgetpasswordService,
    private route:Router,
    private store:Store
  ){
    this.alertBoxClass=false;
    this.alertBoxMessage="";
    this.alertBoxOn=false;
    this.currentComponent="";
    this.componentHeading="";
    this.isForgetComponentActive=false;
    this.isSetPasswordComponentActive=false;
    this.userValidation={} as UserValidation;
    this.subscribition1={} as Subscription;
    this.subscribition2={} as Subscription;

    // this.isResetComponentActive=false;
    
    
    this.isloading=true;
  }
  ngOnInit(): void {
    this.activatedRoute.url.subscribe({next:(url)=>this.currentComponent=url[0].path})
    this.store.dispatch(new SetNavbar(['Login','Register']));

    
    if(this.currentComponent === 'forgetpassword'){
      this.isloading=false
      this.isForgetComponentActive=true;
      this.label1="Email";
      this.label2="date of birth";
      this.componentHeading="Forget Password"
  
 
    }
    else if(this.currentComponent === 'resetpassword'){
      this.isloading=false
      this.label1="Old Password";
      this.label2="New Password";
      this.componentHeading="Reset Password"
    }
  }
  public FormSubmitted(f:any){
    this.isloading=true;
    if(this.isForgetComponentActive){
      console.log(f)
    this.subscribition1=this.forgetPasswordService.TestUserIdentity(f).subscribe({
        next:((res)=>{
          this.isloading=false
          console.log(res);
          if(res.isUserValid) {
            this.userValidation=res;
            this.isSetPasswordComponentActive=true;
            this.isForgetComponentActive=false;
            this.componentHeading="Create New Password"
            this.alertBoxOn=false;
          }
          else {
            this.userValidation=res;
            this.alertBoxOn=true;
            this.alertBoxClass=false;
            this.alertBoxMessage=res.message;
    
          }
        }),
        error:()=>{
          this.isloading=false
          this.alertBoxOn=true;
            this.alertBoxClass=false;
            this.alertBoxMessage="please check internet connection";
        }})
       
  
   }
    else{
    }
  }

  public setPasswordFormSubmitted(f:any){
    this.isloading=true;
    if(this.userValidation.isUserValid){
      console.log(f)
     this.subscribition2=this.forgetPasswordService.ResetPassword(this.userValidation.message,f.newPassword).subscribe({
        next:()=>{
          this.isloading=false
          this.alertBoxOn=true;
          this.alertBoxClass=false;
          this.alertBoxMessage='password successfully reseted';
          this.isloading=true;
          setTimeout(()=>{
            this.isloading=false;
            this.route.navigate(['/login'],{queryParams:{message:'Password reset succesfully'}})
          },1000)
        },
        error:()=>{
          this.isloading=false;
          this.alertBoxOn=true;
          this.alertBoxClass=false;
          this.alertBoxMessage="please check internet connection";
        },
      })
    }
    else{
      this.alertBoxOn=true;
      this.alertBoxClass=false;
      this.alertBoxMessage='user is invalid';
    }
   
  }
  public ngOnDestroy(): void {
    this.alertBoxOn=false;
    this.subscribition1.unsubscribe;
    this.subscribition2.unsubscribe;
    this.isloading=false;
  }
}
