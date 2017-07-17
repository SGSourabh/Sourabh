import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Lead, LeadBuilder} from "../../../../models/lead";
import {LeadProvider} from "../../../../providers/lead";
import {AppProvider} from "../../../../providers/app";
import {LogProvider} from "../../../../providers/log";
import {PrintComponent} from "../../../../components/print/print";
import {LookupProvider} from "../../../../providers/lookup";
import {Observable} from "rxjs/Observable";
import {BackgroundPage} from "../background/background";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/customer/personal/personal.html',
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
                private leadProvider: LeadProvider,
                private lookupProvider: LookupProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        var tittle=this.translateService.instant('lead.personal.personal');
         this.cordovaProvider.trackView(tittle);
        this.lead = new LeadBuilder().fromLead(this.appProvider.current.lead).build();
    }

    onSave(next: boolean) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        return Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.leadProvider.updateLead(this.lead))
            .subscribe(data => {
                loading.dismiss().then(() => {
                     this.cordovaProvider.trackEvent('customer', 'onSave', 'personal');
                    this.lead = new LeadBuilder().fromLead(data).build();
                    this.appProvider.current.buildLead(this.lead);
                    if (this.appProvider.current.introduction) {
                        return next ? this.navController.push(BackgroundPage) : next;
                    }
                    this.navController.pop().then(() => next ? this.navController.push(BackgroundPage) : next);
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }

}
