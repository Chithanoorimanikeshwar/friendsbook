import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, concatMap, from, skip, take, toArray } from 'rxjs';
import { userResponseModel } from 'src/app/models/usermodule';
import { PostsService, postModel } from 'src/app/services/posts/posts.service';
import { FetchPosts } from 'src/app/store/actions/post-actions.service';
import { usersPosts } from 'src/app/store/state/custom-seletor.factory';
import { PostServices } from 'src/app/store/state/posts.service';
import { postViewCompModel } from '../../postview/postview.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.css']
})
export class MypostsComponent implements OnInit {
@Select(PostServices.getStateStatus) postsStateStatus$!:Observable<boolean>
  public userDetails!:userResponseModel
  public length:number

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
  public posts$!:Observable<postModel[]>
  public posts:postModel[]
  public FetchMorePosts:boolean
  public fetchMorePostsLoader:boolean;
  public fetchMorPosts=(()=>{
    let count=10;
    const self=this;
    return function(event:any){
      let element =event.target as HTMLButtonElement
      if(self.length>count){
      self.renderPost(count+=10);
      self.fetchMorePostsLoader=true;
      }else{
        element.innerHTML="No Mor Post to Fetch"
        element.disabled=true
      }
    }
  })()
constructor(
  // private postService:PostsService,
  private store:Store,
  private postService:PostServices,
  private router:Router
){
  this.posts=[];
  this.FetchMorePosts=false;
  this.fetchMorePostsLoader=false
  this.length=0
  
}
  
  ngOnInit(): void {
    
    this.userDetails=this.store.selectSnapshot((state)=>state.UserDetails.userDetails);
    // this.store.dispatch(new FetchPosts(this.userDetails._id)).subscribe({
    //   error:(err)=>console.log(err),
    //   complete:()=>{
    //     this.renderPost(10)
    //   }
    // });
    if(this.userDetails) {
      this.store.dispatch(new FetchPosts(this.userDetails._id)).subscribe({
        complete:()=>this.renderPost(10)
      })
      
    }
    }
    public renderPost(noOfTakes:number){
      const selector=usersPosts(this.userDetails._id)
      this.store.select(selector).subscribe({
        next:(res)=>{
          if(res){
            this.posts=res
          }
          else{
            console.log("fetching Posts.........")
          }
        }
      })
    }
    public postClicked(userDetails:postModel){
      // const prevSibling=usercontainer.previousSibling as HTMLElement
      // console.log(usercontainer)
      // console.log(prevSibling)
      // if(prevSibling) sessionStorage.setItem('mypostsview',prevSibling.id)
      // else{
      //   const nextSibling=usercontainer.nextSibling as HTMLElement
      //   sessionStorage.setItem('mypostsview',nextSibling.id);
      // }
      this.router.navigate(['home','myposts',userDetails.userId,userDetails._id]);
    }
    // public fetchMorPosts(){
    //   this.renderPost(20);
    // }
    public scrollTop(){
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  
}
