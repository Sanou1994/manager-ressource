import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {  NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
import 'src/app/models/type_ressource'
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  selector: 'app-typeressource',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf,RouterLink],
  templateUrl: './typeressource.component.html',
  styleUrls: ['./typeressource.component.css']
})
export class TyperessourceComponent {
  message:String=""
  addRessource !:FormGroup
  submitted:boolean=false;
  disableButton:boolean=false;
  typeRessourceID:any
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  constructor(private formBuilder:FormBuilder ,private modalService: ModalService ,
    private route:ActivatedRoute,
    private typeressourceService:TypeRessourceService) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    
  }

  ngOnInit(): void 
  {
    this.typeRessourceID=this.route.snapshot.paramMap.get("id")
        this.addRessource = this.formBuilder.group({
          id:[],
          type:['', Validators.required]
        });

        if(!!this.typeRessourceID)
        {
          this.typeressourceService.getTypeRessourcesByID(this.typeRessourceID).subscribe(g=>{
            if(g['code'] == 200)
            {
              const type_ress=g['data'] as type_ressource
              this.addRessource.patchValue({
                id:type_ress.id,
                type:type_ress.type
              });

            }

          })

        }

  }

 

 openModal() 
   {
    this.submitted=true
     if(this.addRessource.valid )
    {

      var body="voulez-vous enregister cette datégorie de ressource ?"
      var color="primary"      
        this.sub = this.modalService
        .openModal(this.entry, body, color)
        .subscribe((v:any) => 
        {
           if(v == true)
           {

            if(!!this.typeRessourceID)
            {
              this.typeressourceService.update(this.addRessource.value as type_ressource,'typeressources').subscribe(b=>
                {
                  if(b['code'] == 200)
                  {
                 this.modalService.showMessage(b['message'],true)
                  this.addRessource.reset()
                  this.submitted=false
                  }
                  else
                  {
                    this.modalService.showMessage(b['message'],false)
                  }
                 
                })



            }
            else
            {

              this.typeressourceService.create(this.addRessource.value as type_ressource,'typeressources').subscribe(b=>
                {
                  if(b['code'] == 200)
                  {
                 this.modalService.showMessage(b['message'],true)
                  this.addRessource.reset()
                  this.submitted=false
                  }
                  else
                  {
                    this.modalService.showMessage(b['message'],false)
                  }
                 
                })
    
            }




           }});
      
    } 


    
   }
   ngOnDestroy(): void {
     if (this.sub) this.sub.unsubscribe();
   }

   get f() { return this.addRessource.controls; }

}
