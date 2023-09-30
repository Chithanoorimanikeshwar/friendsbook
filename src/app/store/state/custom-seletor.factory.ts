import { Selector, createSelector } from "@ngxs/store";
import { FileServices, fileServieStateModel } from "./files-state.services";
import { PostServices, postServiceModel } from "./posts.service";
import {  throwError } from "rxjs";

export function userProfile(userId:string){
    return createSelector([FileServices],(state:fileServieStateModel):string|false=>{
        const imgUrl=state.usersProfiles.get(userId)
        if(imgUrl) return imgUrl
        return false
    })
}

export function usersPosts(userId:string){
    return createSelector([PostServices],(state:postServiceModel)=>{
        const posts=state.userposts;
        if(posts.has(userId)) {
            console.log( posts.get(userId))
            return posts.get(userId);
        }
        return false
    })
}
export function usersPost(userId:string,postId:string){
    return createSelector([PostServices],(state:postServiceModel)=>{
        const posts=state.userposts;
        const userposts= posts.get(userId)
        if(userposts){
            for(let userpost of userposts){
                if(userpost._id===postId) return userpost
            }
        }
           return throwError(()=>{
            new Error(`post with postId:${postId} in userId:${userId} were not found`)
           })
    })
   
}



