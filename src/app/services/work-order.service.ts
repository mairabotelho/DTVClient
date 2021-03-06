import {Injectable, Inject} from '@angular/core';
import { environment } from '../../environments/environment';

import {HttpHeaders, HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {WorkOrder} from '../models/WorkOrder';
import {catchError, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {

  baseUrl: string = environment.apiUrl;
  
  addReportUrl: string = this.baseUrl + '/work-orders/create';
  getAllReportsUrl: string = this.baseUrl + '/work-orders';
  uploadFileUrl: string = this.baseUrl + '/uploadFile';


  constructor(private http: HttpClient) {
  }


  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


  addReport(workOrder: WorkOrder): Observable<WorkOrder> {

    console.log('inside add report', this.addReportUrl);


    return this.http.post<WorkOrder>(this.addReportUrl, workOrder, this.httpOptions)
      .pipe(tap(data => console.log(data)), catchError(this.handleError<WorkOrder>('add Work Order', null)));
  }


  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    const data: FormData = new FormData();
    data.append('file', file);
    const newRequest = new HttpRequest('POST', this.baseUrl + '/work-orders/upload-file', data, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(newRequest);
  }


  getAllWorkOrders(): Observable<WorkOrder[]> {

    console.log('inside display work orders');
    return this.http.get<WorkOrder[]>(this.getAllReportsUrl, this.httpOptions)
      .pipe(tap(data => console.log('fetch work orders', data)),
        catchError(this.handleError<WorkOrder[]>('get Work Orders', null)));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  // Work Order File Upload Methods:


}
