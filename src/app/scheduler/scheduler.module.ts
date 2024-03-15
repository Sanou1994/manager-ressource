import {DataService} from './data.service';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {SchedulerComponent} from './scheduler.component';
import {DayPilotModule} from 'daypilot-pro-angular';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        FormsModule,
        HttpClientModule,
        DayPilotModule,
        SchedulerComponent
    ],
    exports: [SchedulerComponent],
    providers: [DataService]
})
export class SchedulerModule { }
