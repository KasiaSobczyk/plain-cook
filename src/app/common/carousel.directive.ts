import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCarousel]'
})
export class CarouselDirective {
  @HostBinding('class.active.carousel-item-left') isActive = true;
}
