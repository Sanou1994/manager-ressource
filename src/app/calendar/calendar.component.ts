import {Component, ViewChild, AfterViewInit, OnInit, ViewContainerRef, OnDestroy} from "@angular/core";
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent, DayPilotNavigatorComponent, DayPilotModule } from "@daypilot/daypilot-lite-angular";
import { PlanningService } from "../services/planning/planning.service";
import { ActivatedRoute } from "@angular/router";
import { ModalService } from "../services/modal/modal.service";
import { Subscription } from "rxjs";
import 'src/app/models/planning'
import { environment } from "src/environments/environment";
@Component({
    selector: 'calendar-component',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    standalone: true,
    imports: [DayPilotModule]
})
export class CalendarComponent implements AfterViewInit,OnInit,OnDestroy  {
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;
  ressourceID:any
  planning:planning={
    startDate: undefined,
    endDate: undefined,
    ressourceId: undefined,
    target: undefined,
    createdOn: undefined,
    updatedOn: undefined,
    mount: 0,
    registerId:localStorage.getItem("id")

  }

  events: any[] = [];
  roleUser:any
  userID:any
  date = DayPilot.Date.today();

  contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Supprimer",
        onClick: args => {          
          const event = args.source;
          this.ds.delete(event.cache.id,"plannings/delete").subscribe(result=>
            {
          
              if(result['code'] == 200)
              {
                this.loadEvents()
          
              }
              else
              {
                var color="danger"
                this.sub = this.modalService
                .openModal(this.entry, result['message'], color,true)
                .subscribe((v:any) => 
                {
                   if(v == true)
                   {
                    
                    this.modalService.showMessage(result['message'],false)
          
          
                   }});
              }
          
           })

              
        }
      },
      {
        text: "Modifier",
        onClick: async args => {
          const event = args.source;
          const dp = event.calendar;          
          const modal = await DayPilot.Modal.prompt("Modifier de tire de l'évèmenent", event.data.text);
          dp.clearSelection();
          if (!modal.result) { return; }
          event.data.text = modal.result;
          this.updateOneField(event,event.data.text)
        }
      }
    ]
  });

  configNavigator: DayPilot.NavigatorConfig = {
    locale:"fr-fr",
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    locale:"fr-fr",
    contextMenu:(!!localStorage.getItem('role') && localStorage.getItem('role') == environment.ROLE_ADMINISTATEUR ) ?  this.contextMenu : undefined,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configWeek: DayPilot.CalendarConfig = {
    locale:"fr-fr",
    viewType: "Week",
    durationBarVisible: false,
    contextMenu:(!!localStorage.getItem('role') && localStorage.getItem('role') == environment.ROLE_ADMINISTATEUR ) ?  this.contextMenu: undefined,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configMonth: DayPilot.MonthConfig = {
    contextMenu:(!!localStorage.getItem('role') && localStorage.getItem('role') == environment.ROLE_ADMINISTATEUR ) ?  this.contextMenu: undefined,
    locale:"fr-fr",
    eventBarVisible: false,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  constructor(private ds: PlanningService,private route:ActivatedRoute,private modalService: ModalService ) {
    this.viewWeek();
  }
  ngOnInit(): void {
    this.ressourceID=this.route.snapshot.paramMap.get("id")
    this.userID=localStorage.getItem('id')
    this.roleUser=localStorage.getItem('role')
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.events=[]

    this.ds.getEvents(this.ressourceID).subscribe(result =>
    {
      if(result['code'] == 200)
      {
        const pailots= result['data'] as planning[]

        pailots.forEach(t=>{
           const pailot={
            id:t.id,
            text: t.target,
            disabled:(((!!this.roleUser && this.roleUser == environment.ROLE_UTILISATEUR && this.userID == t.registerId) || (!!this.roleUser && this.roleUser == environment.ROLE_ADMINISTATEUR)) ? false : true ),
            start: new DayPilot.Date(t.startDate),
            mount:t.mount,
            end:  new DayPilot.Date(t.endDate),
            ressourceID:this.ressourceID,
            backColor: PlanningService.colors.red,
          }         
        this.events.push(pailot)
        })     


      }
      else
      {
        var color="danger"
        this.sub = this.modalService
        .openModal(this.entry, result['message'], color,true)
        .subscribe((v:any) => 
        {
           if(v == true)
           {
            
            this.modalService.showMessage(result['message'],false)

 
           }});

      }
    });
  }

  viewDay():void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek():void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth():void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  onBeforeEventRender(args: any) {
      const dp = args.control;
      
  }

  async onTimeRangeSelected(args: any) {
    const modal = await DayPilot.Modal.prompt("Créer un évènement :", "");
    const dp = args.control;
    dp.clearSelection();
    if (!modal.result) { return; }
    const dateEnd= args.end as Date
    const dateStart= args.start as Date
    this.planning.mount=0
    this.planning.endDate=dateEnd.getTime()
    this.planning.startDate=dateStart.getTime()
    this.planning.target=modal.result
    this.planning.ressourceId=this.ressourceID
    this.planning.registerId=localStorage.getItem("id")

    this.ds.create(this.planning,"plannings").subscribe(result=>
      {
        if(result['code'] == 200)
        {
          this.loadEvents()

        }
        else
        {
          var color="danger"
          this.sub = this.modalService
          .openModal(this.entry, result['message'], color,true)
          .subscribe((v:any) => 
          {
            if(v == true)
            {
              
              this.modalService.showMessage(result['message'],false)


            }});
        }

    })


  }

  async onEventClick(args: any) {
    const form = [
      {name: "Titre", id: "text"},
      {name: "Début", id: "start", dateFormat: "dd/MM/yyyy", type: "datetime"},
      {name: "Fin", id: "end", dateFormat: "dd/MM/yyyy", type: "datetime"},
      {name: "Montant", id: "mount",type:"number"},
      {name: "Index", id: "id",disabled:true},

    ];

    const data = args.e.data;
    const dp = args.control;
    dp.clearSelection();
     if(data.disabled ==  false)
    {

        const modal = await DayPilot.Modal.form(form, data);   

    if (modal.canceled) {
      return;
    }
    
    const dateEnd= modal.result.end as Date
    const dateStart= modal.result.start as Date
    this.planning.endDate=dateEnd.getTime()
    this.planning.startDate=dateStart.getTime()
    this.planning.target=modal.result.text
    this.planning.mount=modal.result.mount
     this.planning.id=modal.result.id
    this.planning.ressourceId=this.ressourceID 


    this.ds.update(this.planning,"plannings/update").subscribe(result=>
      {
    
        if(result['code'] == 200)
        {
          this.loadEvents()
    
        }
        else
        {
          var color="danger"
          this.sub = this.modalService
          .openModal(this.entry, result['message'], color,true)
          .subscribe((v:any) => 
          {
             if(v == true)
             {
              
              this.modalService.showMessage(result['message'],false)
    
    
             }});
        }
    
     }) 
    }
    

  }

  
  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }


  updateOneField(event:any,field:any)
  {

    const dateEnd= event.data.end as Date
    const dateStart= event.data.start as Date
    this.planning.endDate=dateEnd.getTime()
    this.planning.startDate=dateStart.getTime()
    this.planning.ressourceId=event.data.ressourceID
    this.planning.id=event.data.id
    this.planning.target=(!!field) ? field :event.data.text
    this.planning.mount=event.data.mount
   
    
    this.ds.update(this.planning,"plannings/update").subscribe(result=>
      {

        if(result['code'] == 200)
        {
          this.loadEvents()
    
        }
        else
        {
          var color="danger"
          this.sub = this.modalService
          .openModal(this.entry, result['message'], color,true)
          .subscribe((v:any) => 
          {
             if(v == true)
             {
              
              this.modalService.showMessage(result['message'],false)
    
    
             }});
        }
    
     }) 
  }
 

}

