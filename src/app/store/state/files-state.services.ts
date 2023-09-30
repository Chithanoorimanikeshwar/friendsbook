import { Action, Selector, State, StateContext } from "@ngxs/store";
import { UserProfilePic } from "../actions/files-action.service";
import { FileuploadService } from "src/app/services/fileupload/fileupload.service";
import { Injectable } from "@angular/core";
import { tap } from "rxjs";
export type fileServieStateModel={
    usersProfiles:Map<string,string>
}
@Injectable()
@State<fileServieStateModel>({
    name:'filesServices',
    defaults:{
        usersProfiles:new Map<string,string>
    }
})
export class FileServices {
    constructor(
        private fileService:FileuploadService
    ){}
       
    @Action(UserProfilePic)
    userProfilePic(ctx:StateContext<fileServieStateModel>,payload:UserProfilePic){
        return this.fileService.profilePicService(payload.photoId).pipe(
            tap((blob: Blob) => {
                // Convert the blob to a URL
                console.log(blob);
                const imageUrl = URL.createObjectURL(blob);
                console.log(imageUrl);
                const prevstate=ctx.getState().usersProfiles
                prevstate.set(payload.userId,imageUrl)
                const prevState=ctx.getState()
                ctx.patchState({
                    usersProfiles:prevstate
                })
            })
        )
    }



    // -------------------------------------Selectors---------------------------------------
    @Selector()
    static getUserProfilePic(userId:string,state:fileServieStateModel){
        console.log((state.usersProfiles as any)[userId])
    }
}