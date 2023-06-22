import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { List_Role } from 'src/contracts/roles/list_role';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { DialogService } from 'src/services/common/dialog.service';
import { RoleService } from 'src/services/common/role.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Role> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  appDelete: any;

  constructor(
    private roleService: RoleService,
    private alertify: AlertifyService
  ) {}

  async ngOnInit() {
    await this.getRoles();
  }

  async getRoles() {
    const allRoles: { roles: List_Role[]; totalRolesCount: number } =
      await this.roleService.getRoles(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5,
        () => {},
        (errorMessage) =>
          this.alertify.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight,
            delay: 10,
          })
      );
    this.dataSource = new MatTableDataSource<List_Role>(allRoles.roles);
    this.paginator.length = allRoles.totalRolesCount;
  }

  async pageChanged() {
    await this.getRoles(); //page event
  }
}
