import { Directive, ElementRef, HostListener, Renderer2,Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, concatMap, debounceTime, distinctUntilChanged, filter, from, fromEvent, map, take, toArray } from 'rxjs';
import { countryModel } from 'src/app/services/stateandcountry/stateandcountry.service';

@Directive({
  selector: '[appDynamiclist]'
})
export class DynamiclistDirective implements OnInit {
  @Input() Observable$!:Observable<any[]>
  @Output() selected = new EventEmitter<string>();
  @Input() Searchby!:string;
  public ul:HTMLUListElement
  constructor(
    private el:ElementRef,
    private render:Renderer2
  ) { 
    this.ul=this.render.createElement('ul')
  }
  ngOnInit(): void {
    const silbling=this.el.nativeElement as HTMLElement
    const parent=silbling.parentNode;
    parent?.appendChild(this.ul)
    // this.render.setStyle(this.ul,'height','20vh');
    // this.render.setStyle(this.ul,'overflow','auto');
    // this.render.setStyle(this.ul,'position','absolute');
    // this.render.setStyle(this.ul,'display','none');
    // this.render.setStyle(this.ul,'background-color','darkgray')
    this.render.addClass(this.ul,'list');
  
  }
  @HostListener('click',['$event']) InputClicked(event:any){
    const input=event.target as HTMLElement;
    // const search=input.nextSibling 
    // let serachData
    // console.log(search)
    // this.render.setStyle(search,'display','block')

    fromEvent(input,'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((res)=>{
        const element=res.target as HTMLInputElement
        return element.value
      })).subscribe({
        next:(res)=>{
          // console.log(res);
          this.fetchCountry(res);
          
        }
        
      })
      
   }
   public fetchCountry(userInput:string){
    if(this.Observable$){
        console.log(userInput)
        this.Observable$.pipe(
          concatMap((res)=>from(res)),
          filter((countriesList)=>{
            return countriesList[this.Searchby].toLowerCase().indexOf(userInput.toLowerCase())>=0
          }),
          // map((res)=>{
          //   return res.name
          // }),
          take(10),
          toArray()
        ).subscribe({
          next:(res)=>{
            console.log(res);
            this.appendData(res)

          }
          
          
        })
    }
   }
   public appendData(res:countryModel[]){
    this.ul.innerHTML=""
    for(let data of res){
      const li=this.render.createElement('li') as HTMLLIElement
         li.innerHTML=data.name
         this.render.setAttribute(li, 'data-item', JSON.stringify(data));
         li.classList.add('nav-link', 'border-bottom', 'p-2','li');
         li.addEventListener('click',(ev)=>{
          let element=ev.target as HTMLElement
          this.render.setStyle(this.ul,'display','none');
          this.emitData(element.innerHTML,element.getAttribute('data-item'))
          console.log(ev.target);
         })
      this.ul.appendChild(li)
    }
    this.render.setStyle(this.ul,'display','block');
   }
  public emitData(data:string,element:string |null){
    const obj={
      data,
      element
    }

    this.selected.emit(JSON.stringify(obj));
  }
}
