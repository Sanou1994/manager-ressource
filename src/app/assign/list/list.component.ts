import { Component, Pipe } from '@angular/core';
import { forkJoin } from 'rxjs';
declare var $:any
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate, NgIf, NgFor, CommonModule } from '@angular/common';
import { PaginationCustomerComponent } from '../../pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { UnavailabilityService } from 'src/app/services/unavailability/unavailability.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
import { RessourceService } from 'src/app/services/ressource/ressource.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, RouterLink, PaginationCustomerComponent,CommonModule]
})
export class ListComponent {
  formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
  fileName= 'Liste-des-reservations-'+this.formattedDt;
  typeRessources : type_ressource[]=[]
  ressourceDatas:ressource[]=[]
  userRole:any
  constructor(private ressourceService:RessourceService,private typeTessourceService:TypeRessourceService,private unavailabilityService:UnavailabilityService) { }

 

 ngOnInit() {
  this.userRole=localStorage.getItem("role")
  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {  
     
   
      const sources = [this.typeTessourceService.getAllR(),this.ressourceService.getAll("ressources/user")]; 
  
      forkJoin(sources).subscribe(f=>
      {
             // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
           this.typeRessources= (f[0]['code']==200) ? f[0]['data'] as type_ressource[] : []
           const rep= f[1] as  ReponseDto     
         const  consultationsApiResponse= (f[1]['code']==200) ? rep.data.data as ressource[] : []                       
          this.ressourceDatas=(consultationsApiResponse.length != 0) ? consultationsApiResponse.filter(t=>!(t.temporaly && t.programmable)).map((k : ressource) =>
             {
              const type_res=this.typeRessources.filter(t=>t.id == k.category)
              const typeressource= (!!type_res && type_res.length !=0) ? type_res[0].type : null;           
              const consultationGot= k as ressource
              consultationGot.definitely=(!k.temporaly && !k.programmable)? true :false
              consultationGot.category=(!!typeressource && typeressource !=null)? typeressource+" ("+k.marque+")" : "-"
               return consultationGot; 
             })  : []; 

             

         
      })
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
