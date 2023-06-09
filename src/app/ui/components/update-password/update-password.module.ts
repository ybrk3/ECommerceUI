import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdatePasswordComponent } from './update-password.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UpdatePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UpdatePasswordComponent }]),
    ReactiveFormsModule,
  ],
})
export class UpdatePasswordModule {}
