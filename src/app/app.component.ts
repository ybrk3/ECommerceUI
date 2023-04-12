import { Component } from '@angular/core';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ECommerceUI';
  constructor(private toastrservice: CustomToastrService) {
    toastrservice.message('Welcome Burak!', 'Welcome', {
      position: ToastrPosition.BottomLeft,
      messageType: ToastrMessageType.Succes,
    });
  }
}
