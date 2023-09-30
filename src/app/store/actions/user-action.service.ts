import { loginModel, userResponseModel } from "src/app/models/usermodule";

export class login {
    static readonly type='[user] login';
    constructor(public logincredentials:loginModel, public errorCallback: (error: any) => void){}
}
export class loginSuccess{
    static readonly type='[user-login] success';
    constructor(public payload:any){}
}
export class loginFailure{
    static readonly type='[user-login] fail';
    constructor(public payload:any){}
}
export class SetData {
    static readonly type = '[userdetails] Set Data';
    constructor(public payload: any) {}
  }
export class UpdateMyState{
    static readonly type='[userdetails] update Data';
    constructor(public updatedUserData:userResponseModel){}
}
export class Logout{
    static readonly type='[userdetails] logout';
    constructor(){}
}