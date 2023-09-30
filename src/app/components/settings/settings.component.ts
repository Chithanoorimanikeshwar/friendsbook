import { JsonPipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  Store } from '@ngxs/store';
import { StateReset } from 'ngxs-reset-plugin';
import { Observable, concatMap, filter, from, map } from 'rxjs';
import { fadeInOut } from 'src/app/animations/page-animations.animation';
import { userResponseModel } from 'src/app/models/usermodule';
import { FileuploadService } from 'src/app/services/fileupload/fileupload.service';
import { HttpclientService } from 'src/app/services/httpclient/httpclient.service';
import { PostsService } from 'src/app/services/posts/posts.service';
import { UpdateUserProfileServiceService } from 'src/app/services/settings/update-user-profile-service.service';
import { StateandcountryService, cityModel, countryModel, stateModel } from 'src/app/services/stateandcountry/stateandcountry.service';
import { UserProfilePic } from 'src/app/store/actions/files-action.service';
import { Logout, UpdateMyState } from 'src/app/store/actions/user-action.service';
import { userProfile } from 'src/app/store/state/custom-seletor.factory';
import { UserDetails, userDetailsModel } from 'src/app/store/state/user-details.service';
export type updatedUserProfile={
  city:string
country: string
state:string
dob: string
firstname: string
gender:string
lastname: string
phonenumber: string
pincode:number
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations:[fadeInOut]
})
export class SettingsComponent implements OnInit {
  public userDetailsUpdateForm!: FormGroup;
  public profilePic:string
  public userDetails:userResponseModel
  public isEditModeOn:boolean
  public countries$:Observable<countryModel[]>
  public states$!:Observable<stateModel[]> 
  public countries:countryModel[];
  public country:string;
  public countryIso:string;
  public stateIso:string;
  public state:string;
  public cities$!:Observable<cityModel[]>
  public prevUserDetails!:Record<string, any>
  constructor(
    private store:Store,
    private router:Router,
    private fb:FormBuilder,
    private render:Renderer2,
    private countryandstateservice:StateandcountryService,
    private settingService:UpdateUserProfileServiceService,
    private fileservice:FileuploadService,
    private postservices:PostsService,
    private userservices:HttpclientService
  ){
    this.userDetails={} as userResponseModel;
    this.isEditModeOn=false;
    this.countries$={} as Observable<countryModel[]>
    this.countries=[]
    this.country=""
    this.state=""
    this.countryIso=""
    this.stateIso=""
    this.profilePic="assets/person-fill.svg"
  }
  
  ngOnInit(): void {
    this.countries$=this.countryandstateservice.getCountriesList()

    this.userDetails=this.store.selectSnapshot<userResponseModel>((state)=>state.UserDetails.userDetails as userResponseModel)
    const selector=userProfile(this.userDetails._id)
    this.store.select(selector).subscribe({
      next:(res)=>{
        console.log(`blob:${res}`);
        if(res) this.profilePic=res;
        else this.store.dispatch(new UserProfilePic(this.userDetails.photoId,this.userDetails._id));


        // Replace 'blobURL' with your actual Blob URL
        
      }
    })
    this.initizeForm();

    this.country=this.userDetailsUpdateForm.controls['country'].value
    this.state=this.userDetailsUpdateForm.controls['state'].value
  }
  public initizeForm(){
    const date=new Date(this.userDetails.dob)
    console.log(formatDate(this.userDetails.dob, 'yyyy-MM-dd', 'en').toString())
   this. userDetailsUpdateForm=this.fb.group({
      firstname:[{value:this.userDetails.firstName,disabled: true},[Validators.pattern("[a-zA-Z]+")]],
      lastname:[{value:this.userDetails.lastName,disabled: true},[Validators.pattern("[a-zA-Z]+")]],
      email:[{value:this.userDetails.email,disabled:true},[Validators.required]],
      dob: [{ value: formatDate(this.userDetails.dob, 'yyyy-MM-dd', 'en'), disabled: true }, [Validators.required]],
      gender:[{value:this.userDetails.gender,disabled:true},Validators.required],
      phonenumber:[{value:this.userDetails.phonenumber,disabled:true},Validators.pattern(/^[0-9]{10}$/)],
      country:{value:this.userDetails.country,disabled:true},
      state:{value:this.userDetails.state,disabled:true},
      city:{value:this.userDetails.city,disabled:true},
      pincode:{value:this.userDetails.pincode,disabled:true}
    })
  }
  public logoutUser(){
      this.store.dispatch(new Logout()).subscribe({
        complete:()=>{
          this.userservices.updateUserInfo(this.userDetails._id,{isActive:false}).subscribe({
            complete:()=> this.router.navigateByUrl('login')
          })
        }
      })
     
     
      
  }

