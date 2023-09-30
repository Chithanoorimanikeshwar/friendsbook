import { Action, Selector, State, StateContext } from "@ngxs/store"
import { ClearNavbar, SetNavbar } from "../actions/navbar-action.service"
import { Injectable } from "@angular/core";

type navbar={
    list:string[]
}
@Injectable()
@State<navbar>({
    name:'navbar',
    defaults:{
        list:[]
    }
})

export class NavList {
 
@Action(SetNavbar)
setNavbar(ctx:StateContext<navbar>,payload:SetNavbar){
    const state=ctx.getState();
    ctx.setState({
        ...state,
        list:payload.payload
    })
}
@Action(ClearNavbar)
clearNavbar(ctx:StateContext<navbar>){
    const state=ctx.getState();
    ctx.setState({
        ...state,
        list:[]
    })
}

// -----------------------------------------Selectors-------------------------------

@Selector()
static getState(state:navbar){
    if(state.list.length > 0){
        return state.list
    }
    return false
}
}