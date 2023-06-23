import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { RoleModule } from './role/role.module';
import { UsersModule } from './users/users.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsModule,
    CustomersModule,
    OrdersModule,
    DashboardModule,
    AuthorizeMenuModule,
    RoleModule,
    UsersModule,
  ],
})
export class ComponentsModule {}
