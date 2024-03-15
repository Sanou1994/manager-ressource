import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, formatDate } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { forkJoin } from 'rxjs';
import { PaginationCustomerComponent } from 'src/app/pagination/pagination.component';
import { RessourceService } from 'src/app/services/ressource/ressource.service';
import { TypeRessourceService } from 'src/app/services/type_ressource/type-ressource.service';
declare var $:any
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { DefinitelyService } from 'src/app/services/definitely/definitely.service';
@Component({
  selector: 'app-detail-untemporaly',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, PaginationCustomerComponent,CommonModule],
  templateUrl: './detail-untemporaly.component.html',
  styleUrls: ['./detail-untemporaly.component.css']
})
export class DetailUntemporalyComponent {
  formattedDt = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en_US');
  fileName= 'Liste-des-demandes-'+this.formattedDt;
  definitelies:definitelyDto[]=[]
  typeRessources : type_ressource[]=[]
  ressourceDatas:ressource[]=[]
  userRole:any
  constructor(private route :ActivatedRoute,private ressourceService:RessourceService,
    private typeTessourceService:TypeRessourceService,
    private definitelyService:DefinitelyService) { }

 

 ngOnInit() {
  this.userRole=localStorage.getItem("role")
  this.refreshConsultationList()

 }

  // REFRESH CONSULTATION LIST
  refreshConsultationList()
  {  
    const id=this.route.snapshot.paramMap.get("id")
    if(!!id)
    {
      const sources = [this.definitelyService.getDefinitelyByRessourcesByID(id),
      this.typeTessourceService.getAllR(),this.ressourceService.getAll("ressources")]; 
  
      forkJoin(sources).subscribe(f=>
      {
             // BABCKEND RESPONSE TO GIVE ALL PATIENTS  
           const consultationsApiResponse=(f[0].code == 200) ? f[0].data as definitely[] : []; 

           this.typeRessources= (f[1]['code']==200) ? f[1]['data'] as type_ressource[] : []
           const rep= f[2] as  ReponseDto     
           this.ressourceDatas= (f[2]['code']==200) ? rep.data.data as ressource[] : []       
           this.definitelies=(consultationsApiResponse.length != 0) ? consultationsApiResponse.map((k : definitely) =>
             {

              const ressource=this.ressourceDatas.filter(t=>t.id == k.ressourceID)
              const typeressource= (!!ressource && ressource.length !=0) ? this.typeRessources.filter(t=>t.id == ressource[0].category) : null;
              const consultationGot= k as definitelyDto
               return consultationGot;  
             })  : []; 


         
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

