import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController, NavParams} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {AppProvider} from "../../../../providers/app";
import {LogProvider} from "../../../../providers/log";
import {SalesGroupData, ProductCategory, PLATINUM_DOUBLE_CASH_BACK, GOLD_CREDIT_CARD, PRODUCTS} from "../../../../models/product";
import {CalculatorPage as LendingCalculatorPage} from "../lending/calculator/calculator";
import {CalculatorPage as SavingCalculatorPage} from "../saving/calculator/calculator";
import {CalculatorPage as CardCalculatorPage} from "../card/calculator/calculator";
import {SuitabilityPage} from "../card/suitability/suitability";
import {Observable} from "rxjs";
import {Selection} from "../../../../models/selection";
import {SelectionProvider} from "../../../../providers/selection";
import {LikesProvider} from "../../../../providers/likes";
import {MorePage} from "./more";
import {RecommendationPage} from "../recommendation/recommendation";
import {CarouselPage} from "../carousel/carousel";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/customer/product/product.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [SelectionProvider,LikesProvider]
})
export class ProductPage implements OnInit {
     likesdata=[];
     newsalesgroupdata=[];
     newsalesgroupdatadelete=[];
     finalsalesgroupdata=[];
     array1=[];
     productType:any;
     pageCheck:any;

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private appProvider: AppProvider,
                private navCtrl: NavController,
                private translateService: TranslateService,
                private selectionProvider: SelectionProvider,
                private navParams: NavParams,
                private likesProvider: LikesProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
        this.pageCheck=this.navParams.get('selection');
    }

    ngOnInit() {
        var tittle=this.translateService.instant('lookup.productType.' + this.appProvider.current.suggestionData.suggestion.productType);
            this.cordovaProvider.trackView('Product List');
       if(this.pageCheck=='selection' || this.pageCheck=='image'){
          this.productType=this.appProvider.current.suggestionData.productData.product;
          this.array1=this.appProvider.current.suggestionData.productData.salesGroups;
          let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
          Observable
          .fromPromise(loading.present())
          //flatMap(() => this.cordovaProvider.checkMainApi())
          .flatMap(() => this.likesProvider.readLikes(this.productType))
          .subscribe(data =>loading.dismiss().then(() => {
               this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'product');
                this.likesdata = data;
                if(this.likesdata.length>0){
                      for (var i = 0; i < this.array1.length; i++) {
                          var obj = this.array1[i];
                          for (var j = 0; j < this.likesdata.length; j++) {
                              if ( this.likesdata[j]&&obj.salesGroup == this.likesdata[j].productSalesGroup) {
                                  var obj1=obj;
                                  for (let key in this.likesdata[j]) {
                                  obj1[key] = this.likesdata[j][key];
                                  }
                                  this.newsalesgroupdata.push(obj1);
                              }
                          }
                          for (let key in this.array1[i]) {
                          obj[key] = this.array1[i][key];
                          }
                          this.newsalesgroupdata.push(obj);
                      };
                this.finalsalesgroupdata=this.unique(this.newsalesgroupdata)
                }else{
                this.finalsalesgroupdata=this.unique(this.appProvider.current.suggestionData.productData.salesGroups)
                }

                }),
          error =>
          loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
          );
        } 

    }

    showSelect() {
        return this.appProvider.current.selections.findIndex(f => f.selection.productType === this.appProvider.current.suggestionData.suggestion.productType) === -1;
    }

    onSelect() {
        this.logProvider.info(this.appProvider.current.suggestionData.suggestion.productType);
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.selectionProvider.createSelection(new Selection({productType: this.appProvider.current.suggestionData.suggestion.productType}), this.appProvider.current.suggestionData.suggestion.id))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                      this.cordovaProvider.trackEvent('customer', 'onSelect', 'product');
                        let productData = PRODUCTS.find(f => f.product === data.productType);
                        if (!productData) {
                            return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.selection') + ' ' + this.translateService.instant('message.invalid')).present();
                        }
                        this.appProvider.current.selections.push({selection: data, productData: productData});
                        this.navCtrl.push(RecommendationPage,{suggestionCheck:'selection'});
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    showSuitability() {
        return this.appProvider.current.suggestionData.productData.category === ProductCategory.CREDIT;
    }

    onSuitability() {
        this.navCtrl.push(SuitabilityPage ,{selection:'selection'});
    }

    showCalculator(salesGroupData: SalesGroupData) {
        switch (this.appProvider.current.suggestionData.productData.category) {
            case ProductCategory.LENDING:
                return true;
            case ProductCategory.SAVING:
                return true;
            case ProductCategory.CREDIT:
                return [PLATINUM_DOUBLE_CASH_BACK, GOLD_CREDIT_CARD].indexOf(salesGroupData.salesGroup) !== -1;
            case ProductCategory.DEBIT:
                return true;
            default:
                return false;
        }
    }

    onLearnMore(salesGroupData: SalesGroupData) {
        this.appProvider.current.salesGroupData = salesGroupData;
        this.navCtrl.push(MorePage);
    }

    onCalculator(salesGroupData: SalesGroupData) {
        this.appProvider.current.salesGroupData = salesGroupData;
        switch (this.appProvider.current.suggestionData.productData.category) {
            case ProductCategory.LENDING:
                return this.navCtrl.push(LendingCalculatorPage,{selection:this.pageCheck});
            case ProductCategory.SAVING:
                return this.navCtrl.push(SavingCalculatorPage,{selection:this.pageCheck});
            case ProductCategory.CREDIT:
                return this.navCtrl.push(CardCalculatorPage,{selection:this.pageCheck});
            case ProductCategory.DEBIT:
                return this.navCtrl.push(CardCalculatorPage,{selection:this.pageCheck});
        }
    }

    onLike(salesGroupData:any) {
          salesGroupData.likeid='null';
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
             //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.likesProvider.createLikes(salesGroupData.salesGroup,this.productType))  
            .subscribe(data =>
                loading.dismiss().then(() => {
                     this.cordovaProvider.trackEvent('customer', 'nnLike', 'product');
                     this.likesdata = data;
                     this.ngOnInit();  
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );

    }


    onUnlike(salesGroupData: any) {
        salesGroupData.likeid='true';
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.likesProvider.deleteLikes(salesGroupData.id)) 
            .subscribe(data =>
                loading.dismiss().then(() => {
                   this.cordovaProvider.trackEvent('customer', 'onUnlike', 'product');
                    this.likesdata = [];
                    this.finalsalesgroupdata=[];
                    this.newsalesgroupdata=[];
                     this.update();       
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );

    }



    unique(array){
         return array.filter(function(el, index, arr) {
                  return index == arr.indexOf(el);     
              }); 
     }
     onback(){
    this.navCtrl.push(RecommendationPage ,{suggestionCheck:this.pageCheck});
    }
     update(){
          var array2=this.appProvider.current.suggestionData.productData.salesGroups;
          let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
          Observable
              .fromPromise(loading.present())
              //.flatMap(() => this.cordovaProvider.checkMainApi())
              .flatMap(() => this.likesProvider.readLikes(this.appProvider.current.suggestionData.suggestion.productType))
              .subscribe(data =>
                  loading.dismiss().then(() => {
                                   this.cordovaProvider.trackEvent('customer', 'update', 'product');
                                     var likesdata = data;
                                    for (var i = 0; i < array2.length; i++) {
                                        var obj = array2[i];
                                        for (var j = 0; j < likesdata.length; j++) {
                                            if ( likesdata[j]&&obj.salesGroup == likesdata[j].productSalesGroup) {
                                            var obj1=obj;
                                            for (let key in likesdata[j]) {
                                              obj1[key] = likesdata[j][key];
                                            }
                                            this.newsalesgroupdatadelete.push(obj1);
                                            }
                                        }
                                        for (let key in array2[i]) {
                                        obj[key] = array2[i][key];
                                        }
                                        this.newsalesgroupdatadelete.push(obj);
                                    };

                                    this.finalsalesgroupdata=this.unique(this.newsalesgroupdatadelete)
                                  }),
                            error =>
                                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
                        );
     }

}