import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, map, throwError } from 'rxjs';
import {environment} from '../../../environments/environment';
import 'src/app/models/reponse';
import 'src/app/models/user';
import { Router } from '@angular/router';
import { CrudGenericService } from '../crud-generic/crud-generic.service';
@Injectable({
  providedIn: 'root'
})
export class AccountServiceService extends CrudGenericService<User>
{  

  _url:string=environment.url;
  constructor(private router : Router, http: HttpClient){ super(http,environment.url)} 

  login(p:any)
  {
    return this.http.post<any>(this._url+"login",p) .pipe(
      catchError(this.handleError)
    )
  }
  logout()
   {
    this.removeAllLocalStorage()
     this.router.navigate(['/login']);
  }
  updatePwd(p:any) {
    
    return this.http.post<any>(this._url+"modifierpwd/"+p.ID,p) .pipe(
      catchError(this.handleError)
    )
        
}
  public removeAllLocalStorage() {
    return Object.keys(localStorage)
        .reduce((obj, k) => {
              return { ...obj, [k]: localStorage.removeItem(k)}}, {});
  }

 public  initLocalStorage(token: any,role: any,id: any,email: any,lastname: any,firstname: any,phone: any)
  {
    localStorage.setItem("token",token)
    localStorage.setItem("role",role)
    localStorage.setItem("id",id)
    localStorage.setItem("email",email)
    localStorage.setItem("lastname",lastname)
    localStorage.setItem("firstname",firstname)
    localStorage.setItem("phone",phone)

  }

  lockAccount(p: any): Observable<any> {
    return this.http.get<any>(this._url + 'users/'+p)
       .pipe(
        retry(2),
        catchError(this.handleError)
      );
    }



    getAllUsers(page:number,size:number,active:boolean,role:string): Observable<ReponseDto> {
      return this.http.get<ReponseDto>(this._url+"users/all?size="+size+"&page="+page +"&active="+active+"&role="+role).pipe(
        retry(2)
      );
    }
    getUsers(size:number,page:number): Observable<ReponseDto> {
      return this.http.get<ReponseDto>(this._url+"users/getAll?size="+size+"&page="+page).pipe(
        retry(2)
      );
    }
    
    searchUser(entity: SearchUser): Observable<ReponseDto> {
      return this.http.post<ReponseDto>(this._url+"users/search?page="+entity.page+"&size="+entity.size,JSON.stringify(entity)).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
    }
    changeUserStatusByID(id:any): Observable<Reponse> {
      return this.http.get<Reponse>(this._url+"users/"+id).pipe(
        retry(2)
      );
    }
    changePwd(entity: any): Observable<Reponse> {
      return this.http.post<Reponse>(this._url+"users/modifierpwd/"+entity.id,JSON.stringify(entity)).pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
    }
}