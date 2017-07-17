import {Component, OnInit} from "@angular/core";
import {LoadingController, ViewController, NavParams,NavController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {AppProvider} from "../../../providers/app";
import {LogProvider} from "../../../providers/log";
import {AppointmentProvider} from "../../../providers/appointment";
import {LeadProvider} from "../../../providers/lead";
import {PrintComponent} from "../../../components/print/print";
import {Appointment, AppointmentBuilder} from "../../../models/appointment";
import {Lead, LeadSearch} from "../../../models/lead";
import {Observable} from "rxjs/Observable";
import * as moment from "moment";
import {CalendarPage} from "../calendar";
import {CordovaProvider} from "../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/calendar/appointment/appointment.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [AppointmentProvider, LeadProvider]
})
export class AppointmentPage implements OnInit {
    appointment: Appointment;
    leads: Lead[];
    leadIdd;
    leadFirst_Name;
    leadLast_Name;
    leadsshow;
    subject;

    constructor(private logProvider: LogProvider,
                private navParams: NavParams,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private appointmentProvider: AppointmentProvider,
                private leadProvider: LeadProvider,
                private viewCtrl: ViewController,
                private cordovaProvider: CordovaProvider) {
                this.leadIdd=this.navParams.get('leadid');
                this.leadFirst_Name=this.navParams.get('first_name');
                this.leadLast_Name=this.navParams.get('last_name');
        logProvider.class(this);
    }

     ngOnInit() {
        if(this.leadIdd!=undefined && this.leadLast_Name!=undefined && this.leadFirst_Name !=undefined){
           this.leadsshow=false;
           console.log(this.leadIdd)
           console.log(this.leadLast_Name)
           console.log(this.leadFirst_Name)
          let now = new Date();
          this.appointment = this.navParams.data.appointment ? this.navParams.data.appointment : new AppointmentBuilder().setStart(now.toISOString()).setEnd(moment(now).add(45, 'minutes').toISOString()).build();
          console.log('hello');
           this.appointment.leadId=this.leadIdd;
           let leadSearch: LeadSearch = {
            // limit: 300,
            fields: "id,name,surname",
            sort: 'name,surname'
        };
        this.leadProvider.readLeads(leadSearch)
            .subscribe(data =>
                    this.leads = data,
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
        
        }else{
        let now = new Date();
        this.appointment = this.navParams.data.appointment ? this.navParams.data.appointment : new AppointmentBuilder().setStart(now.toISOString()).setEnd(moment(now).add(45, 'minutes').toISOString()).build();
        let leadSearch: LeadSearch = {
            // limit: 300,
            fields: "id,name,surname",
            sort: '-created',
            // sort: 'name,surname',
            status:'-closed'
        };
        this.leadProvider.readLeads(leadSearch)
            .subscribe(data =>{
                    this.leads = data;
                    this.leadsshow=true;
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
        }
    }


    onStartChanged() {
        this.appointment.end = moment(this.appointment.start).add(45, 'minutes').toISOString();
    }

    toDateLessThanFromDate(fromDate: string, toDate: string): boolean {
        if (fromDate && toDate) {
            let fromTime = new Date(fromDate).getTime();
            let toTime = new Date(toDate).getTime();
            return fromTime > toTime;
        }
        return false;
    }

    onDismiss() {
        this.viewCtrl.dismiss();
    }

    onCreate() {
        if (this.appointment.start && this.appointment.end) {
            try {
                let start;
                let end;
                start =new Date(this.appointment.start).toISOString();
                end =new Date(this.appointment.end).toISOString();
                this.appointment.start = new Date(this.appointment.start).toISOString();
                this.appointment.end = new Date(this.appointment.end).toISOString();
                this.subject=this.appointment.subject;
                if(this.leadIdd!=undefined && this.leadLast_Name!=undefined && this.leadFirst_Name !=undefined){
                 // this.appointment.leadId=this.leadIdd;
                 this.appointment.subject='['+this.leadFirst_Name+' '+this.leadLast_Name+']'+' '+this.appointment.subject;
                }else if(!this.appointment.exchangeId){
                
                this.appointment.subject='['+this.appointment.leadId['surname']+' '+this.appointment.leadId['name']+']'+' '+this.appointment.subject; 
                this.appointment.leadId=this.appointment.leadId['id'];   
                }
                
                
                let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                Observable.fromPromise(loading.present())
                     .flatMap(() => this.cordovaProvider.checkMainApi())
                    .flatMap(data => this.appointment.exchangeId ? this.appointmentProvider.updateAppointment(this.appointment) : this.appointmentProvider.createAppointment(this.appointment))
                    .subscribe(data =>
                            loading.dismiss().then(() => {
                                // this.leads.filter(f => f.id === this.appointment.leadId).map(m => {
                                    // data.name = m.name;
                                    // data.surname = m.surname;
                                    data.subject=this.appointment.subject;
                                    data.start=start;
                                    data.end=end;
                                    data.location=this.appointment.location;
                                    data.leadId=this.appointment.leadId;
                                    data.exchangeId=data.exchangeId;
                                   this.cordovaProvider.trackEvent('appointment', 'Delete', 'appointment');
                                   var tittle=this.translateService.instant(this.appointment && this.appointment.id ? "action.edit" : "action.create")+''+this.translateService.instant('calendar.appointment')
                                   this.cordovaProvider.trackView(tittle);
                                // })
                                this.viewCtrl.dismiss(data);
                            }),
                        error =>
                            loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                    );
            } catch (e) {
                this.appProvider.createAlert(e).present();
            }
        }
    }
}
