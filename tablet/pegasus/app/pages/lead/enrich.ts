import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController, ActionSheetController,AlertController,} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LeadProvider} from "../../providers/lead";
import {AppProvider} from "../../providers/app";
import {LogProvider} from "../../providers/log";
import {PrintComponent} from "../../components/print/print";
import {LookupProvider} from "../../providers/lookup";
import {TabsPage} from "./manager/tabs";
import {Customer} from "../../models/customer";
import {Observable} from "rxjs/Observable";
import {LeadBuilder} from "../../models/lead";
import {CordovaProvider} from "../../providers/cordova";


@Component({
    templateUrl: 'build/pages/lead/enrich.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [LeadProvider]
})
export class EnrichPage implements OnInit {
    customers: Customer[];

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private actionSheetCtrl: ActionSheetController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private lookupProvider: LookupProvider,
                private alertCtrl: AlertController,
                public leadProvider: LeadProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => this.leadProvider.readCustomers(this.appProvider.current.lead)).subscribe(
            data => {
                loading.dismiss().then(() =>{
                 this.customers = data;
                 for(var i = 0; i < this.customers.length; i++)
                 if(this.customers[i].maritalStatus=='other'){
                    this.customers[i].maritalStatus=null; 
                 }

                });
            },
            error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present());
            }
            );
         setTimeout(()=> {
            loading.dismiss();
            let alert = this.alertCtrl.create({ title: 'Timeout', buttons: [ 'Ok' ] });
             alert.present();
             loading.dismiss();
            }, 20000);
         
    }

    onSkip() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => this.leadProvider.createLead(this.appProvider.current.lead)).subscribe(
            data => {
                loading.dismiss().then(() => {
                    this.appProvider.current.buildLead(data);
                    this.navController.push(TabsPage)
                });
            },
            error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }

    onCustomerSelect(customer: Customer) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => this.leadProvider.createLead(new LeadBuilder().fromLead(this.appProvider.current.lead).build().mergeCustomer(customer))).subscribe(
            data => {
                loading.dismiss().then(() => {
                    this.appProvider.current.buildLead(data);
                    this.navController.push(TabsPage)
                });
            },
            error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });

    }

}
