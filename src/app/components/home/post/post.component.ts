import { Component, ElementRef, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { userResponseModel } from 'src/app/models/usermodule';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { PostsService, sendPostModel } from 'src/app/services/posts/posts.service';
import { UploadPost } from 'src/app/store/actions/post-actions.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  public createpost:boolean
  public userDetails:userResponseModel
  private files!:FileList
  constructor(
    private fileService:FileuploadService,
    private postService:PostsService,
    private store:Store
  ){
    this.createpost=false
    this.userDetails={} as userResponseModel
  }
  ngOnInit(): void {
    this.userDetails=this.store.selectSnapshot((state)=>state.UserDetails.userDetails)
  }

  public createPost(){
    this.createpost=true
  }
  public closePostWindow(){
    this.createpost=false
  }
  public formSubmited(formData:any){
    console.log(formData);
    const createPost={
      post:formData.post as string,
      userId:this.userDetails._id,
      userName:this.userDetails.firstName+this.userDetails.lastName,
      isActive:this.userDetails.isActive,
      isAdmin:this.userDetails.isAdmin,
      userPhotoId:this.userDetails.photoId,
      profession:"user"
    }
    this.postService.uploadPost(createPost).subscribe({
      next:(res)=>{
        this.store.dispatch(new UploadPost(createPost.userId))
      }
    })
  }
  public postFormSubmited(form:any){
    console.log(form);
    if(this.files){
      const file=this.files.item(0) as File
      this.fileService.uploadFile(file).subscribe({
        next:(res)=>{
          console.log(res)
          const createpost={
            post:form.post,
            userId:this.userDetails._id,
            userName:this.userDetails.firstName+this.userDetails.lastName,
            userPhotoId:this.userDetails.photoId,
            postImageId:res.uploadId,
            isActive:this.userDetails.isActive,
            isAdmin:this.userDetails.isAdmin,
            profession:"user"
          } as sendPostModel
          this.postService.uploadPost(createpost).subscribe({
            next:(response)=>{
              console.log(response)
              this.store.dispatch(new UploadPost(createpost.userId))
            }
          })
          // this.postService.uploadPost()
        }
      })
    }
  }
  public onFileSelected(element:HTMLInputElement){
    const file=element.files
    console.log(file?.item(0));
    if(file) this.files=file
  }
}
