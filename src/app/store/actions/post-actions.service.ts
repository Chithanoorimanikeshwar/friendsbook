import { postModel } from "src/app/services/posts/posts.service";

export class FetchPosts{
    static readonly type='[post] fetch';
    constructor(public id:string){}
}
export class FetchAllPosts{
    static readonly type='[post] fectchall';
    constructor(){}
}
export class FetchFirst{
    static readonly type='[post] fetchby';
    constructor(public posts:number){}
}
export class UploadPost{
    static readonly type='[post] upload';
    constructor(public userId:string){}
}
export class DeletePost{
    static readonly type='[post] Deleted';
    constructor(public PostDetails:postModel){}
}