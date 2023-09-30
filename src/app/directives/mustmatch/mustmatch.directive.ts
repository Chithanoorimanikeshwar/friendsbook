import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { mustmatch } from './mustmatch';

@Directive({
  selector: '[Mustmatch]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MustmatchDirective,
      multi: true
    }
  ]
})
export class MustmatchDirective implements Validator {

  constructor() { }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return mustmatch(control);
  }

}
