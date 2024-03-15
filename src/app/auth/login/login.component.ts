import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountServiceService } from 'src/app/services/account/account-service.service';
import { environment } from 'src/environments/environment';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, NgClass, NgIf]
})
export class LoginComponent {
  messageError:String="";
  submitted:boolean = false;
 
   searchForm: FormGroup = this.fb.group({
    password: ['', Validators.required ],
    email: ['', Validators.required ]

 });
  
  
  constructor(private accountService : AccountServiceService,private fb: FormBuilder,private router:Router) { }
  ngOnInit(): void {
    this.accountService.removeAllLocalStorage()
  }


  onSubmit() 
  {

   
    if(!this.searchForm.invalid)
    {
      this.accountService.login(this.searchForm.value).subscribe(p=>
        {
         if(p['code'] == 200)
         {
          this.accountService.initLocalStorage(p['data'].token,p['data'].role,p['data'].id,p['data'].email,p['data'].lastname,p['data'].firstname,p['data'].phone)
          this.router.navigate(['/home/home'])
        }
         else
        {
          this.messageError=p['message'];         
  
        }
        })
    }
    else{
      this.messageError="Veuillez renseigner tous les champs svp";
    }   
   
  }
  get f() { return this.searchForm.controls; }

  
}
