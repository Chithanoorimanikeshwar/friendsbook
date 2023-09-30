import { Injectable } from "@angular/core"
import { Action, Selector, State, StateContext} from "@ngxs/store"
import { HttpclientService } from "src/app/services/httpclient/httpclient.service"
import { Logout, SetData, UpdateMyState, login, loginFailure, loginSuccess } from "../actions/user-action.service"
import { catchError, of, switchMap, tap } from "rxjs"

export type userDetailsModel={
    userDetails:Object,
    userLoaded:boolean,
    token:string


}
@Injectable()
@State<userDetailsModel>({
    name:'UserDetails',
    defaults:{
        userDetails:{},
        userLoaded:false,
        token:''
       
    }
})
export class UserDetails {
    constructor(
        private httpClient:HttpclientService
    ){}


@Action(login)
login(ctx:StateContext<userDetailsModel>,logincredentials:login){

   return this.httpClient.loginFormPost(logincredentials.logincredentials).pipe(
        tap((res)=>console.log(res)),
        switchMap((res)=>{
            if(res.message==='You account has been blocked.'){
                logincredentials.errorCallback({error:res});
                return of(null)
            }
            ctx.dispatch(new loginSuccess(res))
            return of(res)
        }),


        catchError((error)=>{
            console.log(error)
            logincredentials.errorCallback(error);
            return of(null);
        }),
      
    )
}
@Action(loginSuccess)
loginSuccess(ctx:StateContext<userDetailsModel>,{payload}:loginSuccess){
    const state=ctx.getState();
    ctx.setState({
        ...state,
        userDetails:payload,
        userLoaded:true,
        token:payload.token
    })
}
@Action(loginFailure)
loginFailure(ctx:StateContext<userDetailsModel>,{payload}:loginSuccess){
    const state=ctx.getState();
    ctx.setState({
        ...state,
        userDetails:"",
        userLoaded:false,
    })
    
}
@Action(SetData)
setData(ctx: StateContext<any>, { payload }: SetData) {
    console.log(payload)
  ctx.patchState({
    userDetails:payload.userDetails,
    userLoaded:payload.userLoaded,
    
  });
}
@Action(UpdateMyState)
updateState(ctx:StateContext<any>, payload :UpdateMyState){
    ctx.patchState({
        UserDetails:payload.updatedUserData
    })
}
@Action(Logout)
logout(ctx:StateContext<any>){
    const prev=ctx.getState();
    ctx.setState(
        {
            ...prev,
            userDetails:{},
            userLoaded:false,
            token:''
        }

    )
}
// -----------------------------------------selectors----------------------------------------------------------


@Selector()
static getBasicUserInfo(state:userDetailsModel){
    return state.userDetails
}
@Selector()
static userLoaded(state:userDetailsModel){
    if(state.userLoaded) return true
    return false
}
@Selector()
static auth(state:userDetailsModel){
    if(state.token.length>0){
       return state.token
    }
    return false
}



}