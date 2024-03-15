import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountServiceService } from 'src/app/services/account/account-service.service';
declare var $:any
@Component({
  selector: 'app-account-create-update',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgIf],
  templateUrl: './account-create-update.component.html',
  styleUrls: ['./account-create-update.component.css']
})
export class AccountCreateUpdateComponent implements OnInit,OnChanges
{
 
  @Input() user:User={
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
  @Input() create:boolean=false
  @Input() update:boolean=false
  @Input() detail:boolean=false
  @Output() reloadEvent = new EventEmitter<any>();
  privileges:string[]=[]
  addForm!:FormGroup
  loading = false;
  activeForm = true;
  submitted = false;
  error = '';
  rMessage: string ="";
  pwdColor = '';
  pwdState:boolean = false;
  pwdMessage: string ="";


  constructor(
    private router : Router,
    private accountService : AccountServiceService,
    private route : ActivatedRoute) { }
  ngOnChanges(changes: SimpleChanges): void {
    
    this.loadData()
  }
  
  checkPawword(event:any)
  {
    if(this.addForm.value.password != this.addForm.value.repassword)
    {
      this.pwdColor = 'danger';
      this.pwdMessage = 'Le mot de passe resaisi est incorrect'; 
      this.pwdState=true 
    } 
    else
    {
      this.pwdColor = 'success';
      this.pwdMessage = 'Le mot de passe resaisi est correct'; 
      this.pwdState=false 
    }   
  }

  closeModal()
  {
    if(this.create)
    {
      this.addForm.reset()

    }
    this.pwdColor = '';
      this.pwdMessage = ''; 
      this.pwdState=false 
      this.rMessage=""
      $("#bd-modal-lg").modal('hide');
      $("#bd-update-modal-lg").modal('hide');
      $("#bd-update-pwd-modal-lg").modal('hide');


  }
  closeModalUpdate()
  {
    this.pwdColor = '';
      this.pwdMessage = ''; 
      this.pwdState=false 
      this.rMessage=""
      $("#bd-modal-lg").modal('hide');
      $("#bd-update-modal-lg").modal('hide');
      $("#bd-update-pwd-modal-lg").modal('hide');



  }
 
  ngOnInit(): void
   {
    this.loadData()
  }
  // LOAD DATA
 loadData()
 { 
   this.addForm = new FormGroup({
    id: new FormControl(""),
    lastname: new FormControl(""),
    firstname:new FormControl(""),
    adress: new FormControl(""),
    email: new FormControl(""),
    password:new FormControl(""),
    phone: new FormControl(""),
    status: new FormControl(""),
    role: new FormControl(""),
    createdOn: new FormControl(""),
    updatedOn: new FormControl("")
 }); 



  this.submitted=false
        if(this.update && !!this.user.id)
        {
          this.addForm.patchValue({
            id: this.user.id,
            lastname: this.user.lastname,
            firstname:this.user.firstname,
            adress: this.user.adress,
            email: this.user.email,
            password:this.user.password,
            phone: this.user.phone,
            status: this.user.status,
            role:this.user.role,
            createdOn: this.user.createdOn,
            updatedOn: this.user.updatedOn
            }); 

        }       
     


  }

  



  openModal() 
  {
    this.submitted=true

    
   if(this.addForm.valid)
   {      
      if(this.update && !!this.user.id)
      {

        this.accountService.update(this.addForm.value,"users/update").subscribe(b=>
          {

           if(b['code'] == 200)
           {
            this.addForm.disable()
             this.rMessage="bUpdate"
             this.submitted=false
             this.error=""
             this.loadData()
             this.reloadEvent.emit(new Date().getTime())
             setTimeout(() =>
             {
               $("#bd-update-modal-lg").modal('hide');
               this.rMessage="" ;
             }, 1000);

             
           }
           else if(b['code'] == 202)
            {
              this.loading=false
              this.rMessage="bDuplicate"
              this.submitted=false
            }
           else
           {
             this.loading=false
             this.rMessage="bError"
             this.rMessage=""
           }            
           
          }) 
      }
      else{
        
        this.accountService.create(this.addForm.value,"users").subscribe(b=>
          {

            if(b['code'] == 200)
           {

             
             this.loading=false
             this.rMessage="bSave"
             this.submitted=false
             this.loadData()
             this.reloadEvent.emit(new Date().getTime())
              setTimeout(() =>
                  { 
                    this.addForm.reset()
                    this.loading=false
                    this.rMessage=""
                    this.submitted=false
                     $("#bd-modal-lg").modal('hide');
                    
                  }, 1000);
            }
            else if(b['code'] == 202)
            {
              this.loading=false
              this.rMessage="bDuplicate"
              this.submitted=false
            }
           
           else
           {
            this.loading=false
            this.rMessage="bError"
            this.submitted=false
           }           
           
          }) 
      }   

    }   
   
   else{
    this.loading=false
   }   
  }
 

 

  get f() { return this.addForm.controls; }


 


 


}

