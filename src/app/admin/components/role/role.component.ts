import { Component, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';
import { Create_Product } from 'src/contracts/create_product';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent {
  @ViewChild(ListComponent) listComponents: ListComponent;
  createdProduct(create_Product: Create_Product) {
    this.listComponents.getProducts();
  }
}
