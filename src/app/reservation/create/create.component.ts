import { Component } from '@angular/core';
import { CalendarComponent } from '../../calendar/calendar.component';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
    standalone: true,
    imports: [CalendarComponent]
})
export class CreateComponent {

}
