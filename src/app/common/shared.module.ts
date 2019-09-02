import { NgModule } from '@angular/core';
import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './alert/alert.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LoaderComponent,
    AlertComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderComponent,
    AlertComponent,
    CommonModule
  ],
  entryComponents: [AlertComponent],
  // providers: []
})
export class SharedModule {}
