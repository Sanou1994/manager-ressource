import { Component, ViewChild, AfterViewInit, OnInit, ViewContainerRef, OnDestroy } from "@angular/core";
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent, DayPilotNavigatorComponent, DayPilotModule } from "@daypilot/daypilot-lite-angular";
import { PlanningService } from "../services/planning/planning.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalService } from "../services/modal/modal.service";
import { Subscription } from "rxjs";
import 'src/app/models/planning'
import { environment } from "src/environments/environment";
import { RessourceService } from "../services/ressource/ressource.service";
import { CommonModule, DatePipe, NgClass, NgIf } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
declare var $: any
@Component({
  selector: 'calendar-component',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass, DayPilotModule, NgIf]
})
export class CalendarComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  sub!: Subscription;
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;
  update: boolean = false
  ressourceID: any
  planning: planning = {
    startDate: undefined,
    endDate: undefined,
    ressourceId: undefined,
    target: undefined,
    createdOn: undefined,
    updatedOn: undefined,
    mount: 0,
    registerId: localStorage.getItem("id")

  }
  ressource: ressource = {
    id: undefined,
    category: undefined,
    description: '',
    count: 0,
    currentCount: 0,
    demandCount: 0,
    mount: 0,
    status: false,
    temporaly: false,
    programmable: false,
    definitely: false,
    createdOn: undefined,
    updatedOn: undefined,
    hidden: false,
    countPlannings: 0
  }
  addRessource !: FormGroup
  submitted: boolean = false;
  disableButton: boolean = false;
  reservationByDay: boolean = true
  reservationByHours: boolean = true
  times: string[] = [
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30"
  ];

  showTimeState: boolean = false;
  startTimes: string[] = [];
  endTimes: string[] = [];
  loading: boolean = false;

  messageExist: String = ""

  end: any
  start: any
  events: any[] = [];
  roleUser: any
  userID: any
  date = DayPilot.Date.today();

  contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Supprimer",
        onClick: args => {
          const event = args.source;
          console.log(event.data)
          console.log(event.data.id)

          this.ds.delete(event.data.id, "plannings/delete").subscribe(result => {
            console.log(result)

            if (result['code'] == 200) {
              this.loadEvents()

            }
            else {
              var color = "danger"
              this.sub = this.modalService
                .openModal(this.entry, result['message'], color, true)
                .subscribe((v: any) => {
                  if (v == true) {

                    this.modalService.showMessage(result['message'], false)


                  }
                });
            }

          })


        }
      }
    ]
  });

  configNavigator: DayPilot.NavigatorConfig = {
    locale: "fr-fr",
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
    durationBarVisible: true,
    locale: "fr-fr",
    viewType: "Day",
    contextMenu: (!!localStorage.getItem('role') && localStorage.getItem('role') == environment.ROLE_ADMINISTATEUR) ? this.contextMenu : undefined,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configWeek: DayPilot.CalendarConfig = {
    locale: "fr-fr",
    viewType: "Week",
    durationBarVisible: true,
    contextMenu: (!!localStorage.getItem('role') && localStorage.getItem('role') == environment.ROLE_ADMINISTATEUR) ? this.contextMenu : undefined,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configMonth: DayPilot.MonthConfig = {
    contextMenu: (!!localStorage.getItem('role') && localStorage.getItem('role') == environment.ROLE_ADMINISTATEUR) ? this.contextMenu : undefined,
    locale: "fr-fr",
    eventBarVisible: true,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  constructor(private ds: PlanningService, private ressourceService: RessourceService,
    private formBuilder: FormBuilder, private route: ActivatedRoute, private modalService: ModalService, private router: Router) {

  }
  ngOnInit(): void {
    this.ressourceID = this.route.snapshot.paramMap.get("id")
    this.userID = localStorage.getItem('id')
    this.roleUser = localStorage.getItem('role')
    this.addRessource = this.formBuilder.group({
      id: [],
      endDate: ["", Validators.required],
      startDate: ["", Validators.required],
      endTime: [""],
      startTime: [""],
      target: ['', Validators.required],
      ressourceId: [this.ressourceID],
      mount: []
    });

  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.events = []

    this.ds.getEvents(this.ressourceID).subscribe(result => {
      if (result['code'] == 200) {
        const pailots = result['data'] as planning[]

        pailots.forEach(t => {
          const pailot = {
            id: t.id,
            text: t.target,
            disabled: (((!!this.roleUser && this.roleUser == environment.ROLE_UTILISATEUR && this.userID == t.registerId) || (!!this.roleUser && this.roleUser == environment.ROLE_ADMINISTATEUR)) ? false : true),
            start: new DayPilot.Date(t.startDate),
            mount: t.mount,
            end: new DayPilot.Date(t.endDate),
            ressourceID: this.ressourceID,
            backColor: PlanningService.colors.red,
          }

          this.events.push(pailot)
        })


      }
      else {
        var color = "danger"
        this.sub = this.modalService
          .openModal(this.entry, result['message'], color, true)
          .subscribe((v: any) => {
            if (v == true) {

              this.modalService.showMessage(result['message'], false)


            }
          });

      }
    });

    if (!!this.ressourceID) {
      this.ressourceService.getByID(this.ressourceID, 'ressources').subscribe(d => {
        if (d['code'] == 200) {

          this.ressource = d['data'] as ressource
          if (this.ressource.temporaly && this.ressource.paidByHours) {
            this.reservationByHours = false
            this.reservationByDay = true
            this.viewWeek();

          }
          else {
            this.reservationByHours = true
            this.reservationByDay = false
            this.viewMonth();

          }


        }
        else {
          this.router.navigate(['/auth/login'])
        }

      })

    }




  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  onBeforeEventRender(args: any) {
    const dp = args.control;

  }



  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }


  updateOneField(event: any, field: any) {

    const dateEnd = event.data.end as Date
    const dateStart = event.data.start as Date
    this.planning.endDate = dateEnd.getTime()
    this.planning.startDate = dateStart.getTime()
    this.planning.ressourceId = event.data.ressourceID
    this.planning.id = event.data.id
    this.planning.target = (!!field) ? field : event.data.text
    this.planning.mount = event.data.mount


    this.ds.update(this.planning, "plannings/update").subscribe(result => {

      if (result['code'] == 200) {
        this.loadEvents()

      }
      else {
        var color = "danger"
        this.sub = this.modalService
          .openModal(this.entry, result['message'], color, true)
          .subscribe((v: any) => {
            if (v == true) {

              this.modalService.showMessage(result['message'], false)


            }
          });
      }

    })
  }



  // MODAL TREATMENT

  get f() { return this.addRessource.controls; }


  validateTextRequired(event: any) {
    const dateEnd = new Date(this.addRessource.value.endDate)
    dateEnd.setHours(Number(this.addRessource.value.endTime.split(":")[0]))
    dateEnd.setMinutes(Number(this.addRessource.value.endTime.split(":")[1]))
    const dateStart = new Date(this.addRessource.value.startDate)
    dateStart.setHours(Number(this.addRessource.value.startTime.split(":")[0]))
    dateStart.setMinutes(Number(this.addRessource.value.startTime.split(":")[1]))

    if (dateStart.getTime() == dateEnd.getTime()) {
      this.messageExist = 'les deux plages horaires doivent etre différentes'
      this.disableButton = true

    }
    else if (dateStart.getTime() > dateEnd.getTime()) {
      this.messageExist = 'la  plage de début  doivent etre inférieure à la plage de fin'
      this.disableButton = true
    }
    else {
      const plans = this.events.filter(res => {
        const testResult = this.intercept(new Date(res.start.value).getTime(), new Date(res.end.value).getTime(), dateStart.getTime(), dateEnd.getTime())
        return testResult;
      });
      const samePlanning = plans.filter(res =>
      (new Date(res.end.value).getTime() == this.planning.endDate
        && new Date(res.start.value).getTime() == this.planning.startDate
        && res.id == this.planning.id && this.planning.registerId == this.userID)).length

      this.messageExist = (((!!plans && plans.length > 1) || (!!plans && plans.length == 1 && samePlanning == 0))) ? "Cette horaire ou une partie est occupée" : "";
      this.disableButton = (((!!plans && plans.length > 1) || (!!plans && plans.length == 1 && samePlanning == 0))) ? true : false


    }




  }
  openModal() {
    this.submitted = true
    if (this.addRessource.valid) {
      const dateEnd = new Date(this.addRessource.value.endDate)
      dateEnd.setHours(Number(this.addRessource.value.endTime.split(":")[0]))
      dateEnd.setMinutes(Number(this.addRessource.value.endTime.split(":")[1]))
      const dateStart = new Date(this.addRessource.value.startDate)
      dateStart.setHours(Number(this.addRessource.value.startTime.split(":")[0]))
      dateStart.setMinutes(Number(this.addRessource.value.startTime.split(":")[1]))

      if (dateStart.getTime() == dateEnd.getTime()) {
        this.messageExist = 'les deux plages horaires doivent etre différentes'
        this.disableButton = true

      }
      else if (dateStart.getTime() > dateEnd.getTime()) {
        this.messageExist = 'la  plage de début  doivent etre inférieure à la plage de fin'
        this.disableButton = true
      }
      else {
        const plans = this.events.filter(res => {
          const testResult = this.intercept(new Date(res.start.value).getTime(), new Date(res.end.value).getTime(), dateStart.getTime(), dateEnd.getTime())
          return testResult;
        });


        const samePlanning = plans.filter(res =>
        (new Date(res.end.value).getTime() == this.planning.endDate
          && new Date(res.start.value).getTime() == this.planning.startDate
          && res.id == this.planning.id && this.planning.registerId == this.userID)).length

        if ((!!plans && plans.length > 1) || (!!plans && plans.length == 1 && samePlanning == 0)) {
          this.messageExist = "Cette horaire ou une partie est occupée";
          this.disableButton = true
        }
        else {

          this.planning.endDate = dateEnd.getTime()
          this.planning.startDate = dateStart.getTime()
          this.planning.target = this.addRessource.value.target
          this.planning.mount = this.addRessource.value.mount
          this.planning.ressourceId = this.ressourceID
          this.loading = true

          if (!!this.addRessource.value.id && this.addRessource.value.id != null) {

            this.planning.id = this.addRessource.value.id
            this.ds.update(this.planning, "plannings/update").subscribe(result => {

              if (result['code'] == 200) {
                this.loading = false
                this.submitted = false
                $("#exampleModal").modal('hide')
                this.addRessource.reset()
                this.loadEvents()

              }
              else {
                this.loading = false
                this.submitted = false
                this.messageExist = "L'enregistrement a échoué";

              }

            })

          }
          else {

            this.ds.create(this.planning, "plannings").subscribe(result => {
              if (result['code'] == 200) {
                this.loading = false
                this.submitted = false
                $("#exampleModal").modal('hide')
                this.addRessource.reset()
                this.loadEvents()

              }
              else {

                this.loading = false
                this.submitted = false
                this.messageExist = "L'enregistrement a échoué";

              }

            })
          }
        }






      }









    }



  }
  intercept(start1: number, end1: number, start2: number, end2: number) {
    return (Math.max(0, Math.min(end2, end1) - Math.max(start1, start2))) > 0
  }

  async onTimeRangeSelected(args: any) {
    this.planning = {
      startDate: 0,
      endDate: 0,
      ressourceId: undefined,
      target: null,
      createdOn: 0,
      updatedOn: 0,
      mount: 0,
      registerId: localStorage.getItem("id")

    }
    this.update = false
    this.start = new Date(args.start.value).getTime()
    this.end = new Date(args.end.value).getTime()
    var datePipe = new DatePipe('en-US');
    const endTime = datePipe.transform(this.end, 'HH:mm');
    const startTime = datePipe.transform(this.start, 'HH:mm');
    this.showTimeState = (this.ressource.temporaly && this.ressource.paidByHours) ? true : false
    const endDate = datePipe.transform(this.end, 'yyyy-MM-dd');
    const startDate = datePipe.transform(this.start, 'yyyy-MM-dd');
    this.addRessource.patchValue({
      endDate: endDate,
      startDate: startDate,
      endTime: endTime,
      startTime: startTime,
      ressourceId: this.ressourceID
    });
    $("#exampleModal").modal('show')
    const dp = args.control;
    dp.clearSelection();



  }


  async onEventClick(args: any) {

    if (!!args.e.data && !args.e.data.disabled) {

      this.update = true
      this.planning.endDate = new Date(args.e.data.end).getTime()
      this.planning.startDate = new Date(args.e.data.start).getTime()
      this.planning.target = args.e.data.text
      this.planning.mount = args.e.data.mount
      this.planning.id = args.e.data.id
      this.planning.ressourceId = args.e.data.ressourceID
      var datePipe = new DatePipe('en-US');
      const endTime = datePipe.transform(this.planning.endDate, 'HH:mm');
      const startTime = datePipe.transform(this.planning.startDate, 'HH:mm');
      this.showTimeState = (this.ressource.temporaly && this.ressource.paidByHours) ? true : false
      const endDate = datePipe.transform(this.planning.endDate, 'yyyy-MM-dd');
      const startDate = datePipe.transform(this.planning.startDate, 'yyyy-MM-dd')
      this.addRessource.patchValue({
        id: this.planning.id,
        endDate: endDate,
        startDate: startDate,
        endTime: endTime,
        startTime: startTime,
        target: this.planning.target,
        ressourceId: this.planning.ressourceId,
        mount: this.planning.mount
      });

      $("#exampleModal").modal('show')
      const dp = args.control;
      this.update = true
      dp.clearSelection();
    }





  }


  close() {
    this.messageExist = "";
    this.disableButton = false
    this.addRessource.reset()
    this.update = false
    this.submitted = false;
  }

}

