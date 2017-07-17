import {Component, OnInit} from "@angular/core";
import {NavController, ModalController, LoadingController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LendingCopayers, LendingCopayer} from "../../../../../models/copayers";
import {CopayersProvider} from "../../../../../providers/copayers";
import {AppProvider} from "../../../../../providers/app";
import {LogProvider} from "../../../../../providers/log";
import {PrintComponent} from "../../../../../components/print/print";
import {LookupProvider} from "../../../../../providers/lookup";
import {NewCopayerPage} from "./new-copayer";
import {ThankYouPage} from "./../../thank-you/thank-you";
import {CordovaProvider} from "../../../../../providers/cordova";
import {Observable} from "rxjs";

@Component({
    templateUrl: 'build/pages/lead/customer/lending/application/copayers.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [CopayersProvider]
})
export class CopayersPage implements OnInit {
    lendingCopayers: LendingCopayers;

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private navController: NavController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private lookupProvider: LookupProvider,
                private copayersProvider: CopayersProvider,
                private modalController: ModalController,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
          var tittle=this.translateService.instant('lead.lending.lendingCopayer.lendingCopayers');
          this.cordovaProvider.trackView(tittle);
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.copayersProvider.readCopayers(this.appProvider.current.applicationId))
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'leading copayer');
                    this.lendingCopayers = new LendingCopayers(data)
                });
            }, error => {
                loading.dismiss().then(() => error === 'timeout' ? this.appProvider.createAlert(error, () => this.ngOnInit()).present() : this.lendingCopayers = new LendingCopayers([]));
            });
    }

    onNext() {
        this.navController.setRoot(ThankYouPage, {}, this.appProvider.navOptions);
    }

    onAdd() {
        let modal = this.modalController.create(NewCopayerPage, {}, {enableBackdropDismiss: false});
        modal.onDidDismiss(lendingCopayer => {
            if (!lendingCopayer) {
                return;
            }
            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
            Observable.fromPromise(loading.present())
                .flatMap(() => this.cordovaProvider.checkMainApi())
                .flatMap(() => this.copayersProvider.createCopayer(this.appProvider.current.applicationId, lendingCopayer))
                .flatMap(m => this.lendingCopayers.addLendingCopayer(m))
                .subscribe(data =>
                        loading.dismiss().then(() =>{ 
                             this.cordovaProvider.trackEvent('customer', 'onAdd', 'leading copayer');
                            this.lendingCopayers.updateCopayer(data)})
                    , error =>
                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                );
        });
        return modal.present();
    }

    onUpdate(lendingCopayer: LendingCopayer) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.lendingCopayers.updateCopayer(lendingCopayer))
            .flatMap(m => this.copayersProvider.updateCopayer(this.appProvider.current.applicationId, m))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'onUpdate', 'leading copayer');
                        this.appProvider.createAlert(this.translateService.instant('message.success')).present()
                }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onRemove(lendingCopayer: LendingCopayer) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.copayersProvider.deleteCopayer(this.appProvider.current.applicationId, lendingCopayer.id))
            .flatMap(() => this.lendingCopayers.removeLendingCopayer(lendingCopayer))
            .subscribe(() =>
                    loading.dismiss().then(()=>{
                        this.cordovaProvider.trackEvent('customer', 'onRemove', 'leading copayer');
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    toDateLessThanOrEqualToFromDate(fromDate: string, toDate: string): boolean {
        if (fromDate && toDate) {
            let fromTime = new Date(fromDate).getTime();
            let toTime = new Date(toDate).getTime();
            return fromTime >= toTime;
        }
        return false;
    }

}
