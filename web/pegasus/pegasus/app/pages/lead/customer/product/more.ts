import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController,NavParams} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {AppProvider} from "../../../../providers/app";
import {LogProvider} from "../../../../providers/log";
import {SalesGroupData,PRODUCTS} from "../../../../models/product";
import {Observable} from "rxjs";
import {Selection} from "../../../../models/selection";
import {SelectionProvider} from "../../../../providers/selection";
import {CordovaProvider} from "../../../../providers/cordova";
import {LikesProvider} from "../../../../providers/likes";
import {RecommendationPage} from "../recommendation/recommendation";
import {CarouselPage} from "../carousel/carousel";

@Component({
    templateUrl: 'build/pages/lead/customer/product/more.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [SelectionProvider,LikesProvider]
})
export class MorePage implements OnInit {
    section: string;
    tabs_value:any;
    tabs_main:any
    tabsArray:any;
    likesdata :any;
    pageCheck:any;

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private appProvider: AppProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private selectionProvider: SelectionProvider,
                private likesProvider: LikesProvider,
                private navParams: NavParams,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
        this.pageCheck=this.navParams.get('selection');
    }

    ngOnInit() {
             var tittle=this.translateService.instant('lookup.productType.' + this.appProvider.current.suggestionData.suggestion.productType);
              this.cordovaProvider.trackView(tittle);
            this.tabsArray=this.appProvider.current.salesGroupData.tabs;
            this.section ="info";
            this.tabs_main=true;
            this.tabs_value=true;

         

    }
     showMore(){
         this.tabsArray=this.appProvider.current.salesGroupData.tabs;
       this.section ="info";
       this.tabs_value=false;
       this.tabs_main=false;  
     }
     hideMore(){
      this.tabsArray=this.appProvider.current.salesGroupData.tabs;
      this.section ="info";
       this.tabs_value=true;
       this.tabs_main=true;  
     }
    showSelect() {
        return this.appProvider.current.selections.findIndex(f => f.selection.productType === this.appProvider.current.suggestionData.suggestion.productType) === -1;
    }

    onSelect() {
        this.logProvider.info(this.appProvider.current.suggestionData.suggestion.productType);
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.selectionProvider.createSelection(new Selection({productType: this.appProvider.current.suggestionData.suggestion.productType}), this.appProvider.current.suggestionData.suggestion.id))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                         this.cordovaProvider.trackEvent('customer', 'onSelect', 'more');
                        let productData = PRODUCTS.find(f => f.product === data.productType);
                        if (!productData) {
                            return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.selection') + ' ' + this.translateService.instant('message.invalid')).present();
                        }
                        this.appProvider.current.selections.push({selection: data, productData: productData});
                         this.navController.push(RecommendationPage ,{suggestionCheck:'selection'});
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }



    onLike(salesGroupData: SalesGroupData) {
         salesGroupData.likeid='null';
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.likesProvider.createLikes(salesGroupData.salesGroup,this.appProvider.current.suggestionData.suggestion.productType))
               
            .subscribe(data =>
                loading.dismiss().then(() => {
                     this.cordovaProvider.trackEvent('customer', 'onLike', 'more');
                     this.appProvider.current.salesGroupData['id']=data.id;
                     this.ngOnInit();
                    
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );

    }


    onUnlike(salesGroupData: any) {
        salesGroupData.likeid='true';
        //alert(salesGroupData.id)
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.likesProvider.deleteLikes(salesGroupData.id))
               
            .subscribe(data =>
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('customer', 'onUnlike', 'more');
                    this.appProvider.current.salesGroupData['id'] = null;
                     this.ngOnInit();
                    
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );

    }

}
