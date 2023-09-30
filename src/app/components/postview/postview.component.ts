import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { PostsService, postModel } from 'src/app/services/posts/posts.service';
import { DeletePost } from 'src/app/store/actions/post-actions.service';
import { usersPost, usersPosts } from 'src/app/store/state/custom-seletor.factory';
export type postViewCompModel={
  viewpost:boolean,
    currentactivepost:postModel
}
export type PostError={
  status:boolean,
  message?:string
}
@Component({
  selector: 'app-postview',
  templateUrl: './postview.component.html',
  styleUrls: ['./postview.component.css']
})
export class PostviewComponent implements OnInit{
  public id!:string
  public postdetails:postModel
  public error:PostError
  constructor(
    private postservice:PostsService,
    private router:Router,
    private route:ActivatedRoute,
    private store:Store
      ){
        this.postdetails={} as postModel
        this.error={
          status:false
        }
  }
  ngOnInit(): void {
    console.log(this.postdetails)
    this.route.params.subscribe({
      next:(res)=>{
        console.log(res)
        const selector=usersPost(res['id'],res['postid']);
        this.store.select(selector).subscribe({
          next:(res)=>{
            console.log(res)
            this.postdetails=res as postModel
          },
          error:(error)=> {
          console.log(error);
          this.error.status=true;
          this.error.message="post not found"
        }
       
      })
    }})
  }
  public deletePost(){
    this.postservice.deletePost(this.postdetails._id).subscribe({
      next:()=>{
        const target=sessionStorage.getItem('mypostsview')
        if(target)  this.router.navigate(['home','myposts'],{fragment:target})
        else this.router.navigate(['home','myposts'])
        this.store.dispatch(new DeletePost(this.postdetails))
      }
    })
  }
  public editPost(){
    console.log("editPost");
  }
} 
