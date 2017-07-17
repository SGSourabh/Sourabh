import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController, NavParams,AlertController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CurrentAccount} from "../../../../../models/current-account";
import {CurrentAccountProvider} from "../../../../../providers/current-account";
import {AppProvider} from "../../../../../providers/app";
import {LogProvider} from "../../../../../providers/log";
import {PrintComponent} from "../../../../../components/print/print";
import {LookupProvider} from "../../../../../providers/lookup";
import {CordovaProvider} from "../../../../../providers/cordova";
import {UserProvider} from "../../../../../providers/user";
import {LeadProvider} from "../../../../../providers/lead";
import {Customer} from "../../../../../models/customer";
import { Lead, LeadBuilder } from "../../../../../models/lead";
import {ThankYouPage} from "./../../thank-you/thank-you";
import {ApplicationPage as CurrentAccountApplicationPage} from "./application";
import {Observable} from "rxjs";

@Component({
    templateUrl: 'build/pages/lead/customer/current/application/current-application.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [CurrentAccountProvider,LeadProvider]
})
export class CurrentApplicationPage implements OnInit {
     // currentAccount:CurrentAccount;
     currentAccount;
    // currentAccount:Lead;
    customers: any;
    // ugly workaround until forms upgrade
    formInvalid: boolean;
    accountsumm:any;
    cif :any;
    validatebutton:any;
    nextbutton:any;
    showyesNo:any;
    accountSummery:any;
    lead:any;
    tempusername:string;
    tempbranch:string;
    temppurpose:string;
    applicationId:any;
    checkAccount:any;
    page:any
    status:boolean=false;

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
                public navParams: NavParams,
                private leadProvider: LeadProvider,
                public userProvider: UserProvider,
                public alertCtrl: AlertController,
                private cordovaProvider: CordovaProvider) {
         this.cif = this.navParams.get('cif');
         this.accountsumm=this.navParams.get('accountsumm');
         this.lead=this.navParams.get('lead');
         this.applicationId=this.navParams.get('applicationId')
         this.checkAccount=this.navParams.get('checkAccount')
         this.page=this.navParams.get('page');
         this.accountSummery="N";
        logProvider.class(this);
        this.currentAccount={}

    }

   ngOnInit() {
        var tittle=this.translateService.instant('lead.currentAccount.applicationInformation');
        this.cordovaProvider.trackView(tittle);
       if(this.applicationId){
        // this.accountsumm[0].accountCount=0;
        this.status=true;
       
        this.nextbutton=false;
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
             .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.currentAccountProvider.readCurrentAccount(this.applicationId))  
            .subscribe(data =>
                loading.dismiss().then(() => {
                    this.currentAccount = data;
                    this.currentAccount.status=this.translateService.instant('lead.currentAccount.'+this.currentAccount.status) 
                    this.currentAccount.branch=this.userProvider.userProfile.branchId;
                    this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'current-Application');  
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );
       }else{
         // alert(this.userProvider.userProfile.branch.length) 
            this.nextbutton=false;
            this.currentAccount.currentAddressLine1=this.lead['addressLine1'];
            this.currentAccount.currentAddressLine2=this.lead['addressLine2'];
            this.currentAccount.currentAddressLine3=this.lead['addressLine3'];
            this.currentAccount.currentAddressLine4=this.lead['addressLine4'];
            this.currentAccount.currentCity=this.lead['city'];
            this.currentAccount.currentState=this.lead['city'];
            this.currentAccount.currentZipCode=this.lead['zipcode'];
            this.currentAccount.currentCountry=this.lead['country'];
            this.currentAccount.username=this.lead['userName']
            this.currentAccount.maritalStatus=this.lead['maritalStatus'];
            this.currentAccount.dateOfBirth=this.lead['dateOfBirth']; 
            // if(this.userProvider.userProfile.branchId.length==2){
            //  this.currentAccount.branch='0'+this.userProvider.userProfile.branchId;
            //  }
            // else if(this.userProvider.userProfile.branchId.length==1){
            //  this.currentAccount.branch='00'+this.userProvider.userProfile.branchId;
            //  }else{
            //   this.currentAccount.branch=this.userProvider.userProfile.branch;   
              this.currentAccount.branch=this.userProvider.userProfile.branchId;   
            // }

              
            if(this.checkAccount[0].accountStatus=="600102"){
              
                this.accountSummery="Y";
                this.showyesNo=true;
                
            }else{
            	 this.accountSummery="N";
            }
           
            
            // else if(this.accountsumm[0].accountCount==1){
            //     this.validatebutton=false;
            //     this.accountSummery="Y";
            //     this.nextbutton=false;
            //     this.showyesNo=true;
            //         let alert = this.alertCtrl.create({
            //         title: this.translateService.instant('message.alert'),
            //         subTitle:this.translateService.instant('message.error2'),
            //         buttons: ['OK']
            //         });
            //         alert.present();
            // }
           }
    }

    onSave() {
         let partial;

       if(this.lead==undefined){
         partial = {
            userName: this.currentAccount.username,
            placeOfBirth:this.currentAccount.placeOfBirth,
            position:this.currentAccount.position,
            occupation:this.currentAccount.occupation,
            branch:this.currentAccount.branch,
            nationality:this.currentAccount.nationality,
            purpose:this.currentAccount.purpose
        }; 
       }else{
          partial = {
            userName: this.currentAccount.username,
            maritalStatus:this.lead.maritalStatus,
            dateOfBirth:this.lead.dateOfBirth,
            placeOfBirth:this.currentAccount.placeOfBirth,
            position:this.currentAccount.position,
            occupation:this.currentAccount.occupation,
            branch:this.currentAccount.branch,
            nationality:this.currentAccount.nationality,
            purpose:this.currentAccount.purpose
        };  
       }
        
       
        let mandatoryFields: string[] = [];
        if(!this.applicationId){
                if (!partial.userName) {
                    mandatoryFields.push(this.translateService.instant('registration.username'));
                }
                if (!partial.branch) {
                    mandatoryFields.push(this.translateService.instant('lead.currentAccount.branch'));
                }
            
        }
        if(this.lead!=undefined){
            if (!partial.maritalStatus) {
                mandatoryFields.push(this.translateService.instant('lead.currentAccount.maritalStatus'));
            }
            if (!partial.dateOfBirth) {
                mandatoryFields.push(this.translateService.instant('customer.dateOfBirth'));
            }
            if( this.checkAccount[0].accountStatus=="600102" ){
             if (!partial.purpose) {
                mandatoryFields.push(this.translateService.instant('lead.currentAccount.additionalAccount'));
            }
         }
        }
        if (!partial.placeOfBirth) {
            mandatoryFields.push(this.translateService.instant('lead.currentAccount.placeOfBirth'));
        }
        if (!partial.position) {
            mandatoryFields.push(this.translateService.instant('lead.currentAccount.position'));
        }
        if (!partial.occupation) {
            mandatoryFields.push(this.translateService.instant('lead.currentAccount.occupation'));
        }
        if (!partial.nationality) {
            mandatoryFields.push(this.translateService.instant('customer.nationality'));
        }
        
       
        if (mandatoryFields.length > 0) {
            this.alertCtrl
                .create({title: this.translateService.instant('message.mandatory'), message: mandatoryFields.join(', '), buttons: [this.translateService.instant('action.close')]})
                .present();
            return;
        }
         this.tempbranch=this.currentAccount.branch;
        this.tempusername=this.currentAccount.username;
        this.temppurpose=this.currentAccount.purpose;
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
              .flatMap(() => {
                if (this.appProvider.current.applicationId == null) {
                    return this.currentAccountProvider.createCurrentAccount(new CurrentAccount({
                        username :this.currentAccount.username,
                        selection: this.appProvider.current.selectionData.selection.id,
                        suggestion: this.appProvider.current.selectionData.selection.suggestion,
                        notes:this.appProvider.current.selectionData.selection.productType,
                        productType:this.appProvider.current.selectionData.selection.productType,
                        placeOfBirth:this.currentAccount.placeOfBirth,
                        position:this.currentAccount.position,
                        occupation:this.currentAccount.occupation,
                        branch:this.currentAccount.branch,
                        purpose:this.currentAccount.purpose,
                        nationality:this.currentAccount.nationality,  
                        maritalStatus:this.lead.maritalStatus,
                        dateOfBirth:this.lead.dateOfBirth,
                        currentAddressLine1:this.currentAccount.currentAddressLine1,
                        currentAddressLine2:this.currentAccount.currentAddressLine2,
                        currentAddressLine3:this.currentAccount.currentAddressLine3,
                        currentAddressLine4:this.currentAccount.currentAddressLine4,
                        currentCity:this.currentAccount.currentCity,
                        currentState:this.currentAccount.currentState,
                        currentZipCode:this.currentAccount.currentZipCode,
                        currentCountry:this.currentAccount.currentCountry,
                        permanentAddressLine1:this.currentAccount.permanentAddressLine1,
                        permanentAddressLine2:this.currentAccount.permanentAddressLine2,
                        permanentAddressLine3:this.currentAccount.permanentAddressLine3,
                        permanentAddressLine4:this.currentAccount.permanentAddressLine4,
                        permanentCity:this.currentAccount.permanentCity,
                        permanentState:this.currentAccount.permanentState,
                        permanentZipCode:this.currentAccount.permanentZipCode,
                        permanentCountry:this.currentAccount.permanentCountry,
                        additional_account:this.accountSummery,
                        applicationRefNr:this.accountSummery,
                        accountSummery:this.accountSummery
                    }));
                }
                return this.currentAccountProvider.updateCurrentAccount(this.currentAccount);
            })
            .subscribe(data => {
                loading.dismiss().then(() => {
                          this.currentAccount = data;
                          this.currentAccount.username=this.tempusername;
                          this.currentAccount.branch=this.tempbranch;
                          this.currentAccount.purpose=this.temppurpose;
                           this.nextbutton=true;
                           this.appProvider.current.applicationSelection=this.currentAccount.selection;
                           this.appProvider.current.applicationSuggestion=this.currentAccount.suggestion;
                           this.appProvider.current.applicationId=this.currentAccount.id;
                          // if(this.accountsumm!=undefined){
                          //     if(this.accountsumm[0].accountCount==0){
                          //       this.nextbutton=true;
                          //     }
                          // }else{
                          //      this.nextbutton=false;
                          // }
                          this.cordovaProvider.trackEvent('customer', 'onSave', 'current-Application'); 
                           let alert = this.alertCtrl.create({
                           title: this.translateService.instant('message.alert'),
                            subTitle: this.translateService.instant('message.success'),
                            buttons: [{
                            text: 'OK',
                            handler: () => {
                             this.onNext();
                            }}]
                            });
                            alert.present();
                                
                 })

               
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }

    onNext(){
        this.navController.setRoot(ThankYouPage, {applicationid: this.currentAccount.id}, this.appProvider.navOptions) 
    }

   
}