  // -----------------------------editModeActive--------------------------------------------
  public activateEditMode(event:any){
    const element=event.target as HTMLImageElement;
     this.prevUserDetails=this.userDetailsUpdateForm.value as Record<string, any>

   
    this.isEditModeOn=true;
    this.render.setStyle(element,'display','none');

    const keys=Object.keys(this. userDetailsUpdateForm.value)
    for(let key of keys){
      this.userDetailsUpdateForm.controls[key].enable(); 
    }

  }
  public deactivaEditMode(){
    const keys=Object.keys(this. userDetailsUpdateForm.value)
    for(let key of keys){
      this.userDetailsUpdateForm.controls[key].disable(); 
    }

  }
  public updateUserInfo(){
    const updateduserdata=this.userDetailsUpdateForm.value as updatedUserProfile
    if(!this.shallowEquals(updateduserdata,this.prevUserDetails)){
        console.log(updateduserdata);
        console.log('updates needed');
      this.settingService.updateUserInfo(this.userDetails._id,updateduserdata).subscribe({
        next:()=>{
          let userDetails=this.userDetails as Record<string, any>
          let updatedData=updateduserdata as Record<string, any>
          let updatedFields=this.updatedFields(updateduserdata,this.prevUserDetails)
          for(let updatedField of updatedFields){
            userDetails[updatedField]=updatedData[updatedField]
          }
          this.store.dispatch(new UpdateMyState(userDetails as userResponseModel))
            this.isEditModeOn=false;
            this.deactivaEditMode();

        }
      })


    }else{
      console.log('no updates found')
       this.isEditModeOn=false;
       this.deactivaEditMode();
    }

  }
  public updatedFields(updatedUserDetails:Record<string, any>,prevUserDetails: Record<string, any>){
    const keys=Object.keys(updatedUserDetails);
    let fieldsToUpdate:string[]=[]
    for(let key of keys){
      if(updatedUserDetails[key]!= prevUserDetails[key]){
        fieldsToUpdate.push(key)
      }
    }
    return fieldsToUpdate
  }
  public shallowEquals(updatedUserDetails:Record<string, any>,prevUserDetails: Record<string, any>):boolean{

    const keys=Object.keys(updatedUserDetails);
    for(let key of keys){
      if(updatedUserDetails[key]!= prevUserDetails[key]){
        return false;
      }
    }

    return true
  }
  // -------------------------------country-----------------------------------------
   public selectedCountry(data:string){
    const element=JSON.parse(data) 
    
    const updateForm={
      country:element.data
    }
    this.userDetailsUpdateForm.patchValue(updateForm);
    this.country=this.userDetailsUpdateForm.controls['country'].value
    this.countryIso=element.element.iso2
   }

  //  -----------------------------------state-------------------------------------
   public stateClicked(event:any){
    console.log('stateclicked');
    console.log(this.country);
    if(!(this.country==="")){
      const element=event.target as HTMLElement;
     this.states$=this.countries$.pipe(
        concatMap((res)=>{
          return this.getIsoCode(this.country,res);
        }),
        concatMap((res)=>{
          return this.countryandstateservice.getStateListByCountry(res)
        })
      )
        element.removeEventListener('click',this.stateClicked);
    }

   }
  
   public selectedState(data:string){
    const element=JSON.parse(data) 
    
    const updateForm={
      state:element.data
    }
    this.userDetailsUpdateForm.patchValue(updateForm);
    this.state=this.userDetailsUpdateForm.controls['state'].value
    this.stateIso=element.element.iso2

   }
  //  -------------------------utility-----------------------------------
   public getIsoCode(data:string,In:countryModel[]):Observable<string>{
    
    return from(In).pipe(
      filter((res)=>{
        return res.name === data
         
      }),
      map((res)=>res.iso2)
    )

   }

  


  public activateInputFile(element:HTMLInputElement){
    element.click()
  }
  public uploadProfilePicture(event:any){
    const file=event.target.files[0] as File;
    if(file){
      this.fileservice.uploadFile(file).subscribe({
        next:(res)=>{
          console.log('userprofileupdatedid',res)
          if(res){
            this.store.dispatch(new UserProfilePic(res.uploadId,this.userDetails._id)).subscribe({
              complete:()=>{
                this.postservices.updateBulkPosts(this.userDetails._id,res.uploadId),
                this.userservices.updateUserPhotoId(this.userDetails._id,res.uploadId)
              }
            })
            
            
          }
        }
      })
    }
  }
  public resetPassword(){
    this.router.navigate(['resetpass',this.userDetails._id])
  }
}
