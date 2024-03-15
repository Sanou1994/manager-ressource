import { Injectable } from '@angular/core';
import { CrudGenericService } from '../crud-generic/crud-generic.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import 'src/app/models/definitely'
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefinitelyService extends CrudGenericService<definitely>{

  constructor(private router : Router, http: HttpClient){ super(http,environment.url)} 
  _url:string=environment.url;

  getDefinitelyByRessourcesByID(ID:any): Observable<Reponse>
  {
   var url_searchC="definitely/ressource/"+ID    
   return this.http.get<Reponse>(`${this._url}${url_searchC}`)
      .pipe(
       retry(2),
       catchError(this.handleError)
     );
   }
}
