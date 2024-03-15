import { Component } from '@angular/core';
import { forkJoin, takeLast } from 'rxjs';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
declare var $:any
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, NgFor, NgIf, RouterLink]
})
export class ListComponent {
  ressources:ressource[]=[]
  ressourceTypes:ressource[]=[]
  ressourceDatas:ressource[]=[]
  typeRessources : type_ressource[]=[]
  deleteID:any
  loading:boolean=false
  rMessage:string=""
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  constructor(private typeRessourceService:TypeRessourceService,private ressourceService:RessourceService) { } 

 ngOnInit()
{

  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {      
   
      const sources = [this.ressourceService.getAll("ressources"),this.typeRessourceService.getAllR()];   
      forkJoin(sources).subscribe(f=>
      {
        this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []
        const rep= f[0] as  ReponseDto
        if(rep.code == 200)
        {
          this.count=rep.data.totals
          const consultationsApiResponse=rep.data.data as ressource[] ;      
        
          this.ressources=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : ressource) =>
            {
             k.createdOn=k.createdOn*1000
             const type_res=this.typeRessources.filter(t=>t.id == k.category)
             const typeressource= (!!type_res && type_res.length !=0) ? type_res[0].type : null;  
             k.createdOn=k.createdOn*1000         
             const consultationGot= k as ressource
             consultationGot.definitely=(!k.temporaly && !k.programmable)? true :false
             consultationGot.category=(!!typeressource && typeressource !=null)? typeressource+" ("+k.marque+")" : "-"
             return consultationGot;
              return consultationGot; 
            })  : []; 
            this.ressourceTypes=this.ressources
            this.ressourceDatas=this.ressources

        }
             // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
          


         
      })
    }    
    onTagChanged(event: any): void
  {

  }
  onChooseType(event: any): void
  {
   
    if(event.target.value == 1)
    {
      this.ressourceDatas=this.ressources
    }
    else
    {
      
      this.ressourceDatas=this.ressources.filter(t=> t.id ==event.target.value )
    }
   
    
}

deleteModal(event:any)
{
this.deleteID=event
this.rMessage=''
$("#bd-modal-delete-lg").modal('show');
}
closeModal()
{
$("#bd-modal-delete-lg").modal('hide');
}

delete()
{
  this.loading=true

     if(!!this.deleteID)
    {

    
      this.ressourceService.deleteRessource(this.deleteID).subscribe(b=>
        {
          if(b['code'] == 200)
          {
            this.refreshConsultationList()
            this.loading=false
            this.rMessage='bDelete'
            setTimeout(function() { 
              $("#bd-modal-delete-lg").modal('hide')
          }, 1000);

          
          }
          else
          {
            this.loading=false
            this.rMessage='bError'
          }
         
        })
     
    } 


}}

