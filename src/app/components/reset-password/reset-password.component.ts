import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  animations:[fadeInOut]
})
export class ResetPasswordComponent  implements OnInit{
  public isPasswordResetted=false
  public isloading=true
  private userId:string=""
  constructor(
    private route:ActivatedRoute,
    private userSevice:HttpclientService,
    private router:Router
  ){}
  public ResetFormSubmitted(form:any){
      this.userSevice.updateUserInfo(this.userId,form.password);
      this.isPasswordResetted=true;
      setTimeout(()=>{
        this.router.navigate(['settings'])
      },3000)
  }

  ngOnInit(): void {
      this.route.params.subscribe({
        next:(res)=>{
          this.isloading=false;
          this.userId=res['id']}
      })
  }
}
