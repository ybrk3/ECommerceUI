import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) {}

  private Url(requestParameter: Partial<RequestParameter>): string {
    return `${
      requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl
    }/${requestParameter.controller}${
      requestParameter.action ? `/${requestParameter.action}` : ''
    }`;
  }

  get<T>(
    requestParameter: Partial<RequestParameter>,
    id?: string
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.Url(requestParameter)}${id ? `/${id}` : ''}${
        requestParameter.queryString ? `?${requestParameter.queryString}` : ''
      }`;

    return this.httpClient.get<T>(url, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
      /*we are getting response as a blob that's why added this parameter. Default is always "json". 
      it doesnot accept any other type except for "json" that's why we added <as "json">*/
    });
  }

  post<T>(
    requestParameter: Partial<RequestParameter>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.Url(requestParameter)}${
        requestParameter.queryString ? `?${requestParameter.queryString}` : ''
      }`;

    return this.httpClient.post<T>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
      /*we are getting response as a blob that's why added this parameter. Default is always "json". 
      it doesnot accept any other type except for "json" that's why we added <as "json">*/
    });
  }

  put<T>(
    requestParameter: Partial<RequestParameter>,
    body: Partial<T>
  ): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.Url(requestParameter)}${
        requestParameter.queryString ? `?${requestParameter.queryString}` : ''
      }`;

    return this.httpClient.put<T>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
      /*we are getting response as a blob that's why added this parameter. Default is always "json". 
      it doesnot accept any other type except for "json" that's why we added <as "json">*/
    });
  }

  delete<T>(requestParameter: RequestParameter, id: string): Observable<T> {
    let url: string = '';
    if (requestParameter.fullEndPoint) url = requestParameter.fullEndPoint;
    else
      url = `${this.Url(requestParameter)}/${id}${
        requestParameter.queryString ? `?${requestParameter.queryString}` : ''
      }`;

    return this.httpClient.delete<T>(url, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json',
      /*we are getting response as a blob that's why added this parameter. Default is always "json". 
      it doesnot accept any other type except for "json" that's why we added <as "json">*/
    });
  }
}

export class RequestParameter {
  controller?: string;
  action?: string;
  queryString?: string;

  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;

  responseType?: string = 'json'; //we are getting response as a blob that's why added this parameter. Default is always "json".
}
