import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, concatMap, from, map, skip, take, toArray } from 'rxjs';
import { PostsService, postModel } from 'src/app/services/posts/posts.service';
import { FetchAllPosts, FetchFirst } from 'src/app/store/actions/post-actions.service';
import { PostServices } from 'src/app/store/state/posts.service';

@Component({
  selector: 'app-pics-andposts',
  templateUrl: './pics-andposts.component.html',
  styleUrls: ['./pics-andposts.component.css']
})
export class PicsAndpostsComponent implements OnInit,AfterViewInit {
@Select(PostServices.getRawPosts) posts$!:Observable<postModel[]>
@Select(PostServices.getStateStatus) postsStateStatus$!:Observable<boolean>
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    // Calculate the current scroll position
    const scrollPosition = window.scrollY;

    // Get the total height of the page
    const totalPageHeight = document.documentElement.scrollHeight;

    // Get the height of the viewport
    const viewportHeight = window.innerHeight;

    // Calculate the remaining scrollable height
    const remainingHeight = totalPageHeight - (scrollPosition + viewportHeight);

    // Define a threshold (e.g., 100 pixels from the bottom)
    const threshold = 1;

    // Check if the user has reached the end of the page
    if (remainingHeight <= threshold) {
      // The user has reached the end of the page
      console.log('User has reached the end of the page.');
      this.FetchMorePosts=true;
      // You can trigger any action or load more content here.
    }
  }
  // public posts$!:Observable<postModel[]>
  public posts:postModel[]
  public FetchMorePosts:boolean
  public fetchMorePostsLoader:boolean;
  public fetchMorPosts=(()=>{
    let count=10;
    const self=this;
    return function(){
      self.fetchMorePostsLoader=true;
      self.renderPost(count+=10);
     
    }
  })()
constructor(
  private postService:PostsService,
  private store:Store,
  private router:Router
){
  this.posts=[];
  this.FetchMorePosts=false;
  this.fetchMorePostsLoader=false
}
  ngAfterViewInit(): void {
    // this.postsStateStatus$.subscribe({
    //   next:(res)=>{
    //     if(res){
    //       this.renderPost(10)
    //     }
    //   }
    // })
  }
  ngOnInit(): void {
    // this.posts$=this.postService.fetchAllPost();
    this.postsStateStatus$.subscribe({
      next:(res)=>{
        if(!res){
          this.store.dispatch(new FetchAllPosts);
        }
      }
    })
    this.postsStateStatus$.subscribe({
      next:(res)=>{
        if(res){
          this.renderPost(10)
        }
      }
    })
   

    }
    public renderPost(noOfTakes:number){
      this.store.dispatch(new FetchFirst(noOfTakes))
      // let noOfTakes:number=10;
      let noOfSkips:number=0;
      let postlenght:number=0;
      this.posts$.pipe(
        concatMap((res=>{
          postlenght=res.length;
          return from(res)
        })),
        skip(noOfSkips),
        take(noOfTakes),
        toArray()
      ).subscribe({
        next:(res)=>{
          this.posts=res
          if(this.fetchMorePostsLoader){
            this.fetchMorePostsLoader=false;
          }
         
        }
      })
    }
    public userPosition(event:any){
      const element=event.target as HTMLElement;
      const scrollPosition = element.scrollTop;
      console.log('Element scroll position:', scrollPosition);
    }
    // public fetchMorPosts(){
    //   this.renderPost(20);
    // }
    public scrollTop(){
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
      public postClicked(userId:string){
        if(userId) this.router.navigate(['friendspace',userId]);
      }
}
