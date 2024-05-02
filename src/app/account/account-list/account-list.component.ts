import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { PaginationCustomerComponent } from 'src/app/pagination/pagination.component';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { AccountCreateUpdateComponent } from '../account-create-update/account-create-update.component';
import { AccountServiceService } from 'src/app/services/account/account-service.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { AccountUpdatePwdComponent } from '../account-update-pwd/account-update-pwd.component';
declare var $:any
@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.css'],
    standalone: true,
    imports: [
      NgIf,
      NgFor,
      RouterLink,
      PaginationCustomerComponent,
      AccountCreateUpdateComponent,
      AccountUpdatePwdComponent,
      LoaderComponent,
      ReactiveFormsModule,
      FormsModule,
      DatePipe,
  ]
})
export class AccountListComponent implements OnInit, OnChanges ,OnDestroy {
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;
  // USER VARIBALES
  countUser:number=0
  users:UserDto[]=[]
 user:User={
   id: undefined,
   lastname: '',
   firstname: '',
   adress: '',
   email: '',
   password: '',
   phone: '',
   status: false,
   role: '',
   createdOn: undefined,
   updatedOn: undefined
 }


//SIZE PAGE
sizePage:number[]=[20,30,40,50,100]

@Input() searchData:any;
@Input() resetSearchData:any;

// VARIABLE 
pageSize:number=20
loading = false;
config:any={};
privileges:string[]=[]
 searchPrsnlRoleId: string="UTILISATEUR";
 searchPrsnlSize: number=20;
 searchPrsnlActive: boolean=true;

  constructor(private accountService: AccountServiceService, private modalService:ModalService) { }
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();;
  }
  pageChanged(event:any) {
    this.config.currentPage = event;
  }
 
  ngOnChanges(changes: SimpleChanges): void
   {
    if(!!this.resetSearchData)
    {
      this.pageSize=20
      this.reloadEvent()
      this.resetSearchData=undefined
      this.searchData=undefined
      
    }
    else
    {
      
      this.searchUserList(1,this.pageSize,this.searchData)
      this.resetSearchData=undefined
    }


  }

  chooseToUpdatePwd(userChoose:User)
  {
    this.user=userChoose
    $("#bd-update-pwd-modal-lg").modal('show');

  }
  chooseToUpdate(userChoose:User)
  {
    this.user=userChoose
    $("#bd-update-modal-lg").modal('show');

  }
  newUser()
  {
    $("#bd-modal-lg").modal('show');

  }

  ngOnInit(): void
   {
   
    this.refreshUserList(1,this.pageSize,true,"UTILISATEUR")
    
    
  }
  



 // REFRESH USER LIST
 refreshUserList(page:number,size:number,active:boolean,role:string)
 {   
  this.loading = true;
    const sources = [
      this.accountService.getAllUsers(page,size,active,role)
    ]; 
 
     forkJoin(sources).subscribe(f=>
     {

      this.countUser = f[0].data.totals 
      const userList=(f[0].code == 200)? f[0].data.data as User[] : []
      this.users=(userList.length != 0) ? userList.map((k : User) =>{  
        const userConvert= k as unknown as UserDto
        userConvert.lock=(k.status) ? 'danger' : 'success';
        userConvert.icon=(k.status) ? 'lock' : 'unlock';
        userConvert.lockLabel=(k.status) ? 'Désactivé' : 'Activé';
        userConvert.enabled=(k.status) ? 'Active' : 'Désactive'
        userConvert.color=(k.status) ? 'success' : 'danger'
        return userConvert;
        }) :[]
           
     })

  }
  getUsersWithPagination(event:any)
  {

    if(!!this.searchData)
    {
      this.searchUserList(event,this.pageSize,this.searchData)
    }
    else{
      this.refreshUserList(event,this.pageSize,this.searchPrsnlActive,this.searchPrsnlRoleId)

    }


  }

  searchUserList(page:number,size:number,searchData:any)
  {  
    
    if(!!searchData)
    {
      var userSearch =searchData as SearchUser
      userSearch.page=page;
      userSearch.size=size;
         const sources = [
           this.accountService.searchUser(userSearch)
         ]; 
      
          forkJoin(sources).subscribe(f=>
          {
     
            this.countUser = f[0].data.totals 
            const  usersApiResponse =(f[0].code == 200)? f[0].data.data as UserDto[] :[]
            this.users=(usersApiResponse.length != 0) ? usersApiResponse : []
              
          })
    }
 
   }

  reloadEvent()
  {

    this.refreshUserList(1,this.pageSize,true,"UTILISATEUR")
  }

  changeSize(event:any)
  {
    this.pageSize= (!!event) ? event : 20

    if(!!this.searchData)
    {
      this.searchUserList(1,this.pageSize,this.searchData)
    }
    else
    {
      this.refreshUserList(1,this.pageSize,true,"UTILISATEUR")

    }


  }


  changeEvent()
  {

    this.refreshUserList(1,this.pageSize,this.searchPrsnlActive,this.searchPrsnlRoleId)


  }

  openModal(id:any) 
  {
    if(!!id)
   {
     var body="voulez-vous changer l'état de ce/cette personnel(le)  ?"
     var color="success" 


    this.sub = this.modalService
      .openModal(this.entry, body, color)
      .subscribe((v:any) => 
      {
         if(v == true)
         {

            this.accountService.changeUserStatusByID(id).subscribe(b=>
              {
                if(b['code'] == 200)
                {
              //   this.modalService.hiddenButton("La mise à jour de l'état de ce/cette personnel(le) a  reussi ")
                 
                 setTimeout(() =>
                  { 
                     this.modalService.closeModal()
                     this.refreshUserList(1,this.pageSize,true,"UTILISATEUR")

                  }, 1000);
                  
                }
                else
                {
            //      this.modalService.hiddenButton("La mise à jour de l'état de ce/cette personnel(le) a échoué");
                  
                }  


                
              }) 

           
          

         }});

   } 


   
  }
}

