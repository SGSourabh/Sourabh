import {Component, OnInit} from "@angular/core";
import {LogProvider} from "../../../../providers/log";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {NavController, LoadingController} from "ionic-angular";
import {Observable} from "rxjs";
import {CurrentAccountProvider} from "../../../../providers/current-account";
import {LendingProvider} from "../../../../providers/lending";
import {CurrentAccount} from "../../../../models/current-account";
import {Lending} from "../../../../models/lending";
import {ProductCategory, PRODUCTS} from "../../../../models/product";
import {AppProvider} from "../../../../providers/app";
import {ApplicationPage as CurrentAccountApplicationPage} from "../current/application/application";
import {ApplicationPage as LendingApplicationPage} from "../lending/application/application";
import {SelectionProvider} from "../../../../providers/selection";
import {SuggestionProvider} from "../../../../providers/suggestion";
import {CordovaProvider} from "../../../../providers/cordova";
import {CurrentApplicationPage} from "../current/application/current-application";

@Component({
    templateUrl: 'build/pages/lead/customer/applications/applications.html',
    pipes: [TranslatePipe],
    providers: [CurrentAccountProvider, LendingProvider, SuggestionProvider, SelectionProvider]
})
export class ApplicationsPage implements OnInit {
    applications: ApplicationData[];
    SuggestionBag
    SelectionBag
    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private navController: NavController,
                private appProvider: AppProvider,
                private translateService: TranslateService,
                private lendingProvider: LendingProvider,
                private currentAccountProvider: CurrentAccountProvider,
                private suggestionProvider: SuggestionProvider,
                private selectionProvider: SelectionProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.currentAccountProvider.readCurrentAccounts(), this.lendingProvider.readLendings()))
            .subscribe(data =>
                    loading.dismiss().then(() => {                  
                        let currents = (<CurrentAccount[]>data[0]).map(m => {
                            return {id: m.id, suggestion: m.suggestion, selection: m.selection, category: ProductCategory.CURRENT, productType:m.note,  created: m.created};
                        });
                        let lendings = (<Lending[]>data[1]).map(m => {
                            let cat
                            if(m.note=='mortgage_loans' || m.note=='auto_loans' ||  m.note=='business_loans' || m.note=='personal_loans'){
                             cat=ProductCategory.LENDING;
                            }else{
                              cat=ProductCategory.CURRENT;  
                            }
                            return {id: m.id, suggestion: m.suggestion, selection: m.selection, category: cat, productType:m.note, created: m.created};
                        });
                        this.applications = lendings; 
                        this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'applicationList');
                        var tittle=this.translateService.instant("lead.applications.applications");
                        this.cordovaProvider.trackView(tittle);           
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
    }

    categoryKey(productCategory: ProductCategory) {
        switch (productCategory) {
            case ProductCategory.CURRENT:
                return 'current';
            case ProductCategory.LENDING:
                return 'lending';
            default:
                this.appProvider.createAlert(this.translateService.instant('message.invalid'));
        }
    }

    
    onSelect(application: ApplicationData) {
        this.SuggestionBag ={
                            id:'null',
                            lead:application.id,
                            productType: application.productType,
                            productSalesGroup:'null',
                            creator: 'null',
                            created: 'null,'
                             }
                             this.SelectionBag={
                            id:' null',
                            suggestion:'null' ,
                            productType: application.productType,
                            productSalesGroup: 'null',
                            recipient:'null',
                            status:'null',
                            created:'null',
                            creator:'null',
                            updated:'null',
                            updator:'null' 
                        }

                        this.appProvider.current.applicationId = application.id;
                        let cat=application.productType
                        this.appProvider.current.suggestionData = {
                            suggestion: this.SuggestionBag,
                            productData: PRODUCTS.find(f => f.product === this.SuggestionBag.productType)
                        };
                        this.appProvider.current.selectionData = {
                            selection: this.SelectionBag,
                            productData: PRODUCTS.find(f => f.product === this.SelectionBag.productType)
                        };
                        if(cat=='auto_loans' || cat=='mortgage_loans'|| cat=='business_loans' || cat=='personal_loans'){
                 this.navController.push(LendingApplicationPage,{page:'application'});
             }
             else if(cat=='current_account'){
             this.navController.push(CurrentApplicationPage,{applicationId:application.id,page:'application'});    
         }else{
              this.navController.push(CurrentAccountApplicationPage,{page:'application'})
         }
        // let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        // Observable.fromPromise(loading.present())
        //     .flatMap(() => this.cordovaProvider.checkMainApi())
        //     .flatMap(data => Observable.forkJoin(this.suggestionProvider.readSuggestion(application.suggestion), this.selectionProvider.readSelection(application.selection, application.suggestion)))
        //     .subscribe(data =>
        //             loading.dismiss().then(() => {
        //                 this.cordovaProvider.trackEvent('customer', 'onSelect', 'applicationList'); 
        //                 this.appProvider.current.suggestionData = {
        //                     suggestion: data[0],
        //                     productData: PRODUCTS.find(f => f.product === data[0].productType)
        //                 };
        //                 this.appProvider.current.selectionData = {
        //                     selection: data[1],
        //                     productData: PRODUCTS.find(f => f.product === data[1].productType)
        //                 };
        //                 this.appProvider.current.applicationId = application.id;
        //                 switch (application.category) {
        //                     case ProductCategory.CURRENT:
        //                          if (this.appProvider.current.selectionData.productData.product == 'current_account') {
        //                                     return this.navController.push(CurrentApplicationPage,{applicationId:application.id});
        //                              } else {
        //                                     return this.navController.push(CurrentAccountApplicationPage);
        //                              }
        //                     case ProductCategory.LENDING:
        //                        return this.navController.push(LendingApplicationPage);
        //                     case ProductCategory.SAVING:
        //                         return this.navController.push(CurrentAccountApplicationPage);
        //                     case ProductCategory.CREDIT:
        //                         return this.navController.push(CurrentAccountApplicationPage);
        //                     case ProductCategory.DEBIT:
        //                         return this.navController.push(CurrentAccountApplicationPage);
        //                     default:
        //                         this.appProvider.createAlert(this.translateService.instant('message.invalid'));
        //                 }
        //             }),
        //         error =>
        //             loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        //     );
    }
}

export interface ApplicationData {
    id: number;
    suggestion: number;
    selection: number;
    category: ProductCategory;
    productType:string;
    created: string;
}
