import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, retry, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CrudGenericService } from '../crud-generic/crud-generic.service';

@Injectable({
  providedIn: 'root'
})
export class TypeRessourceService extends CrudGenericService<type_ressource>
{
  _url:string=environment.url;
  constructor(private router : Router, http: HttpClient){ super(http,environment.url)} 

  getAllTypeRessources(page :number,size: number): Observable<Reponse>
   {
    var url_searchC="typeressources?page="+page+"&size="+size    
    return this.http.get<Reponse>(`${this._url}${url_searchC}`)
       .pipe(
        retry(2),
        catchError(this.handleError)
      );
    }

    getAllR(): Observable<Reponse>
    {
     var url_searchC="typeressources/all"    
     return this.http.get<Reponse>(`${this._url}${url_searchC}`)
        .pipe(
         retry(2),
         catchError(this.handleError)
       );
     }
    getTypeRessourcesByID(ID:any): Observable<Reponse>
   {
    var url_searchC="typeressources/"+ID    
    return this.http.get<Reponse>(`${this._url}${url_searchC}`)
       .pipe(
        retry(2),
        catchError(this.handleError)
      );
    }
  
}
