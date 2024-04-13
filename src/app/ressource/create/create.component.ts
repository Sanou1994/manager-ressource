import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/services/modal/modal.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $:any
@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule, NgClass, NgIf,RouterLink]
})
export class CreateComponent implements OnInit,OnChanges
{
  message:String=""
  addRessource !:FormGroup
  submitted:boolean=false;
  disableButton:boolean=false;
  typeRessources : type_ressource[]=[];
  @ViewChild('modal', { read: ViewContainerRef })entry!: ViewContainerRef;
  
  @ViewChild('temporaly') temporalyInput: ElementRef<HTMLInputElement> | undefined ;
  @ViewChild('programmable') programmableInput: ElementRef<HTMLInputElement>| undefined;
  @ViewChild('unprogrammableanduntemporaly') unprogrammableanduntemporalyInput:ElementRef<HTMLInputElement>| undefined;
  @ViewChild('paidByHours') paidByHoursInput:ElementRef<HTMLInputElement>| undefined
  @ViewChild('paidByDays') paidByDaysInput:ElementRef<HTMLInputElement>| undefined
  @ViewChild('paidByGroups') paidByGroupsInput:ElementRef<HTMLInputElement>| undefined
  @ViewChild('unpaid') unpaidInput:ElementRef<HTMLInputElement>| undefined

  sub!: Subscription;
  readCount:boolean=false
  count:any
  readByGroups:boolean =false ;
  readUnpaid:boolean =false ;

  countByGroups:number =0 ;
  mount:number =0  ;






  constructor(private toastr: ToastrService,private typeTessourceService:TypeRessourceService, private router:Router,
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
          unprogrammableanduntemporaly:[false],
          programmable:[false],
          paidByHours:[false],
          paidByDays:[false],
          paidByGroups:[false],
          countByGroups:[0],
          unpaid:[true],
          mount:[0]

        });
       
  } 

  oncheckable(event:any)
  {

    switch(event)
    {
      case "programmable" :{
        this.readCount=true        
        this.count=1
        this.readByGroups=false
        this.readUnpaid=true

        

      } ;break;
      case "unprogrammableanduntemporaly" :{
        
        this.readCount=false
        this.count=null
        this.readUnpaid=false
        this.countByGroups=0
        this.mount=0


      } ;break;
      case "temporaly":{
       
        this.readCount=false
        this.count=null
        this.readByGroups=true
        this.readUnpaid=true

       
      } ;break;
      default:{
        
        this.readCount=false
        this.count=null
        this.readByGroups=false
        this.readUnpaid=false
        this.countByGroups=0
        this.mount=0
        }

    }
    
      
  } 

  oncheckablePaid()
  {


    this.readUnpaid=(!!this.unpaidInput && this.unpaidInput.nativeElement.checked) ? false :true
        this.mount=(!!this.unpaidInput && this.unpaidInput.nativeElement.checked)? 0 :this.mount

   this.readByGroups=(!!this.paidByGroupsInput && this.paidByGroupsInput.nativeElement.checked && 
        (!!this.temporalyInput && this.temporalyInput.nativeElement.checked || !!this.unprogrammableanduntemporalyInput && this.unprogrammableanduntemporalyInput.nativeElement.checked )) ? true :false
    
  this.countByGroups=(this.readByGroups) ? this.countByGroups : 0

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

          
            this.addRessource.value.paidByHours=(!!this.paidByHoursInput && this.paidByHoursInput?.nativeElement.checked) ? true :false
            this.addRessource.value.paidByDays=(!!this.paidByDaysInput && this.paidByDaysInput?.nativeElement.checked) ? true :false
            this.addRessource.value.paidByGroups=(!!this.paidByGroupsInput && this.paidByGroupsInput?.nativeElement.checked) ? true :false
            this.addRessource.value.unpaid=(!!this.unpaidInput && this.unpaidInput?.nativeElement.checked) ? true :false
            this.addRessource.value.programmable=(!!this.programmableInput && this.programmableInput?.nativeElement.checked) ? true :false
            this.addRessource.value.unprogrammableanduntemporaly=(!!this.unprogrammableanduntemporalyInput && this.unprogrammableanduntemporalyInput?.nativeElement.checked) ? true :false
            this.addRessource.value.temporaly=((!!this.programmableInput && this.programmableInput?.nativeElement.checked)) ? true : (!!this.temporalyInput && this.temporalyInput?.nativeElement.checked)



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
