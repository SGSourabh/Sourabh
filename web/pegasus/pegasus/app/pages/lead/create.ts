import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController,AlertController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LeadBuilder, Lead} from "../../models/lead";
import {LeadProvider} from "../../providers/lead";
import {AppProvider} from "../../providers/app";
import {LogProvider} from "../../providers/log";
import {CordovaProvider} from "../../providers/cordova";
import {PrintComponent} from "../../components/print/print";
import {LookupProvider} from "../../providers/lookup";
import {EnrichPage} from "./enrich";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";

@Component({
    templateUrl: 'build/pages/lead/create.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [LeadProvider]
})
export class CreatePage implements OnInit {
    lead: Lead;

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private translateService: TranslateService,
                private alertController: AlertController,
                public appProvider: AppProvider,
                public lookupProvider: LookupProvider,      
                private cordovaProvider: CordovaProvider,
                public leadProvider: LeadProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.lead = new LeadBuilder().build();
        this.lookupProvider.productTypes.first().map(m => m[0]).subscribe(value => this.lead.productType = value);
        var tittle=this.translateService.instant('lead.leadCreation');
        this.cordovaProvider.trackView(tittle);  
    }

    onCreate() {

        if(this.lead['phone'].length<10) {
           this.alertController
                .create({title: this.translateService.instant('message.mandatory'), message: this.translateService.instant('message.phonelength'), buttons: [this.translateService.instant('action.close')]})
                .present();
            return;
           // code...
       }{
        this.appProvider.current.buildLead(this.lead);
        this.navController.push(EnrichPage);
        // let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        // Observable.fromPromise(loading.present()).flatMap(data => this.leadProvider.createLead(this.lead)).subscribe(
        //     data => {
        //         loading.dismiss().then(() => {
        //             this.appProvider.current.buildLead(data);
        //             this.navController.push(EnrichPage)
        //         });
        //     },
        //     error => {
        //         loading.dismiss().then(() => this.appProvider.createAlert(error).present());
        //     });
    }

  }
}
