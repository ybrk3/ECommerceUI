import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  //it represents the connection to Hub
  private _connection: HubConnection;
  get connection(): HubConnection {
    return this._connection;
  }

  constructor() {}

  //it will start connection, if disconnected, try to reconnect, and create hub and return necessary notification regarding hub connection
  start(hubUrl: string) {
    if (
      !this.connection ||
      this._connection?.state === HubConnectionState.Disconnected
    ) {
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
        .then(() => {
          console.log('connected');
          this._connection = hubConnection;
        })
        .catch((err) => {
          setTimeout(() => {
            this.start(hubUrl);
          }, 2000);
        });
    }

    //In case of disconnection after connection

    //when re-connected
    this._connection.onreconnected((connectionId) => {
      console.log('Reconnected');
      //connectionId is client id which creates connection
    });

    //while trying to re-connecting
    this._connection.onreconnecting((err) => console.log('Reconnecting..'));

    //When disconnected, tries to reconnect however couldnt connected again
    this._connection.onclose((err) => console.log('Close reconnection'));
  }

  //It will send message from one client to others. It's kinda an event such writing message and enter
  invoke(
    procedureName: string,
    message: any,
    successCallBack?: (value) => void,
    errorCallBack?: (error) => void
  ) {
    this.connection
      .invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }

  //It will catch the messages from server and it will invoke the event when message arrives
  on(procedureName: string, callBack: (...message) => void) {
    this.connection.on(procedureName, callBack);
  }
}
