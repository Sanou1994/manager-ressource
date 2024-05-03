import { Component, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { UnavailabilityService } from 'src/app/services/unavailability/unavailability.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';

@Component({
  selector: 'app-given-temporaly',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, NgClass, NgIf,RouterLink],
  templateUrl: './given-temporaly.component.html',
  styleUrls: ['./given-temporaly.component.css']
})
export class GivenTemporalyComponent {
  message:String=""
  addRessource !:FormGroup
  submitted:boolean=false;
  counted:boolean=false;
  count:any;
  disableButton:boolean=false;
  ressources:ressource[]=[]
  ressource:ressource={
    id: undefined,
    category: undefined,
    description: '',
    count: 0,
    currentCount: 0,
    demandCount: 0,
    mount: 0,
    status: false,
    temporaly: false,
    programmable: false,
    createdOn: undefined,
    updatedOn: undefined,
    definitely: false,
    hidden: false,
    countPlannings: 0
  }
  unavailability:unavailability={
    id: undefined,
    type_of_ressource: '',
    ressourceID: undefined,
    mount: 0,
    count:0,
    description: '',
    status: false,
    date_taken: undefined,
    date_given: undefined,
    takerIdentificant: '',
    taker_signature: '',
    createdOn: undefined,
    updatedOn: undefined
  }
  typeRessources : type_ressource[]=[]
  ressourceDatas:ressource[]=[]
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;

  constructor(private router: Router,private formBuilder:FormBuilder ,private modalService: ModalService ,
    private typeTessourceService:TypeRessourceService,
    private unavailabilityService:UnavailabilityService,private ressourceService:RessourceService,
    private route :ActivatedRoute) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    
  }
  oncheckCount(event:any)
  {
    this.disableButton=false
    this.counted=false
      if(event.target.value > this.unavailability.count)
      {        
          this.disableButton=true
          this.counted=true
         
        
      }else{
        this.disableButton=false
          this.counted=false

      }        

      
  }
  ngOnInit(): void 
  {
   
        this.addRessource = this.formBuilder.group({
          id:[],
          type_of_ressource:[''],
          ressourceID: [this.route.snapshot.paramMap.get("id")], 
          mount:[''],
          description:[''],
          isActive:[],
          date_restitution:['', Validators.required],
          count:['', Validators.required],
          date_taken:[''],
          date_given:[''],
          taker_fullname:[],
          taker_identificant:[],
          taker_signature:[]            
       });
       this.refreshConsultationList()
        
  }

  oncheckable(event:any)
  {
      const date_taken= new Date(this.addRessource.value.date_taken)  
      const date_given= new Date(this.addRessource.value.date_given)
    if(  date_given.getTime() < date_taken.getTime())
      {
         this.message="La date de fin doit etre supérieure à celle du début !"
         this.disableButton=true
      }
      else 
      {
        this.addRessource.value.date_taken=date_taken.getTime()
        this.addRessource.value.date_given=date_given.getTime()

        this.message=""
        this.disableButton=false

      }
  }

 openModal() 
   {

    this.submitted=true

     if(this.addRessource.valid )
    {

      var body="voulez-vous faire  cette restitution ?"
      var color="primary"   
    
        this.sub = this.modalService
        .openModal(this.entry, body, color)
        .subscribe((v:any) => 
        {
           if(v == true)
           {

            this.addRessource.value.date_restitution= new Date(this.addRessource.value.date_restitution).getTime()
             this.unavailabilityService.restitution(this.addRessource.value ).subscribe(b=>
             {
               if(b['code'] == 200)
               {
                this.router.navigate(['/assign/list'])
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
   ngOnDestroy(): void {
     if (this.sub) this.sub.unsubscribe();
   }

   get f() { return this.addRessource.controls; }

    // REFRESH CONSULTATION LIST
refreshConsultationList()
{  
 
    

    const id=this.route.snapshot.paramMap.get("id")
      if(!!id)
      {

        const sources = [this.unavailabilityService.getUnavailabilityByID(id),
          this.typeTessourceService.getAllR(),this.ressourceService.getAll("ressources")]; 
      
          forkJoin(sources).subscribe(f=>
          {
                 // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
               const consultationsApiResponse=(f[0].code == 200) ? f[0].data as unavailability : null;  
               this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []
               const rep= f[2] as  ReponseDto     
               this.ressourceDatas= (f[2]['code']==200) ? rep.data.data as ressource[] : []       
               this.unavailability=(consultationsApiResponse != null) ?  consultationsApiResponse as unavailability :this.unavailability
               const ressource=this.ressourceDatas.filter(t=>t.id == this.unavailability.ressourceID)
               const typeressource= (!!ressource && ressource.length !=0) ? this.typeRessources.filter(t=>t.id == ressource[0].category) : null;
               this.unavailability.type_of_ressource=(!!typeressource && typeressource !=null)? typeressource[0].type +"("+ressource[0].marque+")" : "-"
               var datePipe = new DatePipe('en-US');
               const date_taken =(this.unavailability.date_taken > 1)? datePipe.transform(new Date(this.unavailability.date_taken), 'yyyy-MM-ddThh:mm') :null;
               const date_given =(this.unavailability.date_given > 1)? datePipe.transform(new Date(this.unavailability.date_given), 'yyyy-MM-ddThh:mm') :null;
        
               this.addRessource.patchValue({
                id:this.unavailability.id,
                type_of_ressource:this.unavailability.type_of_ressource,
                ressourceID: this.unavailability.ressourceID, 
                mount:this.unavailability.mount,
                description:this.unavailability.description,
                count:this.unavailability.count,
                date_taken:date_taken,
                date_given:date_given,
                taker_fullname:this.unavailability.taker_fullname,
                takerIdentificant:this.unavailability.takerIdentificant,
                taker_signature:this.unavailability.taker_signature          
             });
                 
    
             
          })
       

      }
      else{
       this.router.navigate(["/auth/login"])
      }
  }

}

