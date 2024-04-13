import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { NgFor, NgIf } from '@angular/common';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
import { ToastModule } from 'primeng/toast';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [NgFor, NgIf, RouterLink,ToastModule]
})
export class HomeComponent {
  ressources:ressource[]=[]
  typeRessources:type_ressource[]=[]
  ressourceDatas:ressource[]=[]
  constructor(private ressourceService:RessourceService,private typeTessourceService:TypeRessourceService) { }

 

 ngOnInit() {
  
  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {  
     
      const sources = [this.ressourceService.getAll('ressources/sample'),this.typeTessourceService.getAllR()]; 
  
      forkJoin(sources).subscribe(f=>
      {
             // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
             this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []
           const consultationsApiResponse=(f[0].code == 200) ? f[0].data as ressource[] : [];       
           this.ressources=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : ressource) =>
             {
              const cate=this.typeRessources.filter(t=>t.id == k.category)
              k.createdOn=k.createdOn*1000
               const consultationGot= k as ressource
               consultationGot.categoryID=k.category
               consultationGot.category=(!!cate && cate.length !=0)?cate[0].type:"-"
               return consultationGot; 
             })  : []; 
             this.ressourceDatas=this.ressources

         
      })
    }
    
    
    filter(search: string):number
     {
      if(!!search)
      {
          return this.ressources.filter(q=> q.category == search).length;
      
      }
      else
      {
        return 0
      }
}

onChooseType(event: any): void
  {
    
    if(event.target.value == 1)
    {
      this.refreshConsultationList()
    }
    else 
    {
      
     this.ressources=this.ressourceDatas.filter(t=> t.categoryID ==event.target.value )
    }
   
    
}
}
