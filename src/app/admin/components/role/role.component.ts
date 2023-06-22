import { Component, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';
import { List_Role } from 'src/contracts/roles/list_role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent {
  @ViewChild(ListComponent) listComponents: ListComponent;
  createdRole(create_Role: List_Role) {
    this.listComponents.getRoles();
  }
}
