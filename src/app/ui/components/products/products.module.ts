import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';
import { FilterModuleModule } from 'src/app/pipes/filter-module.module';

@NgModule({
  declarations: [ProductsComponent, ListComponent],
  imports: [
    CommonModule,
    FormsModule,
    FilterModuleModule,
    RouterModule.forChild([{ path: '', component: ProductsComponent }]),
  ],
})
export class ProductsModule {}
