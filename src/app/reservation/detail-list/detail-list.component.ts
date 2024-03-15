import { Component, Input } from '@angular/core';
declare var $:any
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate, NgIf, NgFor, DatePipe } from '@angular/common';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationCustomerComponent } from '../../pagination/pagination.component';
@Component({
    selector: 'app-detail-list',
    templateUrl: './detail-list.component.html',
    styleUrls: ['./detail-list.component.css'],
    standalone: true,
    imports: [NgIf, NgFor, PaginationCustomerComponent, DatePipe,RouterLink]
})
export class DetailListComponent {
  formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
  plannings:planning[]=[]
  fileName:any
  mount:number=0
  ressourceID:any
  @Input() type:any
  constructor(private ressourceService:RessourceService,private route:ActivatedRoute) { }

 

 ngOnInit()
 {
 this.ressourceID=this.route.snapshot.paramMap.get("id")
 this.fileName='Liste-des-reservations-termines'+this.formattedDt 

  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {  
     
    if(!!this.ressourceID)
    {
      const sources = [this.ressourceService.getByID(this.ressourceID,'ressources')]; 
  
      forkJoin(sources).subscribe(f=>
      {

          if(f[0].code == 200)
          {
             const res= f[0].data as ressource

             this.plannings=res.plannings as planning[]
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
