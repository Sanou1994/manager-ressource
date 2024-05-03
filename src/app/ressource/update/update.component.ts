import { Component, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription, animationFrameScheduler } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
declare var $:any
@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.css'],
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule, NgClass, NgIf,RouterLink]
})
export class UpdateComponent {
  message:String=""
  addRessource :FormGroup=this.formBuilder.group({
    category:[],
    description:[],
    count:[],
    marque:[],
    temporaly:[false],
    programmable:[false]
  });
  ressource:ressource={
    id: undefined,
    category: undefined,
    description: '',
    count: 0,
    status: false,
    temporaly: false,
    programmable: false,
    createdOn: undefined,
    updatedOn: undefined,
    currentCount: 0,
    demandCount: 0,
    mount: 0,
    definitely: false,
    hidden: false,
    countPlannings: 0
  }
  typeRessources : type_ressource[]=[]
  disableButton:boolean=false;
  testCount:boolean=false;
  submitted:boolean=false;

  ressourceID:any
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  constructor(private typeTessourceService:TypeRessourceService,private router:Router,private formBuilder:FormBuilder ,private modalService: ModalService ,private ressourceService:RessourceService,private route:ActivatedRoute) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    
  }

  ngOnInit(): void 
  {
    this.typeTessourceService.getAllR().subscribe(
      r=>{
        this.typeRessources= (r['code']==200) ? r['data'] as type_ressource[] : []
      
      }
     )

       this.ressourceID=this.route.snapshot.paramMap.get('id');
    if(!!this.ressourceID)
    {

     this.ressourceService.getByID(this.ressourceID,'ressources').subscribe(d=>
      {
        if(d['code'] == 200)
        {
          
          this.ressource = d['data'] as ressource         
        

        }
        else{
          this.router.navigate(['/auth/login'])
        }

      })

      

    }
    else{
      this.router.navigate(['/auth/login'])
    }
   
    if(this.ressource.currentCount != this.ressource.count && this.ressource.demandCount !=0)
    {
      this.addRessource.get('temporaly')?.disable();
      this.addRessource.get('programmable')?.disable();
      this.message="impossible de changer l'état de soit reservable ou temporaire car au moins une demande/réservation a été déjà éffecruée pour cette ressource !"
    }
    
       
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
  oncheckableCount(event:any)
  {

      if(event.target.value < this.ressource.demandCount)
      {
        
         this.disableButton=true
         this.testCount=true
      }
      else
      {
        this.testCount=false
         this.disableButton=false
      }
      
  }
 openModal() 
   {
     if(this.addRessource.valid )
    {



      var body="voulez-vous modifier cette ressource ?"
      var color="success"  

      if(!this.addRessource.value.programmable ||  this.addRessource.value.temporaly)
      {
        this.sub = this.modalService
        .openModal(this.entry, body, color)
        .subscribe((v:any) => 
        {
           if(v == true)
           {
             this.ressourceService.update(this.ressource as ressource,'ressources/update').subscribe(b=>
             {
               if(b['code'] == 200)
               {
                this.modalService.closeModal()
                this.router.navigate(['/ressource/list'])
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
