import { style, transition, trigger ,animate, state} from '@angular/animations';

// export const fadeInOut=trigger('fadeInOut',[
//     transition(':enter',[
//         style({
//             opacity:0,
//         }),animate('300ms',style({opacity:1}))
//     ]),
//     transition(':leave',[
//         style({
//             opacity:1
//         }),animate('300ms',style({opacity:0}))
//     ])
// ])

export const fadeInOut=trigger('fade', [
        state('in', style({ opacity: 1 })),
        transition(':enter', [
          
          style({ opacity: 0 }),
          animate('300ms', style({ opacity: 1 })),
        ]),
        transition(':leave', [
          animate('300ms', style({ opacity: 0 })),
        ]),
      ])
    