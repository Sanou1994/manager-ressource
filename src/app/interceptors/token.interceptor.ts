import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { retry, catchError, map, finalize } from 'rxjs/operators';
import { AccountServiceService } from '../services/account/account-service.service';
import { LoaderService } from '../services/loader/loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(private httpClient: HttpClient,private accountService: AccountServiceService,private router: Router,private loadingService: LoaderService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const jwt =localStorage.getItem('token');
     

      this.totalRequests++;
      this.loadingService.setLoading(true);

      if (!!localStorage.getItem('token'))
      {
          
        let keyword=request.url.split("/")[request.url.split("/").length -1];

         if(request.method == "POST" && keyword == "file")
         {
          request = request.clone({

            setHeaders: { authorization: `Bearer ${jwt}` }          
          });
         }
         else
         {
          request = request.clone({
            setHeaders: { 'Content-Type': 'application/json',authorization: `Bearer ${jwt}` }          
          });
         }
        
       
      }
      else{
        request = request.clone({
          setHeaders: { 'Content-Type': 'application/json' }          
        });
      }

      

      
      return next.handle(request)
           .pipe(                
                 catchError((error: HttpErrorResponse) =>
                  { 
                   switch(error.status)
                   {
                    case 500 : this.router.navigate(['/auth']);break;
                    case  404: this.router.navigate(['/404']);break;
                    default :this.router.navigate(['/auth']);
                   }

                    return throwError(error.status);
                 }),
                 finalize(() => {
                  this.totalRequests--;
                  if (this.totalRequests == 0) {
                    this.loadingService.setLoading(false);
                  }
                })

           )

  }
  
 

}
