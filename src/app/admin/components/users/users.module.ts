import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDirectiveModule } from 'src/app/directives/delete/delete.directive.module';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [UsersComponent, ListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UsersComponent }]),
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DeleteDirectiveModule,
    MatDividerModule,
    MatIconModule,
    DeleteDirectiveModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UsersModule {}
