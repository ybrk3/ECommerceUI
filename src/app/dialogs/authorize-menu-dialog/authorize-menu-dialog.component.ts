import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { List_Role } from 'src/contracts/roles/list_role';
import { RoleService } from 'src/services/common/role.service';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpointService } from 'src/services/common/authorization-endpoint.service';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.css'],
})
export class AuthorizeMenuDialogComponent
  extends BaseDialog<AuthorizeMenuDialogComponent>
  implements OnInit
{
  roleDatas: { roles: List_Role[]; totalRolesCount: number };
  listRoles: { name: string; selected: boolean }[];
  roles: string[];
  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>, //to close dialog box
    @Inject(MAT_DIALOG_DATA)
    public data: { actionCode: string; name: string; menuName: string },
    private roleService: RoleService,
    private authorizationEndpointService: AuthorizationEndpointService
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.roleDatas = await this.roleService.getRoles(-1, -1);
    this.roles = await this.authorizationEndpointService.getRolesToEndpoint(
      this.data.actionCode,
      this.data.menuName
    );

    this.listRoles = this.roleDatas.roles.map((r: any) => {
      return { name: r.name, selected: this.roles?.indexOf(r.name) > -1 };
    });
  }

  async assignRoles(rolesComponent: MatSelectionList) {
    const selectedRoles: string[] = rolesComponent.selectedOptions.selected.map(
      (r) => r._text.nativeElement.innerText
    );

    await this.authorizationEndpointService.assignRoleEndpoint(
      selectedRoles,
      this.data.actionCode,
      this.data.menuName,
      () => {},
      () => {}
    );
  }
}
