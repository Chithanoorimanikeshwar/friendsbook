export class SetNavbar{
    static readonly type='[navbar] set';
    constructor(public payload:string[]){}
}
export class ClearNavbar{
    static readonly type='[navbar] clear';
}
