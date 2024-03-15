import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
declare var $:any
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate, NgIf, NgFor } from '@angular/common';
import { PaginationCustomerComponent } from '../../pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, RouterLink, PaginationCustomerComponent]
})
export class ListComponent {
  formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
  fileName= 'Liste-des-reservations-'+this.formattedDt;
  ressources:ressource[]=[]
  typeRessources : type_ressource[]=[]

  mount:number=0
  constructor(private ressourceService:RessourceService, private typeRessourceService:TypeRessourceService) { }

 

 ngOnInit() {

  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {  
     
   
      const sources = [this.ressourceService.getAll('ressources/reservations'),
      this.typeRessourceService.getAllR()
    ]; 
  
      forkJoin(sources).subscribe(f=>
      {
        this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []

             // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
           const consultationsApiResponse=(f[0].code == 200) ? f[0].data as ressource[] : [];       
           this.ressources=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : ressource) =>
             {

              const type_res=this.typeRessources.filter(t=>t.id == k.category)
              const typeressource= (!!type_res && type_res.length !=0) ? type_res[0].type : null;  
              k.createdOn=k.createdOn*1000         
              const consultationGot= k as ressource
              consultationGot.definitely=(!k.temporaly && !k.programmable)? true :false
              consultationGot.category=(!!typeressource && typeressource !=null)? typeressource+" ("+k.marque+")" : "-"
              return consultationGot; 
             })  : []; 

             this.mount=this.ressources.map(v=>v.mount).reduce(function(a, b)
             {
               return a + b 
             });
             

         
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
