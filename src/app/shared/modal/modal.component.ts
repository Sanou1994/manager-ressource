import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor() {}
  @Input() body: string = '';
  @Input() color: string = '';
  disableButton:boolean=false
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();
  message:string=""
  ngOnInit(): void {
  }

  closeMe() {
    this.closeMeEvent.emit(false);
  }
  confirm() {
    this.confirmEvent.emit(true);
  }

  closeModal(event:Boolean) {
    if(event)
    {
      this.closeMeEvent.emit(false);

    }
  }

  

  ngOnDestroy(): void {

  }

  
}