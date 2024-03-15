import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import  'src/app/models/reponse';

@Injectable({
  providedIn: 'root'
})
export class CrudGenericService<T>
 {
  constructor(public  http: HttpClient,@Inject(String) public  url:string) { }

  create(entity: T,field:any): Observable<Reponse> {
    return this.http.post<Reponse>(`${this.url}${field}`, entity).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }
  getAll(fieldValue:any): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.url}${fieldValue}`).pipe(
      retry(2),
      catchError(this.handleError) 
    );
  }
  getByField(field:any,fieldValue:any): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.url}/${field}/${fieldValue}`).pipe(
      retry(2),
      catchError(this.handleError) 
    );
  }

  getByID(ID:any,field:any): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.url}${field}/${ID}`).pipe(
      retry(2),
      catchError(this.handleError) 
    );
  }
  
  updateWithID(entity: T,ID:any): Observable<Reponse> {
    return this.http.put<Reponse>(this.url + ID, entity);
  }
  update(entity: T,field:any): Observable<Reponse> {
    return this.http.post<Reponse>(`${this.url}${field}` , entity);
  }

  delete(ID: any,field:any): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.url}${field}/${ID}`);
  }

 

   handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  
}
