import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { UserService } from 'src/services/common/models/user.service';
import { List_Role } from 'src/contracts/roles/list_role';
import { RoleService } from 'src/services/common/role.service';
import { AuthorizationEndpointService } from 'src/services/common/authorization-endpoint.service';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.css'],
})
export class AuthorizeUserDialogComponent
  extends BaseDialog<AuthorizeUserDialogComponent>
  implements OnInit
{
  roleDatas: { roles: List_Role[]; totalRolesCount: number };
  listRoles: { name: string; selected: boolean }[];
  assignedRoles: string[];
  constructor(
    dialogRef: MatDialogRef<AuthorizeUserDialogComponent>, //to close dialog box
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private roleService: RoleService,
    private userService: UserService,
    private authorizationEndpointService: AuthorizationEndpointService
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.roleDatas = await this.roleService.getRoles(-1, -1);
    this.assignedRoles = await this.userService.getUserRoles(this.data.userId);

    this.listRoles = this.roleDatas.roles.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedRoles?.indexOf(r.name) > -1,
      };
    });
  }

  async assignRoles(rolesComponent: MatSelectionList) {
    const selectedRoles: string[] = rolesComponent.selectedOptions.selected.map(
      (r) => r._text.nativeElement.innerText
    );

    await this.userService.assignRoleToUser(this.data.userId, selectedRoles);
  }
}
