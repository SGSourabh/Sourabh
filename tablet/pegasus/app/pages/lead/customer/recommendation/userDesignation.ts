import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams, LoadingController, NavController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {ProductData, PRODUCTS} from "../../../../models/product";
import {SuggestionProvider} from "../../../../providers/suggestion";
import {SelectionProvider} from "../../../../providers/selection";
import {LeadProvider} from "../../../../providers/lead";
import {Observable} from "rxjs";
import {Suggestion} from "../../../../models/suggestion";
// import {SuggestionData} from "./recommendation";
import {CordovaProvider} from "../../../../providers/cordova";
import {RecommendationPage} from "./recommendation"

@Component({
    templateUrl: 'build/pages/lead/customer/recommendation/userDesignation.html',
    pipes: [TranslatePipe],
    providers: [SuggestionProvider,LeadProvider,SelectionProvider]
})
export class userDesignationPage  {
    // private additions: SuggestionData[]
    userDesignation:any;
    selectionData:any;
    // user_id='vi.mai';
    user_id=localStorage['user_id'];

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private viewCtrl: ViewController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private navParams: NavParams,
                private suggestionProvider: SuggestionProvider,
                private selectionProvider: SelectionProvider,
                private leadProvider: LeadProvider,
                private navCtrl: NavController,
                private cordovaProvider: CordovaProvider) {
        this.userDesignation = this.navParams.get('userDesignation');
        this.selectionData = this.navParams.get('selectionData');
        logProvider.class(this);
    }

    ngOnInit() {
         
        console.log(this.userDesignation);
                    console.log(JSON.stringify( this.userDesignation));
                    console.log(JSON.stringify( this.selectionData))
        

    }


    onSelect(productData: any) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
             .flatMap(() => this.cordovaProvider.checkMainApi())
            //.flatMap(() => this.leadProvider.leadCopy(productData,this.selectionData.selection.productType))
            .flatMap(data => Observable.forkJoin(this.leadProvider.leadCopy(productData,this.selectionData.selection.productType) ,this.selectionProvider.patchSelection(this.selectionData.selection,this.selectionData.selection.suggestion,this.user_id)))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.navCtrl.push(RecommendationPage, {});
                    }),
                error =>
                    
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
    

    Dismiss() {
        this.viewCtrl.dismiss();
    }
}
