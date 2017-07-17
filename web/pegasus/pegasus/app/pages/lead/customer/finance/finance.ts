import {Component, OnInit} from "@angular/core";
import {LoadingController, NavController,ModalController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {Fhc, FhcBuilder} from "../../../../models/fhc";
import {Personal, PersonalBuilder} from "../../../../models/fhc/personal";
import {BankingProvider} from "../../../../providers/fhc/personal/banking";
import {LendingProvider} from "../../../../providers/fhc/personal/lending";
import {ProtectProvider} from "../../../../providers/fhc/personal/protect";
import {SavingProvider} from "../../../../providers/fhc/personal/saving";
import {Business, BusinessBuilder} from "../../../../models/fhc/business";
import {BankingProvider  as BusinessBankingProvider} from "../../../../providers/fhc/business/banking";
import {LendingProvider as BusinessLendingProvider} from "../../../../providers/fhc/business/lending";
import {ProtectProvider as BusinessProtectProvider} from "../../../../providers/fhc/business/protect";
import {BankProvider} from "../../../../providers/bank";
import {Observable} from "rxjs/Observable";
import {RecommendationPage} from "../recommendation/recommendation";
import {CordovaProvider} from "../../../../providers/cordova";
import {AddPage} from "./add";

@Component({
    templateUrl: 'build/pages/lead/customer/finance/finance.html',
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
export class FinancePage implements OnInit {
    section: boolean = false;
    fhc: Fhc;
    showBanking: boolean = false;
    showLending: boolean = false;
    showProtect: boolean = false;
    showSaving: boolean = false;
    showBusinessBanking: boolean = false;
    showBusinessLending: boolean = false;
    showBusinessProtect: boolean = false;
    activebuttonindu:boolean=true;
    activebuttonbuss:boolean=false;
    bankList:any;
   

    constructor(private loadingCtrl: LoadingController,
                private navController: NavController,
                private logProvider: LogProvider,
                private translateService: TranslateService,
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

    toggleShow(field: string) {
        let toggled = !this[field];
        if (this.section) {
            this.showBusinessBanking = false;
            this.showBusinessLending = false;
            this.showBusinessProtect = false;
        } else {
            this.showBanking = false;
            this.showLending = false;
            this.showProtect = false;
            this.showSaving = false;
        }
        this[field] = toggled;
    }

    ngOnInit() {
         var tittle=this.translateService.instant('lead.fhc.financial');
        this.cordovaProvider.trackView(tittle);
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        let fhcObservalble = Observable.forkJoin(
            this.bankingProvider.readBanking(this.appProvider.current.lead.id),
            this.lendingProvider.readLending(this.appProvider.current.lead.id),
            this.protectProvider.readProtect(this.appProvider.current.lead.id),
            this.savingProvider.readSaving(this.appProvider.current.lead.id),
            this.businessBankingProvider.readBanking(this.appProvider.current.lead.id),
            this.businessLendingProvider.readLending(this.appProvider.current.lead.id),
            this.businessProtectProvider.readProtect(this.appProvider.current.lead.id)
           // this.bankProvider.readBankList()
        );
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => fhcObservalble)
            .subscribe(data => {
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'finance');
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
                       // this.bankList=data[7];
                        console.log(JSON.stringify(this.bankList))
                    });
                }, error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
    }

    onSave(next: boolean) {
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
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
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
                        this.cordovaProvider.trackEvent('customer', 'onSave', 'finance');
                        this.fhc.personal.buildBanking(data[0]);
                        this.fhc.personal.buildLending(data[1]);
                        this.fhc.personal.buildProtect(data[2]);
                        this.fhc.personal.buildSaving(data[3]);
                        this.fhc.business.buildBanking(data[4]);
                        this.fhc.business.buildLending(data[5]);
                        this.fhc.business.buildProtect(data[6]);
                        if (this.appProvider.current.introduction) {
                            return next ? this.navController.push(RecommendationPage) : next;
                        }
                        this.navController.pop().then(() => next ? this.navController.push(RecommendationPage) : next);
                    });
                }, error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
    hideIndividual(){
        this.section  = false;
        this.activebuttonindu=true;
        this.activebuttonbuss=false;
         
    }
    showBusiness(){
         this.section  = true;
         this.activebuttonbuss=true;
         this.activebuttonindu=false;
    }


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
            if (data.personalBankingBank) {
                if(data.personalBankingBank=='other'){
                 this.fhc.personal.banking.cashFlowOtherBank=false;
                 this.fhc.personal.banking.bankId='null';
                }else{
                this.fhc.personal.banking.cashFlowOtherBank =true;
                this.fhc.personal.banking.bankId=data.personalBankingBank;   
                }                    
            }
            if(data.personalLeadingBank) {
                if(data.personalLeadingBank=='other'){
                 this.fhc.personal.lending.lenderOther =false;
                 this.fhc.personal.lending.bankId='null';
                }else{
                this.fhc.personal.lending.lenderOther =true;
                this.fhc.personal.lending.bankId=data.personalLeadingBank;   
                }
               
            }
            if (data.businessLeadingBank) {
                if(data.businessLeadingBank=='other'){
                 this.fhc.business.lending.lenderOther =false;
                 this.fhc.business.lending.bankId='null';
                }else{
                this.fhc.business.lending.lenderOther =true;
                this.fhc.business.lending.bankId=data.businessLeadingBank;   
                }
                
            }
            if(data.businessBankingBank) {
                 if(data.businessBankingBank=='other'){
                 this.fhc.business.banking.cashFlowOtherBank =false;
                 this.fhc.business.banking.bankId='null';
                }else{
                this.fhc.business.banking.cashFlowOtherBank =true;
                this.fhc.business.banking.bankId=data.businessBankingBank; 
                }    
            }          
        });
        return modal.present();
   // }
   
  }

}

