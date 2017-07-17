import {Component, OnInit} from "@angular/core";
import {NavController, ActionSheetController, AlertController, ModalController, LoadingController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LeadProvider} from "../../providers/lead";
import {AppProvider} from "../../providers/app";
import {CreatePage} from "./create";
import {TabsPage} from "./manager/tabs";
import {LogProvider} from "../../providers/log";
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

@Component({
    templateUrl: 'build/pages/lead/lead.html',
    providers: [LeadProvider],
    pipes: [TranslatePipe, TimeAgoPipe, TruncatePipe, DateMomentFormatPipe],
    directives: [PrintComponent]
})
export class LeadPage implements OnInit {
    leads: Lead[];

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private actionSheetCtrl: ActionSheetController,
                private modalCtrl: ModalController,
                private alertCtrl: AlertController,
                private translateService: TranslateService,
                private leadProvider: LeadProvider,
                private appProvider: AppProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.readLeads();
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
        } else {
            if (!leadSearch.favourite && !leadSearch.urgent) {
                this.appProvider.current.leadsFilter = 'all';
            }
        }
        leadSearch.sort = this.appProvider.current.leadsFilter === 'urgent' ? 'id' : '-id';
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.leadProvider.readLeads(leadSearch))
            .subscribe(data =>
                    loading.dismiss().then(() => this.leads = data),
                error =>
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
                                        loading.dismiss().then(() => this.readLeads()),
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
                            let alert = this.alertCtrl.create({
                                title: this.translateService.instant('action.close'),
                                inputs: [
                                    {
                                        name: 'closeReason',
                                        placeholder: this.translateService.instant('lead.closeReason')
                                    }
                                ],
                                buttons: [
                                    {
                                        text: this.translateService.instant('action.cancel'),
                                        role: 'cancel',
                                        handler: data => this.logProvider.info('cancelled')
                                    },
                                    {
                                        text: this.translateService.instant('action.submit'),
                                        handler: data => {
                                            if (!data.closeReason || data.closeReason.length > 70) {
                                                alert.dismiss().then(() => this.appProvider.createAlert(this.translateService.instant('message.invalid')).present());
                                                return false;
                                            }
                                            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
                                            Observable.fromPromise(alert.dismiss())
                                                .flatMap(() => loading.present())
                                                .flatMap(() => this.cordovaProvider.checkMainApi())
                                                .flatMap(() => this.leadProvider.partialUpdateLead(lead.id, {"status": "closed", "closeReason": data.closeReason}))
                                                .subscribe(data =>
                                                        loading.dismiss().then(() => this.readLeads()),
                                                    error =>
                                                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                                                );
                                            return false;
                                        }
                                    }
                                ]
                            });
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

}
