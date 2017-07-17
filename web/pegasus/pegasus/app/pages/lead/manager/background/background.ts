import { Component, OnInit } from "@angular/core";
import { NavController, Tabs, LoadingController, AlertController } from "ionic-angular";
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { PrintComponent } from "../../../../components/print/print";
import { LogProvider } from "../../../../providers/log";
import { LookupProvider } from "../../../../providers/lookup";
import { Background, BackgroundBuilder } from "../../../../models/background";
import { AppProvider } from "../../../../providers/app";
import { BackgroundProvider } from "../../../../providers/background";
import { Observable } from "rxjs/Observable";
import {CordovaProvider} from "../../../../providers/cordova";
import "rxjs/Rx";

@Component({
    templateUrl: 'build/pages/lead/manager/background/background.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [BackgroundProvider]
})
export class BackgroundPage implements OnInit {
    background: Background;

    constructor(private navController: NavController,
        private alertController: AlertController,
        private loadingCtrl: LoadingController,
        private logProvider: LogProvider,
        private translateService: TranslateService,
        public lookupProvider: LookupProvider,
        public appProvider: AppProvider,
        private backgroundProvider: BackgroundProvider,
        private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {

         var tittle=this.appProvider.current.lead.surname+' '+this.appProvider.current.lead.name;
            this.cordovaProvider.trackView(tittle);
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.of(loading).delay(2000).flatMap(loading => loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.backgroundProvider.readBackground(this.appProvider.current.lead.id))
            .subscribe(data =>
                loading.dismiss().then(() =>{ 
                    this.cordovaProvider.trackEvent('manager', 'ngOnInit', 'background');
                    this.background = new BackgroundBuilder().fromBackground(data).build()}),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
    }

    onSave() {
        let mandatoryFields: string[] = [];
        if (!this.background.education) {
            mandatoryFields.push(this.translateService.instant('lead.background.education'));
        }
        if (!this.background.employment) {
            mandatoryFields.push(this.translateService.instant('lead.background.employment'));
        }
        if (!this.background.ownership) {
            mandatoryFields.push(this.translateService.instant('lead.background.ownership'));
        }
        if (!this.background.residential) {
            mandatoryFields.push(this.translateService.instant('lead.background.residential'));
        }
        if (!this.background.classification) {
            mandatoryFields.push(this.translateService.instant('lead.background.classification'));
        }
        if (mandatoryFields.length > 0) {
            this.alertController
                .create({ title: this.translateService.instant('message.mandatory'), message: mandatoryFields.join(', '), buttons: [this.translateService.instant('action.close')] })
                .present();
            return;
        }

        if (this.background.employment!='work_for_a_company') {
                   this.background.occupationType=null;
              }

          if (this.background.businessState!='business') {
                   this.background.businessType=null;
              }

        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => {
            if (this.background.id) {
                return this.backgroundProvider.updateBackground(this.background);
            }
            return this.backgroundProvider.createBackground(this.background);
        }).subscribe(
            data =>
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'onSave', 'background');
                    this.background = new BackgroundBuilder().fromBackground(data).build();
                    let tabs: Tabs = this.navController.parent;
                    tabs.select(tabs.getSelected().index + 1);
                })
            ,
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    ionViewDidLeave() {
        let mandatoryFields: string[] = [];
        if (!this.background.education) {
            mandatoryFields.push(this.translateService.instant('lead.background.education'));
        }
        if (!this.background.employment) {
            mandatoryFields.push(this.translateService.instant('lead.background.employment'));
        }
        if (!this.background.ownership) {
            mandatoryFields.push(this.translateService.instant('lead.background.ownership'));
        }
        if (!this.background.residential) {
            mandatoryFields.push(this.translateService.instant('lead.background.residential'));
        }
        if (!this.background.classification) {
            mandatoryFields.push(this.translateService.instant('lead.background.classification'));
        }
        if (mandatoryFields.length > 0) {
            this.alertController
                .create({ title: this.translateService.instant('message.mandatory'), message: mandatoryFields.join(', '), buttons: [this.translateService.instant('action.close')] })
                .present();
            return;
        }
          if (this.background.employment!='work_for_a_company') {
                   this.background.occupationType=null;
              }

          if (this.background.businessState!='business') {
                   this.background.businessType=null;
              }
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
         .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => {
            if (this.background.id) {
                return this.backgroundProvider.updateBackground(this.background);
            }
            return this.backgroundProvider.createBackground(this.background);
        }).subscribe(
            data =>
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'onViewDidLeave', 'background');
                    this.background = new BackgroundBuilder().fromBackground(data).build();
                    let tabs: Tabs = this.navController.parent;
                    tabs.select(tabs.getSelected().index);
                })
            ,
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
}
