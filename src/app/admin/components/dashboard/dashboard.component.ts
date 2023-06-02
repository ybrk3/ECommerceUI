import { Component, OnInit } from '@angular/core';
import { HubUrls } from 'src/constants/hub-urls';
import { ReceiveFunctions } from 'src/constants/receive-functions';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import { SignalRService } from 'src/services/common/signalr.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private signalRService: SignalRService,
    private alertifyService: AlertifyService
  ) {
    //it will starts the connection to hub
    signalRService.start(HubUrls.ProductionHub);
    signalRService.start(HubUrls.OrderHub);
  }

  ngOnInit(): void {
    //catch the message and render it on alert window
    this.signalRService.on(
      ReceiveFunctions.ProductAddedMessageRecieveFunction,
      (message) =>
        this.alertifyService.message(message, {
          messageType: MessageType.Notify,
          position: Position.TopRight,
        })
    );

    //catch the message and render it on alert window for ORDER
    this.signalRService.on(
      ReceiveFunctions.OrderAddedMessageRecieveFunction,
      (message) =>
        this.alertifyService.message(message, {
          messageType: MessageType.Notify,
          position: Position.TopCenter,
        })
    );
  }
}
