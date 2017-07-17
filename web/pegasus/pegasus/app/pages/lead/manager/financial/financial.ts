import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, Tabs, LoadingController,ModalController } from "ionic-angular";
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { PrintComponent } from "../../../../components/print/print";
import { LogProvider } from "../../../../providers/log";
import { LookupProvider } from "../../../../providers/lookup";
import { AppProvider } from "../../../../providers/app";
import { Fhc, FhcBuilder } from "../../../../models/fhc";
import { Personal, PersonalBuilder } from "../../../../models/fhc/personal";
import { BankingProvider } from "../../../../providers/fhc/personal/banking";
import { LendingProvider } from "../../../../providers/fhc/personal/lending";
import { ProtectProvider } from "../../../../providers/fhc/personal/protect";
import { SavingProvider } from "../../../../providers/fhc/personal/saving";
import { Business, BusinessBuilder } from "../../../../models/fhc/business";
import { BankingProvider as BusinessBankingProvider } from "../../../../providers/fhc/business/banking";
import { LendingProvider as BusinessLendingProvider } from "../../../../providers/fhc/business/lending";
import { ProtectProvider as BusinessProtectProvider } from "../../../../providers/fhc/business/protect";
import { BankProvider} from "../../../../providers/bank";
import { Observable } from "rxjs/Observable";
import {CordovaProvider} from "../../../../providers/cordova";
import {AddPage} from "./add";

@Component({
    templateUrl: 'build/pages/lead/manager/financial/financial.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [
        BankingProvider,
        LendingProvider,
        ProtectProvider,
        SavingProvider,
        BusinessBankingProvider,
        BusinessLendingProvider,
        BusinessProtectProvider,
        BankProvider
    ]
})
export class FinancialPage implements OnInit {
    fhc: Fhc;
    bankList:any;
    personalLeadingOther:any;
    personalbankingOther:any;
    bussinessLeadingOther:any;
    bussinesbankingOther:any;


