import { Component ,OnInit,ViewChild} from "@angular/core";
import { NavController, Tabs,LoadingController,AlertController } from "ionic-angular";
import { TranslatePipe ,TranslateService} from "ng2-translate/ng2-translate";
import { AppProvider } from "../../../../providers/app";
import { LogProvider } from "../../../../providers/log";
import { productProvider } from "../../../../providers/product";
import { PrintComponent } from "../../../../components/print/print";
import {DateMomentFormatPipe} from "../../../../pipes/date-moment-format";
import {CordovaProvider} from "../../../../providers/cordova";
import {Observable} from "rxjs";

@Component({
    templateUrl: 'build/pages/lead/manager/portfolio/portfolio.html',
    pipes: [TranslatePipe,DateMomentFormatPipe],
    directives: [PrintComponent],
    providers: [productProvider]
})
export class portfolioPage implements OnInit{
       leadings:any;
       savingAccount:any;
       card:any;
       currentAccount:any;
       internetBanking:any;
       internetBankings:any;
       status:any;
    constructor(private logProvider: LogProvider,
        private appProvider: AppProvider,
        private navController: NavController,
        private productProvider: productProvider,
        private loadingCtrl: LoadingController,
        private translateService: TranslateService,
        private cordovaProvider: CordovaProvider,
        private alertCtrl:AlertController) {
        logProvider.class(this);
    }
 ngOnInit(){
   this.status='false';
     ///alert('hhel')
    if( this.appProvider.current.lead.cif){

     let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.of(loading).delay(2000).flatMap(loading => loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status),
             this.productProvider.readSaving_account(this.status),
             this.productProvider.readCard(this.status),
             this.productProvider.readCurrent_account(this.status)
             //this.productProvider.readInternet_banking(this.status)
             ))
             //.flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status), this.productProvider.readSaving_account(this.status),this.productProvider.readCard(this.status),this.productProvider.readCurrent_account(this.status)))
              //.flatMap(data => this.leadProvider.updateLead(this.lead))
            .subscribe(data =>
                loading.dismiss().then(() => {
                       this.leadings=data[0];
                       this.savingAccount=data[1];
                       this.card=data[2];
                       this.currentAccount=data[3];
                      // this.internetBanking=data[4];         
                }),
            error =>
                loading.dismiss().then(() =>this.appProvider.createAlert(error).present())
        );
    }
    }


    onUpdate(){
      this.status='true';
     if( this.appProvider.current.lead.cif){
       let alert = this.alertCtrl.create({
                            title: this.translateService.instant('message.alert'),
                            subTitle: this.translateService.instant('message.message'),
                            buttons: [{
                            text: 'OK',
                            handler: () => {
                             this.onNext();
                            }}]
                    });
                            
       let loading = this.loadingCtrl.create({content: this.translateService.instant('lead.product.message')});
        Observable
            .fromPromise(alert.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status), 
              this.productProvider.readSaving_account(this.status),
              this.productProvider.readCard(this.status),
              this.productProvider.readCurrent_account(this.status)
              //this.productProvider.readInternet_banking(this.status)
              ))
            //.flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status), this.productProvider.readSaving_account(this.status),this.productProvider.readCard(this.status),this.productProvider.readCurrent_account(this.status)))
     
            .subscribe(data =>
                {
                       this.leadings=data[0];
                       this.savingAccount=data[1];
                       this.card=data[2];
                       this.currentAccount=data[3];
                       //this.internetBanking=data[4];
                              
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())

     }

                           
        // ); 
    }
    onNext() {
        let tabs: Tabs = this.navController.parent;
        tabs.select(tabs.getSelected().index + 1);
    }

    ionViewDidLeave() {
        let tabs: Tabs = this.navController.parent;
        tabs.select(tabs.getSelected().index);
    }
}
