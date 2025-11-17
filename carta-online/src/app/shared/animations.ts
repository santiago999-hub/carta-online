import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease-in', style({ opacity: 1 }))
  ])
]);

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const slideInFromLeft = trigger('slideInFromLeft', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ])
]);

export const slideInFromRight = trigger('slideInFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);

export const cardAnimation = trigger('cardAnimation', [
  transition(':enter', [
    style({ 
      transform: 'translateY(40px) scale(0.9)', 
      opacity: 0 
    }),
    animate('600ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
      style({ 
        transform: 'translateY(0) scale(1)', 
        opacity: 1 
      })
    )
  ])
]);
