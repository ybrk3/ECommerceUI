import { Component, Input, OnInit } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/services/admin/alertify.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/services/ui/custom-toastr.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  //we will get info to make request to backend so we get the info from component which is using this component as a service therefore it's Input()
  @Input() options: Partial<FileUploadOptions>;

  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService
  ) {}

  //Selected Files
  public files: NgxFileDropEntry[];

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;

    //Format we are using to send files to backend
    const fileData: FormData = new FormData();

    //Appending each files to FormData
    for (const file of files) {
      //Convert it to reach files' properties such as name
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        //Adding files to fileData which is used as sending request
        fileData.append(_file.name, _file, file.relativePath);
      });
    }

    //We are sending our FormDatas' to backend through HttpClientService post method
    this.httpClientService
      .post(
        {
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          //It is related to ngxFileDrop Document
          headers: new HttpHeaders({ responseType: 'blob' }),
        },
        fileData //files to be uploaded
      )
      .subscribe({
        next: (data) => {
          const successMessage: string = 'Selected files uploaded successfully';
          if (this.options.isAdmin) {
            //For admin we are using alertify
            this.alertifyService.message(successMessage, {
              messageType: MessageType.Success,
              dismissOthers: true,
              position: Position.TopRight,
            });
          } else {
            //For UI we are using toastr
            this.customToastrService.message(successMessage, 'Successful !', {
              messageType: ToastrMessageType.Succes,
              position: ToastrPosition.TopRight,
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage: string = 'Sorry, Unexpected Error!';
          if (this.options.isAdmin) {
            this.alertifyService.message(errorMessage, {
              messageType: MessageType.Error,
              dismissOthers: true,
              position: Position.TopCenter,
            });
          } else {
            this.customToastrService.message(errorMessage, 'ERROR !', {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopCenter,
            });
          }
          //To remove the selected files after facing an error
          this.files.splice(0, this.files.length);
        },
      });
  }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string; //to get specific info such as id to upload files
  explanation?: string; //it is used in html to reflect to the client
  accept?: string; //we set our specific extension to let client upload accordingly. With [accept] in html
  isAdmin?: boolean = false; //we have 2 different notification type (Alertify&Toastr)
}
