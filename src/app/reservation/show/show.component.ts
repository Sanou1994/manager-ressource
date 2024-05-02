import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { forkJoin } from 'rxjs';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [NgFor,CommonModule, NgIf, RouterLink,ToastModule],
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent {
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
