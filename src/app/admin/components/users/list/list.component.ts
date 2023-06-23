import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorizeUserDialogComponent } from 'src/app/dialogs/authorize-user-dialog/authorize-user-dialog.component';

import { ListUsers } from 'src/contracts/users/list_users';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { DialogService } from 'src/services/common/dialog.service';
import { UserService } from 'src/services/common/models/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = [
    'nameSurname',
    'username',
    'email',
    'twoFactorEnabled',
    'assignRoles',
    'delete',
  ];
  dataSource: MatTableDataSource<ListUsers> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  appDelete: any;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private dialogService: DialogService
  ) {}

  async ngOnInit() {
    await this.getUsers();
  }

  async getUsers() {
    const allUsers: { totalUsersCount: number; users: ListUsers[] } =
      await this.userService.getUsers(
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

    this.dataSource = new MatTableDataSource<ListUsers>(allUsers.users);
    this.paginator.length = allUsers.totalUsersCount;
  }

  async pageChanged() {
    await this.getUsers(); //page event
  }

  asignRolesToUser(userId: string) {
    this.dialogService.openDialog({
      component: AuthorizeUserDialogComponent,
      options: { width: '750px' },
      data: { userId: userId },
      afterClosed: () => {
        this.alertify.message('Roles are successfully assigned', {
          messageType: MessageType.Success,
          position: Position.BottomRight,
        });
      },
    });
  }
}
