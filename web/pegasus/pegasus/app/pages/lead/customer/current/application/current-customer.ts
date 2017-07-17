import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController,AlertController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CurrentAccount} from "../../../../../models/current-account";
import {CurrentAccountProvider} from "../../../../../providers/current-account";
import {LeadProvider} from "../../../../../providers/lead";
import {AppProvider} from "../../../../../providers/app";
import {LogProvider} from "../../../../../providers/log";
import {CordovaProvider} from "../../../../../providers/cordova";
import { Lead, LeadBuilder } from "../../../../../models/lead";
import {Customer} from "../../../../../models/customer";
import {PrintComponent} from "../../../../../components/print/print";
import {LookupProvider} from "../../../../../providers/lookup";
// import { Lead, LeadBuilder } from "../../../../models/lead";
import {ThankYouPage} from "./../../thank-you/thank-you";
import {CurrentApplicationPage} from "./current-application";
 import {RecommendationPage} from "../../recommendation/recommendation";
import {Observable} from "rxjs";

@Component({
    templateUrl: 'build/pages/lead/customer/current/application/current-customer.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [CurrentAccountProvider,LeadProvider]
})
export class CurrentCustomerPage implements OnInit {
    currentAccount:CurrentAccount;
    // currentAccount:Lead;
    customers:any;
    account:any;
    // ugly workaround until forms upgrade
    formInvalid: boolean;
    cif:any;
    validatebutton:any;
    nextbutton:any;
    accountsumm:any;
    checkAccount:any;

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
                private currentAccountProvider: CurrentAccountProvider,
                private leadProvider: LeadProvider,
                public alertCtrl: AlertController,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
        this.accountsumm='other';
    }

    ngOnInit() {
         var tittle=this.translateService.instant('lead.currentAccount.customerinformation');
        this.cordovaProvider.trackView(tittle);
        this.validatebutton=true;
        this.nextbutton=false;
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.currentAccountProvider.readCurrentAccountCustomer())
     
            .subscribe(data =>
                loading.dismiss().then(() => {
                    this.currentAccount = data;
                    
                   // this.accountsumm=data[1];
                    this.currentAccount['fullName']=this.currentAccount['surname']+' '+this.currentAccount['name'];
                    this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'current-customer');                    
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );
    }

    onSave() {
        let partial;
         partial = {
            idDateOfIssue: this.currentAccount['idDateOfIssue']
            }        
         let mandatoryFields: string[] = [];
        if (!partial.idDateOfIssue) {
            mandatoryFields.push(this.translateService.instant('lead.currentAccount.idDateOfIssue'));
        }
        if (mandatoryFields.length > 0) {
            this.alertCtrl
                .create({title: this.translateService.instant('message.mandatory'), message: mandatoryFields.join(', '), buttons: [this.translateService.instant('action.close')]})
                .present();
            return;
        }

        if(this.currentAccount["idDateOfIssue"]==null){
          this.currentAccount["idDateOfIssue"]=this.currentAccount['idDateOfIssue'];  
      }else{
               if(this.currentAccount["idDateOfIssue"].length < 22){
                var sub="T"; 
                if(this.currentAccount["idDateOfIssue"].indexOf(sub) !== -1){
                    var urgentpost = this.currentAccount["idDateOfIssue"].split("T");
                 this.currentAccount["idDateOfIssue"]=urgentpost[0]+'T00:00:00.000Z'; 
                }else{
                 this.currentAccount["idDateOfIssue"]=this.currentAccount['idDateOfIssue']+'T00:00:00.000Z'; 
                }        
        }

      }
       
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.currentAccountProvider.updateLead(this.currentAccount))
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.currentAccount = data;
                     this.cordovaProvider.trackEvent('customer', 'onsave', 'current-customer');
                    this.onNext();
                  })
                    
               
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }
    onback(){
    this.navController.push(RecommendationPage ,{suggestionCheck:'suggestionCheck'});
    }
    onValidate(){
        //this.appProvider.current.lead.cif='125360445'
        // if(this.appProvider.current.lead.cif==null) {
        //      // alert(this.appProvider.current.lead.cif)
        //             let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        //             Observable.fromPromise(loading.present())
        //             .flatMap(() => this.cordovaProvider.checkMainApi())
        //             .flatMap(data => Observable.forkJoin(
        //                 this.currentAccountProvider.validate(this.currentAccount,this.currentAccount['fullName']),
        //                 this.currentAccountProvider.validateApplication(this.currentAccount),
        //                 this.currentAccountProvider.checkCurrentAccount(this.currentAccount)
        //             ))
        //             .subscribe(data => {
        //                     loading.dismiss().then(() => {
        //                     this.cordovaProvider.trackEvent('customer', 'onValidate', 'current-customer');
        //                     this.customers = data[0];
        //                     this.account=data[1];
        //                     this.checkAccount=data[2];

                            // if(this.customers['username']!=null ){
                            //     this.nextbutton=false;
                            //     this.currentAccount['userName']=this.customers['username'];
                            //     let alert = this.alertCtrl.create({
                            //     title: this.translateService.instant('message.alert'),
                            //     subTitle:this.translateService.instant('message.user_exists'),
                            //     buttons: ['OK']
                            //     });
                            //     alert.present();

                         //    }
                         //    else if (this.customers.message=="AML Fail"){
                         //        this.nextbutton=false;
                         //        let alert = this.alertCtrl.create({
                         //        title: this.translateService.instant('message.alert'),
                         //        subTitle:this.translateService.instant('message.error3'),
                         //        buttons: ['OK']
                         //        });
                         //        alert.present();
                         //    }
                         //     else if (this.account[0].accountStatus!="000000"){
                         //        this.nextbutton=false;
                         //        let alert = this.alertCtrl.create({
                         //        title: this.translateService.instant('message.alert'),
                         //        subTitle:this.translateService.instant('message.error1'),
                         //        buttons: ['OK']
                         //        });
                         //        alert.present();
                         //    }
                         //    else if (this.checkAccount[0].accountStatus=="600101"){
                         //        this.nextbutton=true;
                         //         let alert = this.alertCtrl.create({
                         //        title: this.translateService.instant('message.alert'),
                         //        subTitle: this.translateService.instant('message.success'),
                         //        buttons: ['OK']
                         //        });
                         //        alert.present();
                         //   }
                         // else if (this.checkAccount[0].accountStatus=="600102"){
                         //         this.nextbutton=true;
                         //        //  this.validatebutton=false;
                         //        let alert = this.alertCtrl.create({
                         //        title: this.translateService.instant('message.alert'),
                         //        subTitle: this.translateService.instant('message.success'),
                         //        buttons: ['OK']
                         //        });
                         //        alert.present();
                         //  }
                         //    else{
                         //        this.nextbutton=true;
                         //        //  this.validatebutton=false;
                         //        let alert = this.alertCtrl.create({
                         //        title: this.translateService.instant('message.alert'),
                         //        subTitle: this.translateService.instant('message.success'),
                         //        buttons: ['OK']
                         //        });
                         //        alert.present();
                         //    }

             //         })
             //        }, error => {
             //        loading.dismiss().then(() => this.appProvider.createAlert(error).present());
             //        });     // code...
             // }else{
                    let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
                    Observable.fromPromise(loading.present())
                    .flatMap(() => this.cordovaProvider.checkMainApi())
                    .flatMap(data => Observable.forkJoin(
                            this.currentAccountProvider.validate(this.currentAccount,this.currentAccount['fullName']),
                            this.currentAccountProvider.validateApplication(this.currentAccount),
                            this.currentAccountProvider.readAccountSummery(this.currentAccount),
                            this.currentAccountProvider.checkCurrentAccount(this.currentAccount)
                    ))
                    // .flatMap(data => this.currentAccountProvider.validate(this.currentAccount))
                    .subscribe(data => {
                    loading.dismiss().then(() => {
                      this.cordovaProvider.trackEvent('customer', 'onValidate', 'current-customer');
                    this.customers =data[0];
                    this.account=data[1];
                    this.accountsumm=data[2];
                    this.checkAccount=data[3];
                        if(this.customers['username']!=null ){
                            this.nextbutton=false;
                            //this.nextbutton=true;
                            this.currentAccount['userName']=this.customers['username'];
                            let alert = this.alertCtrl.create({
                            title: this.translateService.instant('message.alert'),
                            subTitle:this.translateService.instant('message.user_exists'),
                            buttons: ['OK']
                            });
                            alert.present();

                        }
                        else if (this.customers.message=="AML Fail"){
                            this.nextbutton=false;
                            //this.nextbutton=true;
                            let alert = this.alertCtrl.create({
                            title: this.translateService.instant('message.alert'),
                            subTitle:this.translateService.instant('message.error3'),
                            buttons: ['OK']
                            });
                            alert.present();
                        }
                         else if (this.account[0].accountStatus!="000000"){
                                this.nextbutton=false;
                                //this.nextbutton=true;
                                let alert = this.alertCtrl.create({
                                title: this.translateService.instant('message.alert'),
                                subTitle:this.translateService.instant('message.error1'),
                                buttons: ['OK']
                                });
                                alert.present();
                            }

                       else if(this.accountsumm[0].accountCount==0){
                            this.nextbutton=false;
                            let alert = this.alertCtrl.create({
                            title: this.translateService.instant('message.alert'),
                            subTitle:this.translateService.instant('message.error2'),
                            buttons: ['OK']
                            });
                            alert.present();
                        }
                         else  if (this.checkAccount[0].accountStatus=="600101"){
                                this.nextbutton=true;
                                let alert = this.alertCtrl.create({
                                title: this.translateService.instant('message.alert'),
                                subTitle:this.translateService.instant('message.success'),
                                buttons: ['OK']
                                });
                                alert.present();
                         }
                         else if (this.checkAccount[0].accountStatus=="600102"){
                                 this.nextbutton=true;
                                //  this.validatebutton=false;
                                let alert = this.alertCtrl.create({
                                title: this.translateService.instant('message.alert'),
                                subTitle: this.translateService.instant('message.success'),
                                buttons: ['OK']
                                });
                                alert.present();
                          }
                        else {
                            this.nextbutton=true;
                            //  this.validatebutton=false;
                            let alert = this.alertCtrl.create({
                            title: this.translateService.instant('message.alert'),
                            subTitle: this.translateService.instant('message.success'),
                            buttons: ['OK']
                            });
                            alert.present();
                        }
                    })
                    }, error => {
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present());
                    });    
            // }
       
    }
    onNext(){
             this.navController.push(CurrentApplicationPage,{accountsumm:this.accountsumm,lead:this.currentAccount,checkAccount:this.checkAccount}); 
       //   let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
       //  Observable
       //      .fromPromise(loading.present())
       //      .flatMap(() => this.cordovaProvider.checkMainApi())
       //      .flatMap(() => this.currentAccountProvider.readAccountSummery())
       //      .subscribe(data =>
       //           loading.dismiss().then(() => {
       //           this.accountsumm=data;                      
       //          }),
       //      error =>
       //          loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
       //    );
       // if(this.accountsumm[0].accountCount==1){
       //              let alert = this.alertCtrl.create({
       //              title: this.translateService.instant('message.alert'),
       //              subTitle:this.translateService.instant('message.error2'),
       //              buttons: ['OK']
       //              });
       //              alert.present();
       //      }
       //  else if(this.accountsumm[0].accountCount==0) {
       //      // code...

       //  }
                 
    }

}
