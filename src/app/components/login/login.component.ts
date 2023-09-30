import { style, transition, trigger ,animate, state} from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, of } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { NavbarService } from 'src/app/services/navbarS/navbar.service';
import { SetNavbar } from 'src/app/store/actions/navbar-action.service';
import { login } from 'src/app/store/actions/user-action.service';
import { UserDetails } from 'src/app/store/state/user-details.service';
type loginModel={
  email:string,
  password:string
}
type userLogin={
  userlogged:false,
  error:""
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInOut]
})
export class LoginComponent implements OnInit,OnDestroy,AfterViewInit{
  fadeState = 'in'; 
  public isUserLoggedIn=false;
  public alertBoxMessage:string;
  public alertBoxOn:boolean;
  public alertBoxClass:boolean;
  public subscription:Subscription;
  public isloading:boolean;
  @Select(UserDetails.userLoaded) userLoaded$!:Observable<any>;
  @Select(UserDetails.getBasicUserInfo) userData$!:Observable<any>;
  constructor(
    private navService:NavbarService,
    private activatedRoute:ActivatedRoute,
    private store:Store,
    private router:Router
  ){
    console.log('constructor');
    this.alertBoxClass=false;
    this.alertBoxMessage="";
    this.alertBoxOn=false;
    this.subscription={} as Subscription
    this.isloading=true;

  }
  toggleAnimation() {
    this.fadeState = this.fadeState === 'in' ? 'out' : 'in';
  }
  ngAfterViewInit(): void {
   console.log('iam called')
   this.isloading=false;
  }
  ngOnDestroy(): void {
    this.toggleAnimation() 
    console.log('ngondestroy');

    this.subscription.unsubscribe();
    this.isloading=false;
  }
  ngOnInit(): void {
    
    console.log('ngoninit');

    
      this.activatedRoute.queryParams.subscribe({
        next:(data)=>{
          if(data['message']){
              this.alertBoxOn=true;
              this.alertBoxMessage=data['message'];
              this.alertBoxClass=true;
          }
        }
      })
      this.subscription=this.userLoaded$.subscribe({
        next:(userloaded)=>{
          this.isloading=false
          
          if(userloaded){
            this.isUserLoggedIn=true;
            setTimeout(()=>{
              console.log('hello')
              this.router.navigateByUrl('/home');
              this.isUserLoggedIn=false
            },3000)
            
            
          }
        }
      })

    this.store.dispatch(new SetNavbar(['Register']));
  }
  public loginFormSubmitted(formData:loginModel){
    console.log('loginformsubmitted');
    this.isloading=true;
      this.store.dispatch(new login(formData,this.handleLoginError.bind(this))).subscribe({
        error:(error)=>{
          this.isloading=false;
          console.log(error);
        }
      })
    
  }
  public handleLoginError(error:any){
    this.isloading=false
    console.log(error);
    console.log(this)
    this.alertBoxOn=true;
    this.alertBoxMessage=error.error.message;
    this.alertBoxClass=false;
  }
}
