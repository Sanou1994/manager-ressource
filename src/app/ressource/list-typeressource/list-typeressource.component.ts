import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
@Component({
  selector: 'app-list-typeressource',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './list-typeressource.component.html',
  styleUrls: ['./list-typeressource.component.css']
})
export class ListTyperessourceComponent {
  ressources:type_ressource[]=[]
  ressourceDatas:type_ressource[]=[]

  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  constructor(private typeTessourceService:TypeRessourceService) { } 

 ngOnInit()
{

  this.refreshConsultationList(1,50)

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList(page :number,size: number)
  {      
   
      const sources = [this.typeTessourceService.getAllTypeRessources(page,size)];   
      forkJoin(sources).subscribe(f=>
      {
        const rep= f[0] as  ReponseDto
        if(rep.code == 200)
        {
          this.count=rep.data.totals
          const consultationsApiResponse=rep.data.data as type_ressource[] ;      
        
          this.ressources=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : type_ressource) =>
            {
             k.createdOn=k.createdOn*1000
              const consultationGot= k as type_ressource
              return consultationGot; 
            })  : []; 


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
 
}
