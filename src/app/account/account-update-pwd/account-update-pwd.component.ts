import { Component, EventEmitter, Input,  OnInit,  Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountServiceService } from 'src/app/services/account/account-service.service';
declare var $:any
@Component({
  selector: 'app-account-update-pwd',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgIf],
  templateUrl: './account-update-pwd.component.html',
  styleUrls: ['./account-update-pwd.component.css']
})
export class AccountUpdatePwdComponent implements OnInit{

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

@Output() reloadEvent = new EventEmitter<any>();
addForm!:FormGroup
loading = false;
submitted = false;
rMessage: string="";
pwdColor = '';
pwdMessage = '';
pwdState:boolean = false;


constructor(
  private accountService : AccountServiceService) { }
  ngOnInit(): void {
    this.addForm = new FormGroup({
      repassword: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    
  })
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





openModal() 
{
  this.loading=true
  this.submitted=true
 if(this.addForm.valid)
 { 
  let body={
  id:this.user.id,
  newPassword:this.addForm.value.password
  }
      this.accountService.changePwd(body).subscribe(b=>
        {

          if(b['code'] == 200)
         {

           
           this.loading=false
           this.rMessage="bSave"
           this.submitted=false
           this.reloadEvent.emit(new Date().getTime())
            setTimeout(() =>
                { 
                  this.addForm.reset()
                  this.loading=false
                  this.rMessage=""
                  this.submitted=false
                   $("#bd-update-pwd-modal-lg").modal('hide');
                  
                }, 1000);
         }
         
         else
         {
          this.loading=false
          this.rMessage="bError"
          this.submitted=false
         }           
         
        }) 
      

  }   
 
 else{
  this.loading=false
 }   
}




get f() { return this.addForm.controls; }


closeModal()
{
  $("#bd-update-pwd-modal-lg").modal('hide');

}





}
