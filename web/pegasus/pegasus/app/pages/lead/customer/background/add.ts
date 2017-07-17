import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams, LoadingController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {Background, BackgroundBuilder} from "../../../../models/background";
import {AppProvider} from "../../../../providers/app";
import {BackgroundProvider} from "../../../../providers/background";
import {CordovaProvider} from "../../../../providers/cordova";
import {Observable} from "rxjs/Observable";
import {GoalsPage} from "../goals/goals";

@Component({
    templateUrl: 'build/pages/lead/customer/background/add.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [BackgroundProvider]
})
export class AddPage implements OnInit {
   
  background:any;
  employmentType:any;
  employmentStatus:any;
  bussinessType:any;
  bussinessStatus:any;
  work:any;
  business:any;
  businessType:any;
  occupationType:any;

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private viewCtrl: ViewController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private navParams: NavParams,
                private cordovaProvider: CordovaProvider
               ) {
        logProvider.class(this);
        this.background='';
        this.employmentType='';
        this.bussinessType='';
        this.work = this.navParams.get('work');
        this.business = this.navParams.get('business');
        this.occupationType = this.navParams.get('occupationType');
        this.businessType = this.navParams.get('businessType');

    }

    ngOnInit() {
      this.employmentType=this.occupationType;
       this.bussinessType=this.businessType;
       var tittle=this.translateService.instant("action.add");
       this.cordovaProvider.trackView(tittle);
        // this.additions = [];
        // this.products = PRODUCTS.filter(f => (<SuggestionData[]>this.navParams.data.suggestions).map(m => m.productData.product).indexOf(f.product) === -1);
    }

    onEmploymentType(employment) {
        this.employmentStatus=employment;

        

        //alert(employment)
        this.onDismiss()
        
    }
    onbussinessStatus(status) {
        this.bussinessStatus=status;
       
        //alert(status)
        this.onDismiss()
        
    }

    onDismiss() {
        if(this.employmentStatus==undefined)
        {
         this.employmentStatus=null;   
        }
         if(this.bussinessStatus==undefined)
        {
         this.bussinessStatus=null;   
        }
        console.log(this.employmentStatus)
        this.viewCtrl.dismiss({employmentStatus:this.employmentStatus,bussinessStatus:this.bussinessStatus});
    }
}
