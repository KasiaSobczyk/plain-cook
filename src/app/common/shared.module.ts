import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './alert/alert.component';
import { CommonModule } from '@angular/common';
import { CarouselDirective } from './carousel.directive';

@NgModule({
  declarations: [
    LoaderComponent,
    AlertComponent,
    CarouselDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderComponent,
    AlertComponent,
    CommonModule,
    CarouselDirective
  ],
  entryComponents: [AlertComponent],
  // providers: []
})
export class SharedModule {}
