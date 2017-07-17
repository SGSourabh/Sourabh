import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController,AlertController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CurrentAccount} from "../../../../../models/current-account";
import {CurrentAccountProvider} from "../../../../../providers/current-account";
import {AppProvider} from "../../../../../providers/app";
import {LogProvider} from "../../../../../providers/log";
import {PrintComponent} from "../../../../../components/print/print";
import {LookupProvider} from "../../../../../providers/lookup";
import {SelectionProvider} from "../../../../../providers/selection";
import {CordovaProvider} from "../../../../../providers/cordova";
import {ThankYouPage} from "./../../thank-you/thank-you";
import {Observable} from "rxjs";

@Component({
    templateUrl: 'build/pages/lead/customer/current/application/application.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [CurrentAccountProvider,SelectionProvider]
})
export class ApplicationPage implements OnInit {
    currentAccount: CurrentAccount;
    // ugly workaround until forms upgrade
    formInvalid: boolean;
    nextbutton:boolean;
    productType:any;

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
                private selectionProvider: SelectionProvider,
                private currentAccountProvider: CurrentAccountProvider,
                public alertCtrl: AlertController,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
       //alert(this.appProvider.current.selectionData.productData.product)
        this.nextbutton=false;
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => {
                if (this.appProvider.current.applicationId == null) {
                    return this.currentAccountProvider.createCurrentAccount(new CurrentAccount({
                        selection: this.appProvider.current.selectionData.selection.id,
                        suggestion: this.appProvider.current.selectionData.selection.suggestion,
                        notes:this.appProvider.current.selectionData.selection.productType,
                        productType:this.appProvider.current.selectionData.selection.productType
                    }));
                }
                return this.currentAccountProvider.readCurrentAccount(this.appProvider.current.applicationId);
            }).subscribe(data =>
                loading.dismiss().then(() => {
                    this.currentAccount = data;
                    this.currentAccount.productType = this.appProvider.current.selectionData.productData.product;
                    if (this.appProvider.current.applicationId == null) {
                        this.appProvider.current.applicationId = this.currentAccount.id;
                    }
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );
    }

    onSave() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.currentAccountProvider.updateCurrentAccount(this.currentAccount))
            .subscribe(
                data =>
                    loading.dismiss().then(() =>{
                       this.productType=this.appProvider.current.selectionData.selection.productType;
                      // this.formInvalid=true;
                       this.nextbutton=true;
                       this.currentAccount = data;
                      // this.currentAccount.tempAccountNr="not availabale";
                         let alert = this.alertCtrl.create({
                           title: this.translateService.instant('message.alert'),
                            subTitle:this.translateService.instant('message.success'),
                            buttons: ['OK']
                            });
                            alert.present();
                     }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onNext(){
       this.navController.setRoot(ThankYouPage, {applicationid: this.currentAccount.id}, this.appProvider.navOptions) 
    }
}
