import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AuthorizeMenuDialogComponent } from 'src/app/dialogs/authorize-menu-dialog/authorize-menu-dialog.component';
import { ApplicationService } from 'src/services/common/application.service';
import { DialogService } from 'src/services/common/dialog.service';

@Component({
  selector: 'app-authorize-menu',
  templateUrl: './authorize-menu.component.html',
  styleUrls: ['./authorize-menu.component.css'],
})
export class AuthorizeMenuComponent implements OnInit {
  treeControl = new NestedTreeControl<ITreeMenu>((node) => node.actions);
  dataSource = new MatTreeNestedDataSource<ITreeMenu>();

  constructor(
    private applicationService: ApplicationService,
    private dialogService: DialogService
  ) {}
  async ngOnInit() {
    this.dataSource.data = (
      await this.applicationService.getAuthorizationDefinitionEndpoints()
    ).map((m) => {
      const menuTree: ITreeMenu = {
        name: m.menuName,
        actions: m.actions.map((a) => {
          const actionTree: ITreeMenu = {
            name: a.definition,
            actionCode: a.actionCode,
          };
          return actionTree;
        }),
      };
      return menuTree;
    });
  }

  hasChild = (_: number, menu: ITreeMenu) => menu.actions?.length > 0;

  authorize(actionCode: string, name: string) {
    this.dialogService.openDialog({
      component: AuthorizeMenuDialogComponent,
      options: { width: '750px' },
      data: { actionCode: actionCode, name: name },
      afterClosed: () => {},
    });
  }
}

interface ITreeMenu {
  name?: string;
  actions?: ITreeMenu[];
  actionCode?: string;
}
