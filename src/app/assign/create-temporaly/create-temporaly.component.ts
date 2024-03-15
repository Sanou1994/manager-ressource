import { Component, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UnavailabilityService } from 'src/app/services/unavailability/unavailability.service';
import 'src/app/models/unavailability'
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-create-temporaly',
    templateUrl: './create-temporaly.component.html',
    styleUrls: ['./create-temporaly.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, NgClass, NgIf]
})
export class CreateTemporalyComponent {
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
      definitely: false
    }
    @ViewChild('modal', { read: ViewContainerRef })
    entry!: ViewContainerRef;
    sub!: Subscription;
  
    constructor(private router: Router,private formBuilder:FormBuilder ,private modalService: ModalService ,private unavailabilityService:UnavailabilityService,private ressourceService:RessourceService,
      private route :ActivatedRoute) { }
    ngOnChanges(changes: SimpleChanges): void
    {
      
    }
    oncheckCount(event:any)
    {
      this.disableButton=false
      this.counted=false
        const id=this.route.snapshot.paramMap.get("id")
        if(!!id)
        {
          const countChoose= this.addRessource.value.count 
          const ressource= this.ressources.filter(q=> q.id == id)[0];
          if(countChoose > ressource.currentCount)
          {
            this.disableButton=true
            this.counted=true
           
          }
        }
        else{
        this.router.navigate(["/auth/login"])
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
            count:['', Validators.required],
            date_taken:['', Validators.required],
            date_given:['', Validators.required],
            taker_fullname:[localStorage.getItem("lastname") + " "+localStorage.getItem("firstname")],
            takerIdentificant:[localStorage.getItem("id")],
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

        var body="voulez-vous faire  cette demande ?"
        var color="primary"   
      
          this.sub = this.modalService
          .openModal(this.entry, body, color)
          .subscribe((v:any) => 
          {
             if(v == true)
             {

               this.unavailabilityService.create(this.addRessource.value as unavailability,'unavailabilities').subscribe(b=>
               {
                 if(b['code'] == 200)
                 {
                  this.modalService.closeModal()
                  this.router.navigate(['/assign/detail',this.route.snapshot.paramMap.get("id")])
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

          const sources = [this.ressourceService.getAll('ressources/sample')]; 
  
          forkJoin(sources).subscribe(f=>
          {
                 // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
               const consultationsApiResponse=(f[0].code == 200) ? f[0].data as ressource[] : [];       
               this.ressources=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : ressource) =>
                 {
                  k.createdOn=k.createdOn*1000
                   const consultationGot= k as ressource
                   return consultationGot; 
                 })  : []; 
    
                 const ressource= this.ressources.filter(q=> q.id == id)[0];
                 this.count=ressource.currentCount
                 if(this.count ==0)
                 {
                  this.disableButton=true
                  this.addRessource.disable()
                 }
                 
                
          })
         

        }
        else{
         this.router.navigate(["/auth/login"])
        }
    }
  
}
