import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { SetNavbar } from 'src/app/store/actions/navbar-action.service';

@Component({
  selector: 'app-registertion',
  templateUrl: './registertion.component.html',
  styleUrls: ['./registertion.component.css'],
  animations:[fadeInOut]
})
export class RegistertionComponent implements OnInit {
  
  constructor(
   private http:HttpclientService,
   private router:Router,
   private store:Store
  ){
  
  }
  ngOnInit(): void {
    this.store.dispatch(new SetNavbar(['Login']));
    
  }
  // toggleAnimation() {
  //   this.fadeState = this.fadeState === 'in' ? 'out' : 'in';
  // }
  formSubmitted(formData:any){
  delete formData.cpassword
  console.log('registrationform',formData)
  this.http.registrationFormPost(formData).subscribe({
    next:(data)=>{
      console.log(data);
      this.router.navigate(['/login'],{queryParams:{message:'success'}})
    },
    error:(err)=>{
      console.log(err);
      this.router.navigate(['/login'],{queryParams:{message:'fail'}})
    }
  })
  }
}
