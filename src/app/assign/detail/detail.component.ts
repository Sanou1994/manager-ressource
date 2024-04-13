import { Component, Pipe } from '@angular/core';
import { forkJoin } from 'rxjs';
declare var $:any
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate, NgIf, NgFor, CommonModule } from '@angular/common';
import { PaginationCustomerComponent } from '../../pagination/pagination.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UnavailabilityService } from 'src/app/services/unavailability/unavailability.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';

@Component({
    selector: 'app-detail',
    imports: [NgIf, NgFor, RouterLink, PaginationCustomerComponent,CommonModule],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
    standalone: true
})
export class DetailComponent {
    formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
    fileName= 'Liste-des-demandes-'+this.formattedDt;
    unavailabilities:unavailabilityDto[]=[]
    typeRessources : type_ressource[]=[]
    ressourceDatas:ressource[]=[]
    RoleUser:any
    countTotal: any
    countGivenTotal:any
    mountTotal:any
    constructor(private route :ActivatedRoute,private ressourceService:RessourceService,private typeTessourceService:TypeRessourceService,private unavailabilityService:UnavailabilityService) { }
  
   
  
   ngOnInit() {
    this.RoleUser=localStorage.getItem("role")
    this.refreshConsultationList()
  
   }
  
    // REFRESH CONSULTATION LIST
    refreshConsultationList()
    {  
      const id=this.route.snapshot.paramMap.get("id")
      if(!!id)
      {
        const sources = [this.unavailabilityService.getUnavailabilityByRessourcesByID(id),
        this.typeTessourceService.getAllR(),this.ressourceService.getAll("ressources")]; 
    
        forkJoin(sources).subscribe(f=>
        {
               // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
             const consultationsApiResponse=(f[0].code == 200) ? f[0].data as unavailability[] : []; 
 
             this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []
             const rep= f[2] as  ReponseDto     
             this.ressourceDatas= (f[2]['code']==200) ? rep.data.data as ressource[] : []       
             this.unavailabilities=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : unavailability) =>
               {

                const ressource=this.ressourceDatas.filter(t=>t.id == k.ressourceID)
                const typeressource= (!!ressource && ressource.length !=0) ? this.typeRessources.filter(t=>t.id == ressource[0].category) : null;
                const consultationGot= k as unavailabilityDto
                switch(k.etat)
                {
                  case "TOTAL_RESTITUTION": {
                    consultationGot.etat= " Restitué" 
                    consultationGot.color=  "primary"   
                    consultationGot.close=  true 
                  } ;break;
                  case "PARTIEL_RESTITUTION": {
                    consultationGot.etat= " Restitué en partiel" 
                    consultationGot.color=  "info"   
                    consultationGot.close=  false 
    

                  } ;break;
                  default:{
                    consultationGot.etat=  " Non restitué "  
                    consultationGot.color= "danger"  
                    consultationGot.close= false
    
                  };
                }
                
                 consultationGot.type_of_ressource=(!!typeressource && typeressource !=null)? typeressource[0].type +"("+ressource[0].marque+")" : "-"
                 return consultationGot;  
               })  : []; 
  
               this.countTotal= this.unavailabilities.map(h=>h.count).reduce((partialSum, a) => Number(partialSum) +Number( a), 0);
               this.countGivenTotal= this.unavailabilities.map(h=>h.count_given).reduce((partialSum, a) => Number(partialSum) +Number( a), 0);
               this.mountTotal= this.unavailabilities.map(h=>h.mount).reduce((partialSum, a) => Number(partialSum) +Number( a), 0);

        })

      }
     
       
      }





      exportexcel(): void
      {
        /* pass here the table id */
        let element = document.getElementById('excel-table');
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
     
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     
        /* save to file */  
        XLSX.writeFile(wb, this.fileName+'.xlsx');
     
      }
       openPDF(): void {
        let DATA: any = document.getElementById('excel-table');
        html2canvas(DATA).then((canvas) => {
          let fileWidth = 208;
          let fileHeight = (canvas.height * fileWidth) / canvas.width;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('p', 'mm', 'a4');
          let position = 0;
          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
          PDF.save(this.fileName+'.pdf');
        });
      }
    
     
  }
