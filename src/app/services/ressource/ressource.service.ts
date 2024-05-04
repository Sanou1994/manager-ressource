import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CrudGenericService } from '../crud-generic/crud-generic.service';
import 'src/app/models/ressource'
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RessourceService extends CrudGenericService<ressource>
{
  _url:string=environment.url;
  constructor(private router : Router, http: HttpClient){ super(http,environment.url)} 

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
    deleteRessource(ID: any): Observable<Reponse> {
      var url_searchC="ressources/delete"
      return this.http.get<Reponse>(`${this._url}${url_searchC}/${ID}`);
    }

    reservationByUser(ID: any): Observable<Reponse> {
      var url_searchC="ressources/reservations"
      return this.http.get<Reponse>(`${this._url}${url_searchC}/${ID}`);
    }
}