    constructor(private navController: NavController,
        private loadingCtrl: LoadingController,
        private logProvider: LogProvider,
        private translateService: TranslateService,
        private lookupProvider: LookupProvider,
        private appProvider: AppProvider,
        private bankingProvider: BankingProvider,
        private lendingProvider: LendingProvider,
        private protectProvider: ProtectProvider,
        private savingProvider: SavingProvider,
        private bankProvider: BankProvider,
        private modalCtrl: ModalController,
        private businessBankingProvider: BusinessBankingProvider,
        private businessLendingProvider: BusinessLendingProvider,
        private businessProtectProvider: BusinessProtectProvider,
        private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        var tittle=this.appProvider.current.lead.surname+' '+this.appProvider.current.lead.name;
        this.cordovaProvider.trackView(tittle);
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') ,duration: 5000});
        let fhcObservalble = Observable
        
        .forkJoin(
            this.bankingProvider.readBanking(this.appProvider.current.lead.id),
            this.lendingProvider.readLending(this.appProvider.current.lead.id),
            this.protectProvider.readProtect(this.appProvider.current.lead.id),
            this.savingProvider.readSaving(this.appProvider.current.lead.id),
            this.businessBankingProvider.readBanking(this.appProvider.current.lead.id),
            this.businessLendingProvider.readLending(this.appProvider.current.lead.id),
            this.businessProtectProvider.readProtect(this.appProvider.current.lead.id)
            //this.bankProvider.readBankList()
        );
        // suspected bug in ionic 2.0.0-beta.11 tabs, delay to circumvent
        Observable.of(loading).delay(2000).flatMap(loading => loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => fhcObservalble)
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'ngOnInit', 'financial');
                    let personal: Personal = new PersonalBuilder().build();
                    personal.buildBanking(data[0]);
                    personal.buildLending(data[1]);
                    personal.buildProtect(data[2]);
                    personal.buildSaving(data[3]);
                    let business: Business = new BusinessBuilder().build();
                    business.buildBanking(data[4]);
                    business.buildLending(data[5]);
                    business.buildProtect(data[6]);
                    this.fhc = new FhcBuilder().setPersonal(personal).setBusiness(business).build();
                    //this.bankList=data[7];
                    this.personalLeadingOther=this.fhc.personal.lending.lenderOther;
                    this.personalbankingOther=this.fhc.personal.banking.cashFlowOtherBank;
                    this.bussinessLeadingOther=this.fhc.business.lending.lenderOther;
                    this.bussinesbankingOther=this.fhc.personal.banking.cashFlowOtherBank;
                });
            }, error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
    }

    onSubmit() {
                if(!this.fhc.personal.banking.cashFlowOtherBank){
                     this.fhc.personal.banking.bankId='null';
                 }

                 if(!this.fhc.personal.lending.lenderOther){
                     this.fhc.personal.lending.bankId='null';
                 }
                 if(!this.fhc.business.lending.lenderOther ){
                      this.fhc.business.lending.bankId ='null';
                 }

                 if(!this.fhc.business.banking.cashFlowOtherBank){
                    this.fhc.business.banking.bankId='null'; 
                 }       
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        let fhcObservalble = Observable.forkJoin(
            this.fhc.personal.banking.id ? this.bankingProvider.updateBanking(this.fhc.personal.banking) : this.bankingProvider.createBanking(this.fhc.personal.banking),
            this.fhc.personal.lending.id ? this.lendingProvider.updateLending(this.fhc.personal.lending) : this.lendingProvider.createLending(this.fhc.personal.lending),
            this.fhc.personal.protect.id ? this.protectProvider.updateProtect(this.fhc.personal.protect) : this.protectProvider.createProtect(this.fhc.personal.protect),
            this.fhc.personal.saving.id ? this.savingProvider.updateSaving(this.fhc.personal.saving) : this.savingProvider.createSaving(this.fhc.personal.saving),
            this.fhc.business.banking.id ? this.businessBankingProvider.updateBanking(this.fhc.business.banking) : this.businessBankingProvider.createBanking(this.fhc.business.banking),
            this.fhc.business.lending.id ? this.businessLendingProvider.updateLending(this.fhc.business.lending) : this.businessLendingProvider.createLending(this.fhc.business.lending),
            this.fhc.business.protect.id ? this.businessProtectProvider.updateProtect(this.fhc.business.protect) : this.businessProtectProvider.createProtect(this.fhc.business.protect)
        );
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => fhcObservalble)
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'onSubmit', 'financial');
                    this.fhc.personal.buildBanking(data[0]);
                    this.fhc.personal.buildLending(data[1]);
                    this.fhc.personal.buildProtect(data[2]);
                    this.fhc.personal.buildSaving(data[3]);
                    this.fhc.business.buildBanking(data[4]);
                    this.fhc.business.buildLending(data[5]);
                    this.fhc.business.buildProtect(data[6]);
                }).then(() => {
                    let tabs: Tabs = this.navController.parent;
                    tabs.select(0);
                });
            }, error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    // ionViewDidLeave() {
             
    //     let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
    //     let fhcObservalble = Observable.forkJoin(
    //         this.cordovaProvider.checkMainApi(),
    //         this.fhc.personal.banking.id ? this.bankingProvider.updateBanking(this.fhc.personal.banking) : this.bankingProvider.createBanking(this.fhc.personal.banking),
    //         this.fhc.personal.lending.id ? this.lendingProvider.updateLending(this.fhc.personal.lending) : this.lendingProvider.createLending(this.fhc.personal.lending),
    //         this.fhc.personal.protect.id ? this.protectProvider.updateProtect(this.fhc.personal.protect) : this.protectProvider.createProtect(this.fhc.personal.protect),
    //         this.fhc.personal.saving.id ? this.savingProvider.updateSaving(this.fhc.personal.saving) : this.savingProvider.createSaving(this.fhc.personal.saving),
    //         this.fhc.business.banking.id ? this.businessBankingProvider.updateBanking(this.fhc.business.banking) : this.businessBankingProvider.createBanking(this.fhc.business.banking),
    //         this.fhc.business.lending.id ? this.businessLendingProvider.updateLending(this.fhc.business.lending) : this.businessLendingProvider.createLending(this.fhc.business.lending),
    //         this.fhc.business.protect.id ? this.businessProtectProvider.updateProtect(this.fhc.business.protect) : this.businessProtectProvider.createProtect(this.fhc.business.protect)
    //     );
    //     Observable.fromPromise(loading.present())
    //         .flatMap(data => fhcObservalble)
    //         .subscribe(data => {
    //             loading.dismiss().then(() => {
    //                 this.fhc.personal.buildBanking(data[0]);
    //                 this.fhc.personal.buildLending(data[1]);
    //                 this.fhc.personal.buildProtect(data[2]);
    //                 this.fhc.personal.buildSaving(data[3]);
    //                 this.fhc.business.buildBanking(data[4]);
    //                 this.fhc.business.buildLending(data[5]);
    //                 this.fhc.business.buildProtect(data[6]);
    //             }).then(() => {
    //                 let tabs: Tabs = this.navController.parent;
    //                 tabs.select(tabs.getSelected().index);
    //             });
    //         }, error =>
    //             loading.dismiss().then(() => this.appProvider.createAlert(error).present())
    //         );
    // }


    presentActionSheet(type) {
       let typeOfmodel=type;

            // if(typeOfmodel=='personalbanking'){
            //  this.navController.push(Add1Page)
            // }
            // if(typeOfmodel=='personallending'){
            //     this.navController.push(Add2Page)
            // }
            // if(typeOfmodel=='businessbanking'){
         let modal = this.modalCtrl.create(AddPage,
          {  
             typeOfmodel:typeOfmodel,
             perBanBankId:this.fhc.personal.banking.bankId,
             perLeaBankId:this.fhc.personal.lending.bankId,
             busBanBankId:this.fhc.business.banking.bankId,
             busLeaBankId:this.fhc.business.lending.bankId


         }, 
             {enableBackdropDismiss: false});
        modal.onDidDismiss(data => {
           // alert(JSON.stringify(data))
            if (data.personalBankingBank) {
                if(data.personalBankingBank=='other'){
                 this.fhc.personal.banking.cashFlowOtherBank=false;
                 this.fhc.personal.banking.bankId='null';
                }else{
                this.fhc.personal.banking.cashFlowOtherBank =true;
                this.fhc.personal.banking.bankId=data.personalBankingBank;   
                }                    
            }
            // else{
            //  this.fhc.personal.banking.cashFlowOtherBank =this.personalbankingOther;   
            // }
////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(data.personalLeadingBank) {
                if(data.personalLeadingBank=='other'){
                 this.fhc.personal.lending.lenderOther =false;
                 this.fhc.personal.lending.bankId='null';
                }else{
                this.fhc.personal.lending.lenderOther =true;
                this.fhc.personal.lending.bankId=data.personalLeadingBank;   
                }
               
            }
            // else{
            // this.fhc.personal.lending.lenderOther =this.personalLeadingOther;    
            // }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (data.businessLeadingBank) {
                if(data.businessLeadingBank=='other'){
                 this.fhc.business.lending.lenderOther =false;
                 this.fhc.business.lending.bankId='null';
                }else{
                this.fhc.business.lending.lenderOther =true;
                this.fhc.business.lending.bankId=data.businessLeadingBank;   
                }
                
            }
            // else{
            //   this.fhc.business.lending.lenderOther =this.bussinessLeadingOther;  
            // }
 ///////////////////////////////////////////////////////////////////////////////////////////////////////
                if(data.businessBankingBank) {
                     if(data.businessBankingBank=='other'){
                     this.fhc.business.banking.cashFlowOtherBank =false;
                     this.fhc.business.banking.bankId='null';
                    }else{
                    this.fhc.business.banking.cashFlowOtherBank =true;
                    this.fhc.business.banking.bankId=data.businessBankingBank; 
                    }    
                }
                // else{
                //  this.fhc.business.banking.cashFlowOtherBank =this.bussinesbankingOther;   
                // }


/////////////////////////////////////////////////////////////////////////////////////////////
                 if(this.fhc.personal.banking.bankId=='null'){
                   this.fhc.personal.banking.cashFlowOtherBank=false;
                 }
                 else if (!this.fhc.personal.banking.bankId){
                     this.fhc.personal.banking.cashFlowOtherBank=false;
                 }
                 else{
                     this.fhc.personal.banking.cashFlowOtherBank=true;
                 }
////////////////////////////////////////////////////////////////////////////////////////
                 if(this.fhc.personal.lending.bankId=='null'){
                     this.fhc.personal.lending.lenderOther=false;
                 }
                 else if (!this.fhc.personal.lending.bankId){
                     this.fhc.personal.lending.lenderOther=false;
                 }
                 else{
                     this.fhc.personal.lending.lenderOther=true;
                 }
/////////////////////////////////////////////////////////////////////////////////////
                 if(this.fhc.business.lending.bankId =='null'){
                      this.fhc.business.lending.lenderOther =false;
                 }
                  else if (!this.fhc.business.lending.bankId ){
                     this.fhc.business.lending.lenderOther=false;
                 }
                 else{
                     this.fhc.business.lending.lenderOther =true;
                 }
///////////////////////////////////////////////////////////////////////////////////////////////
                 if(this.fhc.business.banking.bankId =='null'){
                    this.fhc.business.banking.cashFlowOtherBank =false; 
                 }
                  else if (!this.fhc.business.banking.bankId){
                    this.fhc.business.banking.cashFlowOtherBank=false;
                 }
                 else{
                     this.fhc.business.banking.cashFlowOtherBank =true;
                 }         
            }
        );
        return modal.present();
   // }
   
  }
}
