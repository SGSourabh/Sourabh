import { Component ,OnInit,ViewChild} from "@angular/core";
import { NavController, Tabs,LoadingController,AlertController } from "ionic-angular";
import { TranslatePipe ,TranslateService} from "ng2-translate/ng2-translate";
import { AppProvider } from "../../../../providers/app";
import { LogProvider } from "../../../../providers/log";
import { productProvider } from "../../../../providers/product";
import { PrintComponent } from "../../../../components/print/print";
import {DateMomentFormatPipe} from "../../../../pipes/date-moment-format";
import {CurrencyPipe} from "../../../../pipes/currency";
import {CordovaProvider} from "../../../../providers/cordova";
import {Observable} from "rxjs";

@Component({
    templateUrl: 'build/pages/lead/manager/portfolio/portfolio.html',
    pipes: [TranslatePipe,DateMomentFormatPipe,CurrencyPipe],
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
       loading:any;
       loadingUpdate:any
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
     var tittle=this.appProvider.current.lead.surname+' '+this.appProvider.current.lead.name;
         this.cordovaProvider.trackView('Portfolio');
   this.status='false';
     ///alert('hhel')
   // this.appProvider.current.lead.cif='1225555555'
    if( this.appProvider.current.lead.cif){

      this.loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.of(this.loading).delay(2000).flatMap(loading =>loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status)
             ))
             //  ,
             // this.productProvider.readSaving_account(this.status),
             // this.productProvider.readCard(this.status),
             // this.productProvider.readCurrent_account(this.status),
             // this.productProvider.readInternet_banking(this.status)
             //.flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status), this.productProvider.readSaving_account(this.status),this.productProvider.readCard(this.status),this.productProvider.readCurrent_account(this.status)))
              //.flatMap(data => this.leadProvider.updateLead(this.lead))
            .subscribe(data =>{
                       this.cordovaProvider.trackEvent('manager', 'ngOnInit', 'portfolio');
                       this.leadings=data[0];
                       this.readSaving_account();
                      //  this.savingAccount=data[1];
                      //  this.card=data[2];
                      //  this.currentAccount=data[3];
                      // this.internetBanking=data[4];         
                },
            error =>
                this.loading.dismiss().then(() =>this.appProvider.createAlert(error).present())
        );
    }
    }

    readSaving_account(){
        this.productProvider.readSaving_account(this.status)
            .subscribe(data =>{
                    this.savingAccount = data;
                    this.readCard();
                   
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
    }

     readCard(){
        this.productProvider.readCard(this.status)
            .subscribe(data =>{
                    this.card = data;
                    this.readCurrent_account();
                   
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
     }

     readCurrent_account(){
        this.productProvider.readCurrent_account(this.status)
            .subscribe(data =>{
                    this.currentAccount = data;
                    this.readInternet_banking();
                   
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
     }

     readInternet_banking(){
          this.productProvider.readInternet_banking(this.status)
            .subscribe(data =>this.loading.dismiss().then(()=>  {
                    this.internetBanking = data;
                   
                }),
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
     }
    onUpdate(){
      this.status='true';
       // this.appProvider.current.lead.cif='1225555555'
      if( this.appProvider.current.lead.cif){
     this.loadingUpdate= this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.of(this.loadingUpdate).delay(2000).flatMap(loading =>loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status)
             ))
             //  ,
             // this.productProvider.readSaving_account(this.status),
             // this.productProvider.readCard(this.status),
             // this.productProvider.readCurrent_account(this.status),
             // this.productProvider.readInternet_banking(this.status)
             //.flatMap(data => Observable.forkJoin(this.productProvider.readLendings(this.status), this.productProvider.readSaving_account(this.status),this.productProvider.readCard(this.status),this.productProvider.readCurrent_account(this.status)))
              //.flatMap(data => this.leadProvider.updateLead(this.lead))
            .subscribe(data =>{
                       this.cordovaProvider.trackEvent('manager', 'ngOnInit', 'portfolio');
                       this.leadings=data[0];
                       this.readSaving_accountUpdate();
                      //  this.savingAccount=data[1];
                      //  this.card=data[2];
                      //  this.currentAccount=data[3];
                      // this.internetBanking=data[4];         
                },
            error =>
                this.loading.dismiss().then(() =>this.appProvider.createAlert(error).present())
        );

     }

   }

    readSaving_accountUpdate(){
        this.productProvider.readSaving_account(this.status)
            .subscribe(data =>{
                    this.savingAccount = data;
                    this.readCardUpdate();
                   
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
    }

     readCardUpdate(){
        this.productProvider.readCard(this.status)
            .subscribe(data =>{
                    this.card = data;
                    this.readCurrent_account();
                   
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
     }

     readCurrent_accountUpdate(){
        this.productProvider.readCurrent_account(this.status)
            .subscribe(data =>{
                    this.currentAccount = data;
                    this.readInternet_banking();
                   
                },
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
     }

     readInternet_bankingUpdate(){
          this.productProvider.readInternet_banking(this.status)
            .subscribe(data =>this.loadingUpdate.dismiss().then(()=>  {
                    this.internetBanking = data;
                   
                }),
                error =>
                    this.appProvider.createAlert(error, () => this.ngOnInit()).present()
            );
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