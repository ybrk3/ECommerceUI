import { Inject, Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor(@Inject('baseSignalRUrl') private baseSignalRUrl: string) {}

  //it will start connection, if disconnected, try to reconnect, and create hub and return necessary notification regarding hub connection
  start(hubUrl: string) {
    hubUrl = this.baseSignalRUrl + hubUrl;
    /*
    if state removed, this method return hubConnection and used in invoke() and on() methods
    if (
      !this.connection ||
      this._connection?.state === HubConnectionState.Disconnected
    ) {*/
    //it will connect the hub in server
    //create connection to communication with hub in server
    const builder: HubConnectionBuilder = new HubConnectionBuilder();

    //we create a hub connection through above builder
    const hubConnection: HubConnection = builder
      .withUrl(hubUrl)
      .withAutomaticReconnect() //automatic connection
      .build(); //create instance of HubConnection

    //if connected, it'll give notification
    //if not, it will try to connect every 2 secs.
    hubConnection
      .start()
      .then(() => console.log('connected'))
      .catch((err) => {
        setTimeout(() => {
          this.start(hubUrl);
        }, 2000);
      });

    //}

    //In case of disconnection after connection

    //when re-connected
    hubConnection.onreconnected((connectionId) => {
      console.log('Reconnected');
      //connectionId is client id which creates connection
    });

    //while trying to re-connecting
    hubConnection.onreconnecting((err) => console.log('Reconnecting..'));

    //When disconnected, tries to reconnect however couldnt connected again
    hubConnection.onclose((err) => console.log('Close reconnection'));

    return hubConnection;
  }

  //It will send message from one client to others. It's kinda an event such writing message and enter
  invoke(
    hubUrl: string,
    procedureName: string,
    message: any,
    successCallBack?: (value) => void,
    errorCallBack?: (error) => void
  ) {
    this.start(hubUrl)
      .invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }

  //It will catch the messages from server and it will invoke the event when message arrives
  //this can be caught on ngOnit
  on(hubUrl: string, procedureName: string, callBack: (...message) => void) {
    this.start(hubUrl).on(procedureName, callBack);
  }
}
