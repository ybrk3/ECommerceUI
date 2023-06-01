import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageType } from 'src/services/admin/alertify.service';
import { AuthService } from 'src/services/common/auth.service';
import {
  ComponentType,
  DynamicLoadComponentService,
} from 'src/services/common/models/dynamic-load-component.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ECommerceUI';

  //Directive for dynamic load component
  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  //AuthService is public due to it is being used in html
  constructor(
    public authService: AuthService,
    private toastrService: CustomToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private dynamicLoadComponentService: DynamicLoadComponentService //which is for dynamically load basket component modal page
  ) {
    authService.identityCheck();
  }

  signOut() {
    //remove token from local storage
    localStorage.removeItem('accessToken');
    //run identityCheck to re-set nav-links (such as adding register, login)
    this.authService.identityCheck();

    //send message to client
    this.toastrService.message('Hope to see you again!', 'Logged Out', {
      messageType: ToastrMessageType.Info,
      position: ToastrPosition.TopRight,
    });

    //If it's from google authentication first sign out from there

    this.socialAuthService.signOut();
    //route to the main page
    this.router.navigate(['login']);
  }

  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(
      ComponentType.BasketsComponent,
      this.dynamicLoadComponentDirective.viewContainerRef
    );
  }
}
