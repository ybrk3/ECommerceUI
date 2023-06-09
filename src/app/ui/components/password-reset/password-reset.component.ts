import { Component } from '@angular/core';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { AuthService } from 'src/services/common/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})

/**which is to send reset password link to the user */
/**Notification to user is always like "mail sent successfully" */
export class PasswordResetComponent {
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService
  ) {}

  async resetPassword(email: string) {
    await this.authService.resetPassword(email, () => {
      this.alertify.message('The link has been sent your email address', {
        messageType: MessageType.Notify,
        position: Position.BottomRight,
      });
    });
  }
}
