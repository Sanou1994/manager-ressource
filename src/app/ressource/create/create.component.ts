import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule, NgClass, NgIf]
})
export class CreateComponent implements OnInit,OnChanges
{
  message:String=""
  addRessource !:FormGroup
  submitted:boolean=false;
  disableButton:boolean=false;
  typeRessources : type_ressource[]=[]
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  constructor(private typeTessourceService:TypeRessourceService, private router:Router,
    private formBuilder:FormBuilder ,private modalService: ModalService ,private ressourceService:RessourceService) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    
  }

  ngOnInit(): void 
  {
   this.typeTessourceService.getAllR().subscribe(
    r=>{this.typeRessources= (r['code']==200) ? r['data'] as type_ressource[] : []}
   )

        this.addRessource = this.formBuilder.group({
          category:['', Validators.required],
          marque:['', Validators.required],
          description:[''],
          count:[, Validators.required],
          temporaly:[false],
          programmable:[false]
        });
       
  }

  oncheckable(event:any)
  {
    if(this.addRessource.value.programmable && !this.addRessource.value.temporaly)
      {
         this.message="Pour que la ressource soit reservable , sa demande doit être temporaire !"
         this.disableButton=true
      }
      else 
      {
        this.message=""
        this.disableButton=false

      }
  }

 openModal() 
   {
    this.submitted=true
     if(this.addRessource.valid )
    {

      var body="voulez-vous enregister cette ressource ?"
      var color="primary"  

      if(!this.addRessource.value.programmable ||  this.addRessource.value.temporaly)
      {
        this.sub = this.modalService
        .openModal(this.entry, body, color)
        .subscribe((v:any) => 
        {
           if(v == true)
           {
             this.ressourceService.create(this.addRessource.value as ressource,'ressources').subscribe(b=>
             {
               if(b['code'] == 200)
               {
               this.modalService.closeModal()
               this.router.navigate(['/ressource/list'])
               this.addRessource.reset()
               this.submitted=false
               }
               else
               {
                 this.modalService.showMessage(b['message'],false)
               }
              
             })
 
           }});
      }
    } 


    
   }
   ngOnDestroy(): void {
     if (this.sub) this.sub.unsubscribe();
   }

   get f() { return this.addRessource.controls; }

}