import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../common/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserComponent } from './user.component';

@NgModule({
 declarations: [UserComponent],
 imports: [
   FormsModule,
   CommonModule,
   RouterModule.forChild([{ path: '', component: UserComponent }]),
   SharedModule
 ],
})
export class AuthModule {}
