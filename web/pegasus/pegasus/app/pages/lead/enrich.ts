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
    index:any=1;
    nextbutton:boolean=true;
    totalRecord:any;
    totalRecorddisplay:any;
    displaycount:any;
    totaldisplaycount:any;
    totalLoopIndex:any;
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
        this.readCustomer()
       
    }
    readCustomer(){
       
         let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});      
        Observable.fromPromise(loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => this.leadProvider.readCustomers(this.appProvider.current.lead,this.index)).subscribe(
            data => {
                loading.dismiss().then(() =>{
                 this.cordovaProvider.trackEvent('lead', 'ngOnInit', 'enrich');
                 this.customers = data;
                 this.totalRecord=this.customers[0].totalRecords;
                 this.displaycount=this.customers.length;
                 this.totalRecorddisplay=this.totalRecord;
                 this.totalLoopIndex=Math.ceil(this.totalRecord/50);
                 this.totaldisplaycount=this.displaycount;
                // if (this.index==1) {
                //     this.totaldisplaycount=this.displaycount;
                //     // code...
                // }else{
                //     this.totaldisplaycount=(this.index-1)*50+this.displaycount; 
                // }
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
            }, 40000);
        var tittle=this.translateService.instant('action.enrich');
        this.cordovaProvider.trackView('Enrich'); 
    }

    

    onSkip() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(data => this.leadProvider.createLead(this.appProvider.current.lead)).subscribe(
            data => {
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('lead', 'onSkip', 'enrich');
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
                     this.cordovaProvider.trackEvent('lead', 'onCustomerSelect', 'enrich');
                    this.appProvider.current.buildLead(data);
                    this.navController.push(TabsPage)
                });
            },
            error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });

    }
    onPrevious(){
             if(this.index>2){
               this.nextbutton=true
               this.index=this.index-1;
               this.readCustomer()
             }else{
               this.index=1;
               this.nextbutton=true
               this.readCustomer()  
              }
        }
    onNext(){
           if (this.index<this.totalLoopIndex) {
               this.index=this.index+1;
               this.readCustomer()  
               if (this.index<this.totalLoopIndex) {
                    this.nextbutton=true
                }else{
                    this.nextbutton=false 
                } 
           }
           else{
               this.nextbutton=false
           }
    }

}
