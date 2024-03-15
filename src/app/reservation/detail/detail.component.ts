import { Component } from '@angular/core';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DetailListComponent } from '../detail-list/detail-list.component';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
    standalone: true,
    imports: [DetailListComponent]
})
export class DetailComponent {
  ressourceID:any
  typeRessources : type_ressource[]=[]

  ressource:ressource={
    id: undefined,
    category: undefined,
    description: '',
    count: 0,
    currentCount: 0,
    demandCount: 0,
    status: false,
    temporaly: false,
    programmable: false,
    createdOn: undefined,
    updatedOn: undefined,
    mount: 0,
    definitely: false
  }
  constructor(private typeTessourceService:TypeRessourceService,private ressourceService:RessourceService,private route:ActivatedRoute) { }

 

 ngOnInit()
 {
  this.ressourceID=this.route.snapshot.paramMap.get("id")

 
  if(!!this.ressourceID)
    {
      const sources = [this.ressourceService.getByID(this.ressourceID,'ressources'),this.typeTessourceService.getAllR()]; 
  
      forkJoin(sources).subscribe(f=>
      {
        this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []

          if(f[0].code == 200)
          {
            this.ressource= f[0].data as ressource
            const typeressource= (!!this.ressource) ? this.typeRessources.filter(t=>t.id ==this.ressource.category) : null;
            this.ressource.category=(!!typeressource && typeressource !=null)? typeressource[0].type +"("+this.ressource.marque+")" : "-"

        
          }      

            
         
      })

    }

 }

  
}
