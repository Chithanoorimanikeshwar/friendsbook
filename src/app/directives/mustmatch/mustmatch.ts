import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function mustmatch(control: AbstractControl): ValidationErrors | null {
  // Check the condition you want to validate
 const form=control.parent as FormGroup;
 const passwordData=form.controls['password'].value;
 const cpasswordData=form.controls['cpassword'].value;
//  console.log('password=>',passwordData,'cpassword=>',cpasswordData);
 if(passwordData === cpasswordData){
    return null;
 }
 return {'mustmatch':true}
}
