import {Component, OnInit} from "@angular/core";
import {NavController, ActionSheetController, AlertController, ModalController, LoadingController} from "ionic-angular";
import {Http, Response} from "@angular/http";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LeadProvider} from "../../providers/lead";
import {AppProvider} from "../../providers/app";
import {CreatePage} from "./create";
import {TabsPage} from "./manager/tabs";
import {LogProvider} from "../../providers/log";
import {LookupProvider} from "../../providers/lookup";
import {Lead, LeadSearch} from "../../models/lead";
import {SearchPage} from "./search";
import {IntroductionPage} from "./customer/introduction/introduction";
import {PrintComponent} from "../../components/print/print";
import {Observable} from "rxjs/Observable";
import {DateMomentFormatPipe} from "../../pipes/date-moment-format";
import {TimeAgoPipe} from "angular2-moment";
import {TruncatePipe} from "../../pipes/string-trancate";
import {CarouselPage} from "./customer/carousel/carousel";
import {CalendarPage} from "../calendar/calendar";
import {ENV} from "../../env";
import {CordovaProvider} from "../../providers/cordova";
declare var ga:Function;

@Component({
    templateUrl: 'build/pages/lead/lead.html',
    providers: [LeadProvider],
    pipes: [TranslatePipe, TimeAgoPipe, TruncatePipe, DateMomentFormatPipe],
    directives: [PrintComponent]
})
export class LeadPage implements OnInit {
    leads: Lead[];
    closeOption:any
    index:number=1;
    total;
    nextbutton:boolean=true;

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private actionSheetCtrl: ActionSheetController,
                private modalCtrl: ModalController,
                private alertCtrl: AlertController,
                private translateService: TranslateService,
                private leadProvider: LeadProvider,
                private appProvider: AppProvider,
                private lookupProvider: LookupProvider,
                private http: Http,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
        // ga('set', 'page', '/lead');
        //  ga('send', 'pageview')
    }
    
    ngOnInit() {
        this.readLeads();
         var tittle=this.translateService.instant('lead.leads');
        this.cordovaProvider.trackView(tittle);
    }

    onPageDidLeave() {
        this.appProvider.current.leadsFilter = 'all';
    }

    readLeads(leadSearch?: LeadSearch) {
        if (!leadSearch) {
            leadSearch = {};
            if ('favourite' === this.appProvider.current.leadsFilter) {
                leadSearch.favourite = true;
            } else if ('urgent' === this.appProvider.current.leadsFilter) {
                leadSearch.urgent = true;
            }
            if ('newlead' === this.appProvider.current.leadsFilter) {
                leadSearch.newlead = true;
            } else if ('followUp' === this.appProvider.current.leadsFilter) {
                leadSearch.followUp = true;
            }
            if('next'===this.appProvider.current.leadsFilter){
              leadSearch.index=this.index;
            }else if('pre'===this.appProvider.current.leadsFilter){
              leadSearch.index=this.index;   
            }

        } else {
            if (!leadSearch.favourite && !leadSearch.urgent) {
                this.appProvider.current.leadsFilter = 'all';
            }
        }
        leadSearch.sort = this.appProvider.current.leadsFilter === 'urgent' ? 'id' : '-created';
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.of(loading).flatMap(loading => loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        //.flatMap(data=>this.leadProvider.readLeads(leadSearch))
        .flatMap(data => Observable.forkJoin(
            this.leadProvider.readLeads(leadSearch),
            this.leadProvider.readSummeryDashboard(this.appProvider.current.user)))
        .subscribe(data =>loading.dismiss()
        .then(() =>{
            this.cordovaProvider.trackEvent('lead', 'readLeads', 'lead');
            this.leads = data[0];
            this.total=data[1].total;
            if(this.leads.length>0){
                this.nextbutton=true;
            }else{
                this.nextbutton=false;
            }
            if(this.leads.length<50){
                this.nextbutton=false;
            }
        })
        ,error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
    }

    onCreate(): Promise<any> {
        return this.navController.push(CreatePage);
    }

    onSearch(): Promise<any> {
        let modal = this.modalCtrl.create(SearchPage, {}, {enableBackdropDismiss: false});
        modal.onDidDismiss((leadSearch: LeadSearch) => {
            if (!leadSearch) {
                return;
            }
            this.readLeads(leadSearch);
        });
        return modal.present();
    }

    onFilter(): Promise<any> {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('action.filter'),
            buttons: [
                {
                    text: this.translateService.instant('action.cancel'),
                    role: 'cancel'
                },
                {
                    text: this.translateService.instant('action.submit'),
                    handler: data => {
                        this.appProvider.current.leadsFilter = data;
                        this.readLeads();
                    }
                }
            ]
        });
        alert.addInput({
            type: 'radio',
            label: this.translateService.instant('lead.filter.new'),
            value: 'new',
            checked: 'new' === this.appProvider.current.leadsFilter
        });
        alert.addInput({
            type: 'radio',
            label: this.translateService.instant('lead.filter.followUp'),
            value: 'followUp',
            checked: 'followUp' === this.appProvider.current.leadsFilter
        });
        alert.addInput({
            type: 'radio',
            label: this.translateService.instant('lead.filter.favourite'),
            value: 'favourite',
            checked: 'favourite' === this.appProvider.current.leadsFilter
        });
        alert.addInput({
            type: 'radio',
            label: this.translateService.instant('lead.filter.all'),
            value: 'all',
            checked: 'all' === this.appProvider.current.leadsFilter
        });
        alert.addInput({
            type: 'radio',
            label: this.translateService.instant('lead.filter.urgent'),
            value: 'urgent',
            checked: 'urgent' === this.appProvider.current.leadsFilter
        });
        return alert.present();
    }

    onLead(lead: Lead) {
        if (lead.status === 'closed') {
            return this.appProvider.createAlert(this.translateService.instant('lookup.status.closed')).present();
        }
        let actionSheet = this.actionSheetCtrl.create({
            title: lead.name + ' ' + lead.surname,
            buttons: [
                {
                    text: this.translateService.instant('action.start'),
                    icon: 'chatbubbles',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            this.appProvider.current.buildLead(lead);
                            this.navController.setRoot(IntroductionPage, {}, this.appProvider.navOptions);
                        })
                },
                {
                    text: this.translateService.instant('action.edit'),
                    icon: 'create',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            this.appProvider.current.buildLead(lead);
                            this.navController.setRoot(TabsPage, {}, this.appProvider.navOptions);
                        })
                },
                {
                    text: this.translateService.instant('calendar.calendar'),
                    icon: 'calendar',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            this.appProvider.current.buildLead(lead);
                            this.navController.setRoot(CalendarPage, {leadid: lead.id, first_name: lead.name, last_name: lead.surname}, this.appProvider.navOptions);
                        })
                },

                {
                    text: this.translateService.instant('lead.favourite'),
                    icon: 'star',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                            Observable.fromPromise(loading.present())
                                .flatMap(() => this.cordovaProvider.checkMainApi())
                                .flatMap(data => this.leadProvider.partialUpdateLead(lead.id, {"favourite": !lead.favourite}))
                                .subscribe(data =>
                                        loading.dismiss().then(() =>{ 
                                            this.cordovaProvider.trackEvent('lead', 'favourite', 'lead');
                                            this.readLeads()}),
                                    error =>
                                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                                );
                        })
                },
                {
                    text: this.translateService.instant('action.close'),
                    icon: 'close',
                    handler: () =>
                        actionSheet.dismiss().then(() => {
                            let alert = this.alertCtrl.create()
                                alert.setTitle(this.translateService.instant('action.close'));

                                alert.addInput({
                                    type: 'radio',
                                    label: this.translateService.instant('action.closeOption.success'),
                                    value: 'success',
                                    checked: true
                                });
                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.already_has_product_other_bank'),
                                    value: 'already_has_product_other_bank'
                                });

                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.already_has_product_vib'),
                                    value: 'already_has_product_vib'
                                });
                                 alert.addInput({
                                    type: 'radio',
                                    label: this.translateService.instant('action.closeOption.already_followed_by_vib_staff'),
                                    value: 'already_followed_by_vib_staff'
                                });
                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.no_interest'),
                                    value: 'no_interest'
                                });

                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.not_eligible_unqualified'),
                                    value: 'not_eligible_unqualified'
                                });
                                 alert.addInput({
                                    type: 'radio',
                                    label: this.translateService.instant('action.closeOption.cannot_contact_customer'),
                                    value: 'cannot_contact_customer'
                                });
                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.not_ready_now'),
                                    value: 'not_ready_now'
                                });

                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.inaccurate_customer_details'),
                                    value: 'inaccurate_customer_details'
                                });
                                 alert.addInput({
                                    type: 'radio',
                                    label: this.translateService.instant('action.closeOption.duplicate_lead'),
                                    value: 'closeOption.duplicate_lead'
                                });
                                alert.addInput({
                                    type:'radio',
                                    label: this.translateService.instant('action.closeOption.do_not_disturb'),
                                    value: 'closeOption.do_not_disturb'
                                });

                                  alert.addButton(this.translateService.instant('action.cancel'));
                                  alert.addButton({
                                     text: this.translateService.instant('action.submit'),
                                       handler: data => {
                                           console.log(data)
                                            if (!data) {
                                                alert.dismiss().then(() => this.appProvider.createAlert(this.translateService.instant('message.invalid')).present());
                                                return false;
                                            }
                                            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                                            Observable.fromPromise(alert.dismiss())
                                                .flatMap(() => loading.present())
                                                .flatMap(() => this.cordovaProvider.checkMainApi())
                                                .flatMap(() => this.leadProvider.partialUpdateLead(lead.id, {"status": "closed", "closeReason": data}))
                                                .subscribe(data =>
                                                        loading.dismiss().then(() => {
                                                            this.cordovaProvider.trackEvent('lead', 'close', 'lead');
                                                            this.readLeads()}),
                                                    error =>
                                                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                                                );
                                            return false;
                                        }
                                    });

                                 // select:[
                                 //        {
                                 //           name: 'expiry',
                                 //             options: {
                                 //                option: 'Nerver',
                                 //                option: '24 hours'
                                 //            },
                                 //            placeholder: ''
                                 //        },
                                 //      ],
                            //      select[
                            //      {
                            //        name: 'expiry',
                            //      }
                            //      ],
                            //     buttons: [
                            //         {
                            //             text: this.translateService.instant('action.cancel'),
                            //             role: 'cancel',
                            //             handler: data => this.logProvider.info('cancelled')
                            //         },
                            //         {
                            //             text: this.translateService.instant('action.submit'),
                            //             handler: data => {
                            //                 if (!data.closeReason || data.closeReason.length > 70) {
                            //                     alert.dismiss().then(() => this.appProvider.createAlert(this.translateService.instant('message.invalid')).present());
                            //                     return false;
                            //                 }
                            //                 let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                            //                 Observable.fromPromise(alert.dismiss())
                            //                     .flatMap(() => loading.present())
                            //                     .flatMap(() => this.cordovaProvider.checkMainApi())
                            //                     .flatMap(() => this.leadProvider.partialUpdateLead(lead.id, {"status": "closed", "closeReason": data.closeReason}))
                            //                     .subscribe(data =>
                            //                             loading.dismiss().then(() => this.readLeads()),
                            //                         error =>
                            //                             loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                            //                     );
                            //                 return false;
                            //             }
                            //         }
                            //     ]
                            // });
                            alert.present();
                        })
                },
                {
                    text: this.translateService.instant('action.cancel'),
                    role: 'cancel',
                    handler: () => this.logProvider.info('cancel')
                }
            ]
        });
        if (ENV.debug) {
            actionSheet.addButton({
                text: this.translateService.instant('action.explore'),
                icon: 'open',
                handler: () =>
                    actionSheet.dismiss().then(() => {
                        this.appProvider.current.buildLead(lead);
                        this.navController.setRoot(CarouselPage, {}, this.appProvider.navOptions);
                    })
            });
        }
        actionSheet.present();
    }
    onPrevious(){
       if(this.index>2){
              this.index=this.index-1;
              this.appProvider.current.leadsFilter='pre';
              this.readLeads();
          }
          
          else{
            this.index=1;
            this.readLeads(); 
            }
      }
    onNext(){
        this.index=this.index+1;
       this.appProvider.current.leadsFilter='next';
      this.readLeads();   
     
      
    }

}
