import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrudGenericService } from '../crud-generic/crud-generic.service';
import 'src/app/models/unavailability'
@Injectable({
  providedIn: 'root'
})
export class UnavailabilityService extends CrudGenericService<unavailability>
{
  _url:string=environment.url;
  constructor(private router : Router, http: HttpClient){ super(http,environment.url)} 
  restitution(p:any)
  {
    return this.http.post<any>(this._url+"unavailabilities/restitution",p) .pipe(
      catchError(this.handleError)
    )
  }
  getAllRessources(page :number,type: any): Observable<Reponse>
   {
    var url_searchC="ressources?page="+page
    if(!!type && type != null)
    {
      url_searchC = url_searchC+"&type="+type
    }

    return this.http.get<Reponse>(`${this._url}${url_searchC}`)
       .pipe(
        retry(2),
        catchError(this.handleError)
      );
    }
  
    getUnavailabilityByRessourcesByID(ID:any): Observable<ReponseDto>
    {
     var url_searchC="unavailabilities/ressource/"+ID    
     return this.http.get<ReponseDto>(`${this._url}${url_searchC}`)
        .pipe(
         retry(2),
         catchError(this.handleError)
       );
     }
     getUnavailabilityByID(ID:any): Observable<Reponse>
     {
      var url_searchC="unavailabilities/"+ID    
      return this.http.get<Reponse>(`${this._url}${url_searchC}`)
         .pipe(
          retry(2),
          catchError(this.handleError)
        );
      }
}
