import {Component} from "@angular/core";
import {ViewController, NavParams, LoadingController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {Background, BackgroundBuilder} from "../../../../models/background";
import {AppProvider} from "../../../../providers/app";
import {BackgroundProvider} from "../../../../providers/background";
import {Observable} from "rxjs/Observable";
import {GoalsPage} from "../goals/goals";
import {BankProvider} from "../../../../providers/bank";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/manager/financial/add.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [BackgroundProvider,BankProvider]
})
export class AddPage  {
   
  background:any;
  personalBankingBank:any;
  personalLeadingBank:any;
  businessBankingBank:any;
  businessLeadingBank:any;
  personalBankingBankList=[];
  personalLeadingBankList=[];
  businessBankingBankList=[];
  businessLeadingBankList=[];
  typeOfmodel:any;
  business:any;
  bankList:any;
  personalbanlingdata:any;
  personalleadingdata:any;
  businessbankingdata:any;
  businessleadingdata:any;
  perBanBankId:any;
  perLeaBankId:any;
  busBanBankId:any;
  busLeaBankId:any;
  perBanBankIdArray=[];
  perLeaBankIdArray=[];
  busBanBankIdArray=[];
  busLeaBankIdArray=[];
  flag:string;

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private viewCtrl: ViewController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private bankProvider: BankProvider,
                private navParams: NavParams,
                private cordovaProvider: CordovaProvider
               ) {
        logProvider.class(this);
        this.background='';       
        this.typeOfmodel = this.navParams.get('typeOfmodel');
        this.perBanBankId=this.navParams.get('perBanBankId');
        this.perLeaBankId=this.navParams.get('perLeaBankId');
        this.busBanBankId=this.navParams.get('busBanBankId');
        this.busLeaBankId=this.navParams.get('busLeaBankId');

    }

   ionViewDidEnter(){

             var tittle=this.translateService.instant('action.add');
            this.cordovaProvider.trackView(tittle);
       if(this.perBanBankId) {
         this.perBanBankIdArray =this.perBanBankId.split(',');
       }
       if(this.perLeaBankId) {
         this.perLeaBankIdArray =this.perLeaBankId.split(',');
       }
       if(this.busBanBankId) {
         this.busBanBankIdArray =this.busBanBankId.split(',');
       }
       if(this.busLeaBankId) {
         this.busLeaBankIdArray =this.busLeaBankId.split(',');
       }
       
       
      let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
            Observable.fromPromise(loading.present())
             .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.bankProvider.readBankList())
            .subscribe(data =>{
                    loading.dismiss();
                    this.cordovaProvider.trackEvent('manager', 'onViewDidEnter', 'financial add');
                    this.bankList=data;
                    if(this.typeOfmodel=='personalbanking'){
                        if(this.perBanBankIdArray.length>0){
                           for (var i = 0; i < this.bankList.length; i++) {
                               var obj = this.bankList[i];
                               for (var j = 0; j < this.perBanBankIdArray.length; j++) {
                                 if (obj.bankId == this.perBanBankIdArray[j]) {
                                    obj.SELECTED=true; 
                                 }

                               }
                               this.personalBankingBankList.push(obj);
                           }
                        }else{
                          this.personalBankingBankList=this.bankList;
                        }
                        
                    }



                    if(this.typeOfmodel=='personallending'){
                       if(this.perLeaBankIdArray.length>0){
                           for (var i = 0; i < this.bankList.length; i++) {
                               var obj = this.bankList[i];
                               for (var j = 0; j < this.perLeaBankIdArray.length; j++) {
                                 if (obj.bankId == this.perLeaBankIdArray[j]) {
                                    obj.SELECTED=true; 
                                 }

                               }
                               this.personalLeadingBankList.push(obj);
                           }
                        }else{
                          this.personalLeadingBankList=this.bankList;
                        }
                    }

                    if(this.typeOfmodel=='businessbanking'){
                       if(this.busBanBankIdArray.length>0){
                           for (var i = 0; i < this.bankList.length; i++) {
                               var obj = this.bankList[i];
                               for (var j = 0; j < this.busBanBankIdArray.length; j++) {
                                 if (obj.bankId == this.busBanBankIdArray[j]) {
                                    obj.SELECTED=true; 
                                 }

                               }
                               this.businessBankingBankList.push(obj);
                           }
                        }else{
                          this.businessBankingBankList=this.bankList;
                        }
                      }



                     if(this.typeOfmodel=='businesslending'){
                        if(this.busLeaBankIdArray.length>0){
                           for (var i = 0; i < this.bankList.length; i++) {
                               var obj = this.bankList[i];
                               for (var j = 0; j < this.busLeaBankIdArray.length; j++) {
                                 if (obj.bankId == this.busLeaBankIdArray[j]) {
                                    obj.SELECTED=true; 
                                 }

                               }
                               this.businessLeadingBankList.push(obj);
                           }
                        }else{
                          this.businessLeadingBankList=this.bankList;
                        }
                      }
                    // console.log(JSON.stringify(this.bankList))
                  }
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                );
 }

    onPersonalBanking(data) {
     // console.log(this.background)
     //  alert(JSON.stringify(data))
     this.flag="PersonalBanking";
       for(let i in data){
         if(data[i].SELECTED==true){
            if(!this.personalBankingBank){
              this.personalBankingBank=data[i].bankId;
            }else{
              this.personalBankingBank=this.personalBankingBank+','+data[i].bankId;
            }
          }
       }
       if(this.personalBankingBank==undefined){
         this.personalBankingBank='other';
       }
       this.onDismiss()      
    }
    onPersonalLeading(data) {
         this.flag="PersonalLeading";
        for(let i in data){
         if(data[i].SELECTED==true){
           if(!this.personalLeadingBank){
              this.personalLeadingBank=data[i].bankId;
            }else{
              this.personalLeadingBank=this.personalLeadingBank+','+data[i].bankId;
            }
         }
       }
       //alert(this.personalLeadingBank)
       if(this.personalLeadingBank==undefined){
         this.personalLeadingBank='other';
       }
      this.onDismiss() 
    }

    onBusinessLeading(data) {
      this.flag="BusinessLeading";
        for(let i in data){
         if(data[i].SELECTED==true){
            if(!this.businessLeadingBank){
              this.businessLeadingBank=data[i].bankId;
            }else{
              this.businessLeadingBank=this.businessLeadingBank+','+data[i].bankId;
            }
           }
       }
       if(this.businessLeadingBank==undefined){
         this.businessLeadingBank='other';
       }
       this.onDismiss()
        
    }
    onBusinessBanking(data) {
      this.flag="BusinessBanking";
        for(let i in data){
         if(data[i].SELECTED==true){
            if(!this.businessBankingBank){
              this.businessBankingBank=data[i].bankId;
            }else{
              this.businessBankingBank=this.businessBankingBank+','+data[i].bankId;
            }
         }
       }
       if(this.businessBankingBank==undefined){
         this.businessBankingBank='other';
       }
      this.onDismiss()      
    }

    onDismiss() {
        // if(!this.personalBankingBank)
        // {
        //  this.personalBankingBank=null;   
        // }
        //  if(!this.personalLeadingBank)
        // {
        //  this.personalLeadingBank=null;   
        // }
        // if(!this.businessLeadingBank)
        // {
        //  this.businessLeadingBank=null;   
        // }
        //  if(!this.businessBankingBank)
        // {
        //  this.businessBankingBank=null;   
        // }
        // console.log(this.personalBankingBank)
        // console.log(this.personalLeadingBank)
        // console.log(this.businessLeadingBank)
        // console.log(this.businessBankingBank)
        this.viewCtrl.dismiss({
  
          personalBankingBank:this.personalBankingBank,
          personalLeadingBank:this.personalLeadingBank,
          businessLeadingBank:this.businessLeadingBank,
          businessBankingBank:this.businessBankingBank,
          flag:this.flag
        });
    }
}
