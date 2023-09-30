import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PostsService, postModel } from "src/app/services/posts/posts.service";
import { DeletePost, FetchAllPosts, FetchFirst, FetchPosts, UploadPost } from "../actions/post-actions.service";
import { Observable,  concatMap, filter, from, map, take, tap, toArray } from "rxjs";
import { FileuploadService } from "src/app/services/fileupload/fileupload.service";


export interface postServiceModel{
    userposts:Map<string,postModel[]>
    rawuserposts:postModel[]
    currentFetchedPosts:postModel[]
    userPostsUpdated:boolean
}

class UpdateStateObj {
    static readonly type='[postState] update';
    constructor(public data:postModel[]){}
}
class UpdateRawPost{
    static readonly type='[postrawstate] update';
    constructor(public data:postModel[]){}
}
@Injectable()
@State<postServiceModel>({
    name:"postServices",
    defaults:{
        userposts:new Map(),
        userPostsUpdated:false,
        rawuserposts: [],
        currentFetchedPosts:[]
    }
})
export class PostServices{
    constructor(
        private httppostservice:PostsService,
        private fetchPhotoservice:FileuploadService
    ){

    }
    @Action(FetchPosts)
    fetchPosts(ctx:StateContext<postServiceModel>,payload:FetchPosts){
        
            const posts=ctx.getState().userposts.get(payload.id)
            if(posts){
                from(posts).pipe(
                    map((res)=>{
                        if(res.postImageId){
                            if(!res.postImageUrl){
                                this.fetchPostImages(res.postImageId).subscribe({
                                    next:(imageUrl)=>{
                                        res.postImageUrl=imageUrl
                                    }
                                })
                            }
                        }
                        return res
                    }),
                    toArray()
                ).subscribe({
                    next:(res)=>{
                        const prevState=ctx.getState().userposts
                        prevState.set(res[0].userId,res)
                        ctx.patchState({
                            userposts:prevState
                        })
                    }
                })
            }
        }
    @Action(UpdateStateObj)
    updateStateObj(ctx:StateContext<postServiceModel>,payload:UpdateStateObj){
        const prevstate=ctx.getState().userposts;
        const userid=payload.data[0].userId
        from(payload.data).pipe(
            map((res)=>{
                const updatedfiled=res
                if(res.postImageId){
    
                    this.fetchPostImages(res.postImageId).subscribe({
                        next:(res)=>{
                            console.log(res);
                            updatedfiled.postImageUrl=res
                        }
                    })
                }
                return updatedfiled
            }),
            toArray()
        ).subscribe({
            next:(res)=>{
                const prevstateuserdata=prevstate.get(userid);
                let updatedState:Map<string,postModel[]>;
                if(prevstateuserdata){
                    let updated=new Map<string,postModel[]>()
                    updated.set(userid,[...res,...prevstateuserdata])
                    updatedState=new Map([...prevstate,...updated])
                }
                else{
                    updatedState=new Map([...prevstate]).set(userid,res)
                }
        
                ctx.patchState({
                    userposts:updatedState
                }
                )
            }
        })
       
        
       
    }
    @Action(FetchAllPosts)
        fetchAllPosts(ctx:StateContext<postServiceModel>){
            let duplicateState=ctx.getState()
            this.httppostservice.fetchAllPost().pipe(
                tap((res)=>{
                   ctx.dispatch(new UpdateRawPost(res))
                }),
                concatMap((res)=>{
                    return from(res)
                }),
                map((res)=>{
                    const id=res.userId;
                    let userposts=duplicateState.userposts.get(id)
                        if(userposts){
                            if(res){
                                
                                userposts.push(res)
                                duplicateState.userposts.set(id,userposts)
                            }
                            
                        }
                        else{
                            const data:postModel[]=[];
                            data.push(res)
                            duplicateState.userposts.set(id,data)
                        }
                    
                    
                    
                    return 1
                })
            ).subscribe({
                next:()=>{
                    ctx.patchState({
                        userposts:duplicateState.userposts
                    })
                }
            })
        }

