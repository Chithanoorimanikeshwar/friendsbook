import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NetworkComponent } from './components/network/network.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordComponent } from './components/password/password.component';
import { RegistertionComponent } from './components/registertion/registertion.component';
import { FriendsComponent } from './components/friends/friends.component';
import { PicsAndpostsComponent } from './components/home/pics-andposts/pics-andposts.component';
import { MypostsComponent } from './components/home/myposts/myposts.component';
import { PostviewComponent } from './components/postview/postview.component';
import { FriendspaceComponent } from './components/friendspace/friendspace.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.service';


const routes: Routes = [
  {path:"" ,redirectTo:"login",pathMatch:"full"},
  {path:"home",
  component:HomeComponent,
  children:[
    {path:"",redirectTo:"subhome",pathMatch:"full"},
    {path:"subhome",component:PicsAndpostsComponent},
    {path:"myposts",component:MypostsComponent},
    {path:"myposts/:id/:postid",component:PostviewComponent}
    // {path:"photos",component:}
  ],
  canActivate:[AuthGuard]},
 
  {path:"network",component:NetworkComponent,canActivate:[AuthGuard]},
  {path:"friends",component:FriendsComponent,canActivate:[AuthGuard]},
  {path:'settings',component:SettingsComponent,canActivate:[AuthGuard]},
  {path:'resetpass/:id',component:ResetPasswordComponent,canActivate:[AuthGuard]},
  {path:"login",component:LoginComponent
  },
  {path:"forgetpassword",component:PasswordComponent},
  {path:"resetpassword",component:PasswordComponent,canActivate:[AuthGuard]},
  {path:"register",component:RegistertionComponent},
  {path:"friendspace/:id",component:FriendspaceComponent,canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
