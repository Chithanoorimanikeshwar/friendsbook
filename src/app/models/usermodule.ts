export interface userModel{
    firstname:string,
    lastname:string,
    email:string,
    dob:string,
    gender:string,
    password:string
}
export interface loginModel{
    email:string,
    password:string
}
export interface ForgotPassResponse {
    createdDate: string;
    dob: string;
    email: string;
    firstName: string;
    gender: string;
    id: string;
    isActive: boolean;
    isAdmin: boolean;
    lastName: string;
    password: string;
    photoId: string;
    __v: number;
    _id: string;
  }
  
  // Assuming response is of type User[]
export interface userResponseModel {
    isAdmin: boolean;
    isActive: boolean;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    gender: string;
    photoId: string;
    createdDate: string;
    __v: number,
    id: string;
    friend?:boolean;
    phonenumber?:string;
    country?:string;
    state?:string;
    city?:string;
    pincode?:string;
    
}
  