import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AccountServiceService } from '../services/account/account-service.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private httpClient: HttpClient,private authenticationService: AccountServiceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          //location.reload(true);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
  }))
  }


}