    @Action(UpdateRawPost)
    updateRawPost(ctx:StateContext<postServiceModel>,payload:UpdateRawPost){
        
        ctx.patchState({
            rawuserposts:payload.data,
            userPostsUpdated:true
        })
    }
    @Action(FetchFirst)
    fetchFirst(ctx:StateContext<postServiceModel>,payload:FetchFirst){
        let duplicateState=ctx.getState().rawuserposts
        // console.log(duplicateState)
        let duplicateOrderState=ctx.getState().userposts
        from(duplicateState).pipe(
            take(payload.posts),
            map((res)=>{
                if(res.postImageId){
                    if(!res.postImageUrl){
                        this.fetchPostImages(res.postImageId).subscribe({
                            next:(imageUrl)=>{
                                res.postImageUrl=imageUrl
                                const userPosts=duplicateOrderState.get(res.userId)
                                if(userPosts){
                                    for(let post of userPosts){
                                        if(post._id===res._id){
                                            post.postImageUrl=imageUrl;
                                        }
                                    }
                                duplicateOrderState.set(userPosts[0].userId,userPosts)
                                }
                            }
                        })
                    }
                }
                return res
            }),
            toArray()
        ).subscribe({
            next:(res)=>{
                console.log(res);
                ctx.patchState({
                    currentFetchedPosts:res
                })
            }
        })
    }
    @Action(UploadPost)
    uploadPost(ctx:StateContext<postServiceModel>,payload:UploadPost){
        const userposts=ctx.getState().userposts.get(payload.userId) || []
        const posts=new Map<string,postModel>()
        if(userposts){
            for(let userpost of userposts){
                posts.set(userpost._id,userpost)
            }
        }
            this.httppostservice.fetchPostByUserId(payload.userId).pipe(
                concatMap((res)=>{
                    return from(res)
                }),
               filter((res)=>{
                return !posts.has(res._id)
               }),
               map((res)=>{
                if(res.postImageId){
                    if(!res.postImageUrl){
                        this.fetchPostImages(res.postImageId).subscribe({
                            next:(imageUrl)=>{
                                res.postImageUrl=imageUrl
                            }
                        })
                    }
                }
                return res
               }),
               tap((res)=>userposts.push(res))
               ).subscribe({
                next:()=>{
                    const prevState=ctx.getState().userposts.set(userposts[0]._id,userposts)
                    ctx.patchState({
                        userposts:prevState
                    })
                }
               })
    
         
       
        
    }
    @Action(DeletePost)
    DeletePost(ctx:StateContext<postServiceModel>,payload:DeletePost){
        const usersPost=ctx.getState().userposts.get(payload.PostDetails.userId);
        if(usersPost){
            from(usersPost).pipe(
                filter((res)=> !(res._id===payload.PostDetails._id)),
                toArray()
            ).subscribe({
                next:(usersPostUpdated)=>{
                    const prevState=ctx.getState().userposts
                    prevState.set(usersPostUpdated[0].userId,usersPostUpdated)
                    ctx.patchState({
                        userposts:prevState
                    })
                }
            })
            
        }
    }
    // ----------------------------utility Functions----------------------------------------
    public fetchPostImages(imageid:string):Observable<string>{
        return this.fetchPhotoservice.profilePicService(imageid).pipe(
            map((blob: Blob) => {
                console.log(blob);
                return URL.createObjectURL(blob);})
        )
    }




// -----------------------------------SELECTORS-------------------------------------------------


@Selector()
static getRawPosts(state:postServiceModel){
        return state.currentFetchedPosts
}
@Selector()
static getStateStatus(state:postServiceModel):boolean{
    if(state.userPostsUpdated){
        return true
    }
    return false
}


        
      
  
}




