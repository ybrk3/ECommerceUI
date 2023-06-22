import { Component, EventEmitter, Output } from '@angular/core';
import { Create_Product } from 'src/contracts/create_product';
import { List_Role } from 'src/contracts/roles/list_role';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { RoleService } from 'src/services/common/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  //Event to refresh the product list
  @Output() createdRole: EventEmitter<List_Role> = new EventEmitter();

  constructor(
    private roleService: RoleService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {}

  createRole(roleName: HTMLInputElement) {
    this.roleService.create(
      roleName.value,
      () => {
        this.alertify.message('Role Added', {
          position: Position.TopRight,
          messageType: MessageType.Success,
        });
        this.createdRole.emit();
      },
      (errorMessage) => {
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight,
          delay: 10,
        });
      }
    );
    this.createdRole.emit();
  }
}
