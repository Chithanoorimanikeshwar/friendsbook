import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistertionComponent } from './components/registertion/registertion.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { PostComponent } from './components/home/post/post.component';
import { PicsAndpostsComponent } from './components/home/pics-andposts/pics-andposts.component';
import { NetworkComponent } from './components/network/network.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PasswordComponent } from './components/password/password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MustmatchDirective } from './directives/mustmatch/mustmatch.directive';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgxsModule } from '@ngxs/store';
import { UserDetails } from './store/state/user-details.service';
import { NavList } from './store/state/navbar-state.service';
import { LOCAL_STORAGE_ENGINE, NgxsStoragePluginModule, SESSION_STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorInterceptor } from './interceptor/http-interceptor.interceptor';
import { FileServices } from './store/state/files-state.services';
import { FriendsComponent } from './components/friends/friends.component';
import { DynamiclistDirective } from './directives/dynamiclist/dynamiclist.directive';
import { DateObjectPipe } from './pipes/date-object.pipe';
import { MypostsComponent } from './components/home/myposts/myposts.component';
import { PostServices } from './store/state/posts.service';
import { PictureDirective } from './directives/picture/picture.directive';
import { PostviewComponent } from './components/postview/postview.component';
import { FriendspaceComponent } from './components/friendspace/friendspace.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistertionComponent,
    HeaderComponent,
    FooterComponent,
    LoadingOverlayComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    PostComponent,
    PicsAndpostsComponent,
    NetworkComponent,
    SettingsComponent,
    PasswordComponent,
    MustmatchDirective,
    CapitalizePipe,
    FriendsComponent,
    DynamiclistDirective,
    DateObjectPipe,
    MypostsComponent,
    PictureDirective,
    PostviewComponent,
    FriendspaceComponent,
    ResetPasswordComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([UserDetails,NavList,FileServices,PostServices]),
    NgxsStoragePluginModule.forRoot({
      key:[{
        key:'UserDetails',
        engine: LOCAL_STORAGE_ENGINE
      },{
        key:'FileServices',
        engine: SESSION_STORAGE_ENGINE
      }]
    }),
    NgxsLoggerPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    {  
      provide: HTTP_INTERCEPTORS,  
      useClass: HttpInterceptorInterceptor,  
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
