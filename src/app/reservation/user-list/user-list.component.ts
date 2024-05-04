import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, formatDate } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PaginationCustomerComponent } from 'src/app/pagination/pagination.component';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
declare var $:any
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,NgIf, NgFor, RouterLink, PaginationCustomerComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
  fileName= 'Liste-des-reservations-'+this.formattedDt;
  plannings : planning[]=[]
  mount:number=0
  constructor(private ressourceService:RessourceService, private typeRessourceService:TypeRessourceService) { }

 

 ngOnInit() {

  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {  
     const userID=localStorage.getItem('id');
      if(!!userID)
      {
        const sources = [this.ressourceService.reservationByUser(userID)]; 
    
        forkJoin(sources).subscribe(f=>
        {  
          if(f[0].code == 200)
            {
              this.plannings= f[0].data as planning[]  
               this.mount=this.plannings.map(v=>v.mount).reduce(function(a, b)
               {
                 return a + b 
               });
  
            } 
  
           
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
