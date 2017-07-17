import {Component, OnInit} from "@angular/core";
import {LoadingController, AlertController, NavController,ActionSheetController,ModalController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {Background, BackgroundBuilder} from "../../../../models/background";
import {AppProvider} from "../../../../providers/app";
import {BackgroundProvider} from "../../../../providers/background";
import {Observable} from "rxjs/Observable";
import {GoalsPage} from "../goals/goals";
import {CordovaProvider} from "../../../../providers/cordova";
import {AddPage} from "./add";

@Component({
    templateUrl: 'build/pages/lead/customer/background/background.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [BackgroundProvider]
})
export class BackgroundPage implements OnInit {
    background: Background;

    constructor(private loadingCtrl: LoadingController,
                private navController: NavController,
                private alertController: AlertController,
                private logProvider: LogProvider,
                private actionSheetCtrl: ActionSheetController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private modalCtrl: ModalController,
                private backgroundProvider: BackgroundProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.backgroundProvider.readBackground(this.appProvider.current.lead.id))
            .subscribe(data => {
                loading.dismiss().then(() =>{ 
                    this.background = new BackgroundBuilder().fromBackground(data).build();
                    this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'background'); 
                    var tittle=this.translateService.instant("lead.background.background");
                    this.cordovaProvider.trackView(tittle);  
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present());
            });
    }

    toggleBackground(key: string, value: any) {
        console.log(key+''+value);
        this.background[key] = value;
    }
    // toggleBackground2(key: string, value: any) {
    //     console.log(key+''+value);
    //     this.background[key] = this.background[key]  : value;
    // }

    presentActionSheet(type) {
       if(type=='work_for_a_company'){
           var work=type;
       }else{
        var work=null;   
       }
       if(type=='business'){
           var business=type;
       }else{
          var business=null; 
       }


         let modal = this.modalCtrl.create(AddPage, {work:work,business:business,occupationType:this.background.occupationType,businessType:this.background.businessType}, {enableBackdropDismiss: false});
        modal.onDidDismiss(data => {
            if (data.employmentStatus) {
                this.background['employment']='work_for_a_company';
                this.background['occupationType']=data.employmentStatus;
            }
            if(data.bussinessStatus) {
                this.background['businessState']='business';
                this.background['businessType']=data.bussinessStatus;
            }
            // this.suggestions = this.suggestions.concat(data.additions);
        });
        return modal.present();
    //   this.toggleBackground('employment', 'work_for_a_company')
    // let actionSheet = this.actionSheetCtrl.create({
    //   title: this.translateService.instant('lead.background.employmentType'),
    //   buttons: [
    //     {
    //       text: this.translateService.instant('lookup.employmentType.civil_servant'),
    //       handler: () => {
    //           this.background['employmentType']='civil_servant';
    //         console.log('Archive clicked');
    //       }
    //     },
    //     {
    //       text: this.translateService.instant('lookup.employmentType.management_level'),
    //       handler: () => {
    //           this.background['employmentType']='management_level';
    //         console.log('Archive clicked');
    //       }
    //     },
    //     {
    //       text: this.translateService.instant('lookup.employmentType.professional_employee'),
    //       handler: () => {
    //            this.background['employmentType']='professional_employee';
    //         console.log('Archive clicked');
    //       }
    //     },
    //     {
    //       text: this.translateService.instant('lookup.employmentType.direct_employee'),
    //       handler: () => {
    //          this.background['employmentType']='direct_employee';
    //         console.log('Archive clicked');
    //       }
    //     },
    //     {
    //       text: this.translateService.instant('lookup.employmentType.staff_level'),
    //       handler: () => {
    //           this.background['employmentType']='staff_level';
    //         console.log('Archive clicked');
    //       }
    //     },
    //   ]
    // });
    // actionSheet.present();
  }

    onSave(next: boolean) {
        console.log(this.background.employment);
        if(this.background.employment==null ||this.background.employment=='null'){
            this.background.employment='other';
        }
       
        let partial = {
            education: this.background.education,
            employment: this.background.employment,
            ownership: this.background.ownership,
            residential: this.background.residential,
            insuranceLife: this.background.insuranceLife,
            insuranceGeneral: this.background.insuranceGeneral,
            accumulativeCar: this.background.accumulativeCar,
            accumulativeOther: this.background.accumulativeOther,
            classification: this.background.classification,
            bnessSusitate: this.background.businessState,
            occupationType: this.background.occupationType,
            businessType: this.background.businessType,
        };
       
        let mandatoryFields: string[] = [];
        if (!partial.education) {
            mandatoryFields.push(this.translateService.instant('lead.background.education'));
        }
        if (!partial.ownership) {
            mandatoryFields.push(this.translateService.instant('lead.background.ownership'));
        }
        if (!partial.residential) {
            mandatoryFields.push(this.translateService.instant('lead.background.residential'));
        }
        if (!partial.classification) {
            mandatoryFields.push(this.translateService.instant('lead.background.classification'));
        }
        // if(partial.classification=='trading_household' || partial.classification=='sme' )
        // {
        //       if (!partial.businessState) {
        //         mandatoryFields.push(this.translateService.instant('lead.background.businessState'));
        //     }
        // }
         if(partial.classification=='individual' )
        {
                 if (partial.employment=='other') {
                    mandatoryFields.push(this.translateService.instant('lead.background.employment'));
                }
                 
        }
        if (partial.employment=='work_for_a_company') {
                  if (!partial.occupationType) {
                    mandatoryFields.push(this.translateService.instant('lead.background.employmentType'));
                }
              }

          if (partial.bnessSusitate=='business') {
                if (!partial.businessType) {
                    mandatoryFields.push(this.translateService.instant('lead.background.businessType'));
                }
              }
      
          if (partial.employment!='work_for_a_company') {
                   partial.occupationType=null;
              }

          if (partial.bnessSusitate!='business') {
                   partial.businessType=null;
              }

       
        if (mandatoryFields.length > 0) {
            this.alertController
                .create({title: this.translateService.instant('message.mandatory'), message: mandatoryFields.join(', '), buttons: [this.translateService.instant('action.close')]})
                .present();
            return;
        }
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.background.id ? this.backgroundProvider.partialUpdateBackground(this.background.id, partial) : this.backgroundProvider.createBackground(this.background))
            .subscribe(data => {
                loading.dismiss().then(() => {
                    this.background = new BackgroundBuilder().fromBackground(data).build();
                    this.cordovaProvider.trackEvent('customer', 'onSave', 'background');
                    if (this.appProvider.current.introduction) {
                        return next ? this.navController.push(GoalsPage) : next
                    }
                    this.navController.pop().then(() => next ? this.navController.push(GoalsPage) : next);
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }

}
