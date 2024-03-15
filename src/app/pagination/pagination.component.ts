import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-pagination-customer',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
    standalone: true,
    imports: [NgFor,NgIf, NgClass]
})
export class PaginationCustomerComponent {
  
  @Input() totalList:number=0
  @Input() size:number=0
  @Output() pageA :number=1
  nbItemPagination:any[]=[]
  @Output() page = new EventEmitter<number>();


  
ngOnChanges(changes: SimpleChanges): void
 {
  this.nbItemPagination =[]
  let sizePagination=(this.size == 0) ? 20 : this.size
  const size =Math.ceil(this.totalList/ sizePagination)
 
    for (let i = 0; i < size; i++) {
      this.nbItemPagination.push(i+1);
      }
      this.pageA=1
     
}
  onChoose(check: number){
  this.pageA=check 
  this.page.emit(check);
    
  }

  next()
  {
    var size=this.pageA+1  
    if(this.nbItemPagination.length >= size )
    {
      this.pageA++
      this.page.emit(this.pageA);
      
    }
    
    
    
  }
  previous()
  {

    var size=this.pageA-1  
    if(size > 0 && this.nbItemPagination.length >= size )
    {
      this.pageA--
      this.page.emit(this.pageA);
      
    }
    
    
  }

  
}
