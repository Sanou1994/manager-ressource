import { Injectable } from '@angular/core';
import { CrudGenericService } from '../crud-generic/crud-generic.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, retry } from 'rxjs';
import 'src/app/models/planning';
@Injectable({
  providedIn: 'root'
})
export class PlanningService extends CrudGenericService<planning>
{
  _url:string=environment.url;
  static colors = {
    green: "#edfdf6",
    yellow: "#fdf7ed",
    red: "#fceeee"
  };

 
  constructor(private router : Router, http: HttpClient){ super(http,environment.url)} 


  getEvents(ressourceID:any): Observable<Reponse> {
    const field="plannings/ressource";   
    return this.http.get<Reponse>(`${this.url}${field}/${ressourceID}`).pipe(
      retry(2),
      catchError(this.handleError) 
    );
  }
  checkDate(ressourceID:any,date:any): Observable<Reponse> {
    const field="plannings/checkdate?ressourceID="+ressourceID+"&date="+date;   
    return this.http.get<Reponse>(`${this.url}${field}`).pipe(
      retry(2),
      catchError(this.handleError) 
    );
  }



  getColors(): any[] {
      const colors = [
        {name: "Verte", id: PlanningService.colors.green},
        {name: "Jaune", id: PlanningService.colors.yellow},
        {name: "Rouge", id: PlanningService.colors.red}
        
      ];
      return colors;
  }
}
