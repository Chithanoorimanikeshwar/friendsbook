import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { userResponseModel } from 'src/app/models/usermodule';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { postModel } from 'src/app/services/posts/posts.service';
import { usersPosts } from 'src/app/store/state/custom-seletor.factory';
import { UserDetails } from 'src/app/store/state/user-details.service';

@Component({
  selector: 'app-friendspace',
  templateUrl: './friendspace.component.html',
  styleUrls: ['./friendspace.component.css'],
  animations:[fadeInOut]
})
export class FriendspaceComponent implements OnInit{
  public isrouterOutletActive=false
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY;
    const totalPageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const remainingHeight = totalPageHeight - (scrollPosition + viewportHeight);
    const threshold = 1;
    if (remainingHeight <= threshold) {
      console.log('User has reached the end of the page.');
      this.FetchMorePosts=true;
    }
  }
  public FetchMorePosts=false;
public userdetails$!:Observable<any>
public userId:string
  public posts!:postModel[]
  public userdetails!:userResponseModel
constructor(
  private route:ActivatedRoute,
  private store:Store,
  private userService:HttpclientService
){
  this.userId=""
}
  ngOnInit(): void {
    this.route.params.subscribe({
      next:(res)=>{
        this.userId=res['id'];
        const selector=usersPosts(res['id']);
        this.store.select(selector).subscribe({
          next:(res)=>{
            if(res){
              this.posts=res
              
            }
          }
        })
      }
    })

    this.userdetails$=this.userService.getUser(this.userId)
    this.userdetails$.subscribe({
      next:(res)=>this.userdetails=res
    })
  }
  public postClicked(userid:string,postId:string){

  }
}
