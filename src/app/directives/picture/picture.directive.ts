import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Directive({
  selector: '[appPicture]'
})
export class PictureDirective implements OnInit {
  @Input('img$') img$!:Observable<string | false>
 
  constructor(
    private store:Store,
    private el:ElementRef,
    private render:Renderer2
  ) {
    this.render.setAttribute(this.el.nativeElement,'src','assets/person-fill.svg');
   }
  ngOnInit(): void {
    this.img$.subscribe({
      next:(res)=>{
        if(res){
          this.render.setAttribute(this.el.nativeElement,'src',res);
        }
      }
    })
  }

}
