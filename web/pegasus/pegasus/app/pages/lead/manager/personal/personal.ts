import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController, Tabs } from "ionic-angular";
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { Lead, LeadBuilder } from "../../../../models/lead";
import { LeadProvider } from "../../../../providers/lead";
import { AppProvider } from "../../../../providers/app";
import { LogProvider } from "../../../../providers/log";
import { PrintComponent } from "../../../../components/print/print";
import { LookupProvider } from "../../../../providers/lookup";
import { Observable } from "rxjs/Observable";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/manager/personal/personal.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [LeadProvider]
})
export class PersonalPage implements OnInit {
    lead: Lead;
    // ugly workaround until forms upgrade
    formInvalid: boolean;

    onForm(form): boolean {
        this.formInvalid = form && !form.form.valid;
        return false;
    }

    constructor(private logProvider: LogProvider,
        private navController: NavController,
        private loadingCtrl: LoadingController,
        private translateService: TranslateService,
        private appProvider: AppProvider,
        private lookupProvider: LookupProvider,
        private leadProvider: LeadProvider,
        private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.lead = new LeadBuilder().fromLead(this.appProvider.current.lead).build();
    }

    onSave() {
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.leadProvider.updateLead(this.lead))
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'onSave', 'personal')
                    this.lead = new LeadBuilder().fromApiUpdateLeadResponseData(data).build();
                    this.appProvider.current.buildLead(this.lead);
                }).then(() => {
                    let tabs: Tabs = this.navController.parent;
                    tabs.select(tabs.getSelected().index + 2);
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }
    ionViewDidLeave() {
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.leadProvider.updateLead(this.lead))
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'ionViewDidLeave', 'personal')
                    this.lead = new LeadBuilder().fromApiUpdateLeadResponseData(data).build();
                    this.appProvider.current.buildLead(this.lead);
                }).then(() => {
                    let tabs: Tabs = this.navController.parent;
                    tabs.select(tabs.getSelected().index);
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }
}
