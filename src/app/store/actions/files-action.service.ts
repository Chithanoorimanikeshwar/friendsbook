export class UserProfilePic{
    static readonly type='[Network] get';
    constructor(public photoId:string,public userId:string){}
}