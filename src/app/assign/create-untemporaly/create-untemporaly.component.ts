import { NgClass, NgIf } from '@angular/common';
import { Component, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { DefinitelyService } from 'src/app/services/definitely/definitely.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';

@Component({
    selector: 'app-create-untemporaly',
    templateUrl: './create-untemporaly.component.html',
    styleUrls: ['./create-untemporaly.component.css'],
    imports: [ReactiveFormsModule, NgClass, NgIf],
    standalone: true
})
export class CreateUntemporalyComponent {
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
    countByGroups:any;
    countByGroupsCheck:boolean=false;
    unpaidCheck:boolean=false;
    mount:number=0;
    @ViewChild('modal', { read: ViewContainerRef })
    entry!: ViewContainerRef;
    sub!: Subscription;
  
    constructor(private router: Router,private formBuilder:FormBuilder ,private modalService: ModalService ,private definitelyService:DefinitelyService,private ressourceService:RessourceService,
      private route :ActivatedRoute) { }
    ngOnChanges(changes: SimpleChanges): void
    {
      
    }
   

    oncheckCount(event:any)
    {
      this.disableButton=false
      this.counted=false
      this.countByGroupsCheck=false
        const id=this.route.snapshot.paramMap.get("id")
        if(!!id)
        {
          const countChoose= this.addRessource.value.count 
          const ressource= this.ressources.filter(q=> q.id == id)[0];
          const countByGroups=(!!ressource.countByGroups)?ressource.countByGroups : 0
          if(countChoose > ressource.currentCount)
          {
            this.disableButton=true
            this.counted=true
           
          }
          else if(countByGroups != 0 && (countChoose % countByGroups) !=0){
            this.disableButton=true
            this.countByGroupsCheck=true
            this.counted=false

          }
          else{
            this.mount=(countChoose/countByGroups)*ressource.mount
            this.disableButton=false
            this.countByGroupsCheck=false
            this.counted=false
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
            mount:[0],
            description:[''],
            isActive:[],
            count:[''],
            taker_fullname:[localStorage.getItem("lastname") + " "+localStorage.getItem("firstname")],
            takerIdentificant:[localStorage.getItem("id")],
            taker_signature:[]            
         });
         this.refreshConsultationList()
          
    }
  
 
  
   openModal() 
     {
      this.submitted=true
       if(this.addRessource.valid )
      {

        var body="Voulez-vous faire  cette demande ?"
        var color="primary"   
      
          this.sub = this.modalService
          .openModal(this.entry, body, color)
          .subscribe((v:any) => 
          {
             if(v == true)
             {

               this.definitelyService.create(this.addRessource.value,'definitely').subscribe(b=>
               {
                 if(b['code'] == 200)
                 {
                  this.modalService.closeModal()
                  this.router.navigate(['/assign/detail-definitely',this.route.snapshot.paramMap.get("id")])
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
                 this.unpaidCheck=(!!ressource.unpaid &&ressource.unpaid) ? true :false
                 this.countByGroups=ressource.countByGroups
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
