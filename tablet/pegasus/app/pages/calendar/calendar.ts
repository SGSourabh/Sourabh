import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController, ModalController, ActionSheetController,NavParams} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {AppProvider} from "../../providers/app";
import {LogProvider} from "../../providers/log";
import {AppointmentProvider} from "../../providers/appointment";
import {UserProvider} from "../../providers/user";
import {LeadProvider} from "../../providers/lead";
import {PrintComponent} from "../../components/print/print";
import {Appointment} from "../../models/appointment";
import {AppointmentPage} from "./appointment/appointment";
import {TabsPage} from "../lead/manager/tabs";
import {IntroductionPage} from "../lead/customer/introduction/introduction";
import {Observable} from "rxjs/Observable";
import {DateMomentFormatPipe} from "../../pipes/date-moment-format";
import * as moment from "moment";
import {CarouselPage} from "../lead/customer/carousel/carousel";
import {CordovaProvider} from "../../providers/cordova";

@Component({
    templateUrl: 'build/pages/calendar/calendar.html',
    pipes: [TranslatePipe, DateMomentFormatPipe],
    providers: [AppointmentProvider, LeadProvider],
    directives: [PrintComponent]
})
export class CalendarPage implements OnInit {
    appointments: Appointment[];
    leadId;
    leadFirst_Name;
    leadLast_Name;

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private appointmentProvider: AppointmentProvider,
                private leadProvider: LeadProvider,
                private userProvider: UserProvider,
                private modalCtrl: ModalController,
                private actionSheetCtrl: ActionSheetController,
                public navParams: NavParams,
                private cordovaProvider: CordovaProvider) {
                this.leadId=this.navParams.get('leadid');
                this.leadFirst_Name=this.navParams.get('first_name');
                this.leadLast_Name=this.navParams.get('last_name');
        logProvider.class(this);
    }

    ngOnInit() {

         if(this.leadId!=undefined && this.leadLast_Name!=undefined && this.leadFirst_Name !=undefined){
             console.log("hello")
           console.log(this.leadId)
        console.log(this.leadLast_Name)
        console.log(this.leadFirst_Name)
        let start= new Date().toISOString();
       let end = moment().endOf('month').toDate().toISOString();
       let sub="Z";
        if(start.indexOf(sub) !== -1){
        var urgentpost = start.split("Z");
        start =urgentpost[0]; 
        }
        if(end.indexOf(sub) !== -1){
        var urgentpost = end.split("Z");
        end =urgentpost[0]; 
        }
        //  let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        // Observable
        //     .fromPromise(loading.present())
           
            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.appointmentProvider.readAppointments({
                from: start,
                to: end,
                creator: this.userProvider.user.name
            }))
            .subscribe(data =>
                    loading.dismiss().then(() =>{ 
                        this.appointments = data;                  
                        this.onAdd();
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );     
         }else{
           console.log("hello else")
        this.showAppointment();
    }
  }

  showAppointment(){
       let start= new Date().toISOString();
       let end = moment().endOf('month').toDate().toISOString();
       let sub="Z";
        if(start.indexOf(sub) !== -1){
        var urgentpost = start.split("Z");
        start =urgentpost[0]; 
        }
        if(end.indexOf(sub) !== -1){
        var urgentpost = end.split("Z");
        end =urgentpost[0]; 
        }
      
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.appointmentProvider.readEnrichedAppointments({
                from: start,
                to: end,
                creator: this.userProvider.user.name
            }))
            .subscribe(data =>

                    loading.dismiss().then(() =>{ this.appointments = data;
                     
                    }),

                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
        }

    onAdd() {
        if(this.leadId!=undefined && this.leadLast_Name!=undefined && this.leadFirst_Name !=undefined){
           
         let modal = this.modalCtrl.create(AppointmentPage, {leadid:this.leadId,first_name:this.leadFirst_Name,last_name:this.leadLast_Name}, {enableBackdropDismiss: false});
           modal.onDidDismiss((appointment: Appointment) => {
            if (!appointment) {
                return;
            }
            this.appointments.push(appointment);
        });
            this.leadId=undefined;
            this.leadLast_Name=undefined;
            this.leadFirst_Name=undefined;
          return modal.present();

        }else{
        let modal = this.modalCtrl.create(AppointmentPage, {}, {enableBackdropDismiss: false});
        modal.onDidDismiss((appointment: Appointment) => {
            if (!appointment) {
                return;
            }
            this.appointments.push(appointment);
        });
        return modal.present();
    }
    }

    onAppointment(appointment: Appointment) {
        let actionSheet = this.actionSheetCtrl.create({
            // title: appointment.name + ' ' + appointment.surname,
            buttons: [
                {
                    text: this.translateService.instant('action.editCalendar'),
                    icon: 'create',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                            Observable
                                .fromPromise(loading.present())
                               // .flatMap(data => this.leadProvider.readLead(appointment.leadId))
                                .subscribe(data =>
                                        loading.dismiss().then(() => {
                                            let modal = this.modalCtrl.create(AppointmentPage, {appointment: appointment}, {enableBackdropDismiss: false});
                                            modal.onDidDismiss((appointment: Appointment) => {
                                                if (!appointment) {
                                                    return;
                                                }
                                                let index = this.appointments.findIndex(f => f.id === appointment.id);
                                                if (index > -1) {
                                                    this.appointments[index] = appointment;
                                                }
                                            });
                                            return modal.present();
                                        }),
                                    error =>
                                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                                );
                        })
                },
                // {
                //     text: this.translateService.instant('action.editLead'),
                //     icon: 'create',
                //     handler: () =>
                //         actionSheet.dismiss().then(() => {
                //             let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                //             Observable
                //                 .fromPromise(loading.present())
                //                 .flatMap(data => this.leadProvider.readLead(appointment.leadId))
                //                 .subscribe(data =>
                //                         loading.dismiss().then(() => {
                //                             this.appProvider.current.buildLead(data);
                //                             this.navController.setRoot(TabsPage, {}, this.appProvider.navOptions);
                //                         }),
                //                     error =>
                //                         loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                //                 );
                //         })
                // },
                // {
                //     text: this.translateService.instant('action.start'),
                //     icon: 'chatbubbles',
                //     handler: () =>
                //         actionSheet.dismiss().then(() => {
                //             let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                //             Observable
                //                 .fromPromise(loading.present())
                //                 .flatMap(data => this.leadProvider.readLead(appointment.leadId))
                //                 .subscribe(data =>
                //                         loading.dismiss().then(() => {
                //                             this.appProvider.current.buildLead(data);
                //                             this.navController.setRoot(IntroductionPage, {}, this.appProvider.navOptions);
                //                         }),
                //                     error =>
                //                         loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                //                 );
                //         })
                // },
                // {
                //     text: this.translateService.instant('action.explore'),
                //     icon: 'open',
                //     handler: () =>
                //         actionSheet.dismiss().then(() => {
                //             let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                //             Observable
                //                 .fromPromise(loading.present())
                //                 .flatMap(data => this.leadProvider.readLead(appointment.leadId))
                //                 .subscribe(data =>
                //                         loading.dismiss().then(() => {
                //                             this.appProvider.current.buildLead(data);
                //                             this.navController.setRoot(CarouselPage, {}, this.appProvider.navOptions);
                //                         }),
                //                     error =>
                //                         loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                //                 );
                //         })
                // },
                {
                    text: this.translateService.instant('action.delete'),
                    icon: 'close',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                            Observable
                                .fromPromise(loading.present())
                                 .flatMap(() => this.cordovaProvider.checkMainApi())
                                .flatMap(data => this.appointmentProvider.deleteAppointment(appointment.exchangeId))
                                .subscribe(data =>
                                        loading.dismiss().then(() =>
                                            this.appointments = this.appointments.filter((v) => v.exchangeId != appointment.exchangeId)
                                        ),
                                    error =>
                                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                                );
                        })
                },
                {
                    text: this.translateService.instant('action.cancel'),
                    role: 'cancel',
                    handler: () => this.logProvider.info('cancel')
                }
            ]
        });
        actionSheet.present();
    }
}

