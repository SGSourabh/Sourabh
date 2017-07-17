import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController, ModalController, PopoverController, NavParams} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {GoalsProvider} from "../../../../providers/goals";
import {SuggestionProvider} from "../../../../providers/suggestion";
import {ProductData, PRODUCTS, ProductCategory} from "../../../../models/product";
import {GoalData, GoalsBuilder, GOALS} from "../../../../models/goals";
import {AddPage} from "./add";
import {userDesignationPage} from "./userDesignation";
import {Observable} from "rxjs";
import {Suggestion} from "../../../../models/suggestion";
import {Selection} from "../../../../models/selection";
import {SelectionProvider} from "../../../../providers/selection";
import {LikesProvider} from "../../../../providers/likes";
import {ProductPage} from "../product/product";
import {CordovaProvider} from "../../../../providers/cordova";
import {ApplicationPage as CurrentAccountApplicationPage} from "../current/application/application";
import {ApplicationPage as LendingApplicationPage} from "../lending/application/application";
import {CurrentCustomerPage} from "../current/application/current-customer";
import {CurrentApplicationPage} from "../current/application/current-application";
import {CarouselPage} from "../carousel/carousel";

@Component({
    templateUrl: 'build/pages/lead/customer/recommendation/recommendation.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [GoalsProvider, SuggestionProvider, SelectionProvider, LikesProvider]
})
export class RecommendationPage implements OnInit {
    login: any;
    goals: GoalData[];
    suggestions: SuggestionData[];
    user_id = localStorage['user_id'];
    userDesignation: any;
    applybutton: any;
    likesdata = [];
    manualsuggestion=[];
    suggestionCheck:any;
    //user_id = 'vib_user';
    
    constructor(private navController: NavController,
                private loadingCtrl: LoadingController,
                private logProvider: LogProvider,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private goalsProvider: GoalsProvider,
                private navParams: NavParams,
                private suggestionProvider: SuggestionProvider,
                private selectionProvider: SelectionProvider,
                private modalCtrl: ModalController,
                private likesProvider: LikesProvider,
                private popCtrl: PopoverController,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
         this.suggestionCheck=this.navParams.get('suggestionCheck');
    }
    
    ngOnInit() {
         var tittle=this.translateService.instant('action.add');
            this.cordovaProvider.trackView('Recommendation');
         if(this.suggestionCheck=='selection'){
             let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.goalsProvider.readGoals(),  this.selectionProvider.readSelectionsByLead()))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'recommendation');
                        let _goals = new GoalsBuilder().setList(data[0]).build();
                        this.goals = GOALS.filter(f => _goals.existsByName(f.goal));
                        this.appProvider.current.selections = data[1].map(m => <SelectionData>{selection: m, productData: PRODUCTS.find(f => f.product === m.productType)});
                        if (this.appProvider.current.selections.length !== data[1].length) {
                            delete this.appProvider.current.selections;
                            return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.selection') + ' ' + this.translateService.instant('message.invalid')).present();
                        }
                        this.suggestions=this.appProvider.current.allsuggestionData.concat(this.appProvider.current.manualsuggestionData);
                       
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
         }
        else if(this.suggestionCheck=='image'){
            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        
        Observable.fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.goalsProvider.readGoals(), this.selectionProvider.readSelectionsByLead()))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'recommendation');
                        let _goals = new GoalsBuilder().setList(data[0]).build();
                        this.goals = GOALS.filter(f => _goals.existsByName(f.goal));
                        // this.suggestions = data[1].map(m => <SuggestionData>{suggestion: m, productData: PRODUCTS.find(f => f.product === m.productType)}).filter(f => f.productData);
                        //  this.appProvider.current.allsuggestionData=this.suggestions
                        //  var index=this.suggestions.length-1;
                        //  this.appProvider.current.suggestionData=this.suggestions[index]
                        // if(this.appProvider.current.manualsuggestionData){
                        //  this.suggestions = this.suggestions.concat(this.appProvider.current.manualsuggestionData);
                        // }else{
                        //   if (this.suggestions.length !== data[1].length) {
                        //     delete this.suggestions;
                        //     return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.suggestion') + ' ' + this.translateService.instant('message.invalid')).present();
                        //   }  
                        // }
                        
                        this.appProvider.current.selections = data[1].map(m => <SelectionData>{selection: m, productData: PRODUCTS.find(f => f.product === m.productType)});
                        if (this.appProvider.current.selections.length !== data[1].length) {
                            delete this.appProvider.current.selections;
                            return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.selection') + ' ' + this.translateService.instant('message.invalid')).present();
                        }
                         this.suggestions=this.appProvider.current.allsuggestionData.concat(this.appProvider.current.manualsuggestionData);
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
         }
        
         else{
              let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
             Observable.fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(this.goalsProvider.readGoals(), this.suggestionProvider.readSuggestions(), this.selectionProvider.readSelectionsByLead()))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'recommendation');
                        let _goals = new GoalsBuilder().setList(data[0]).build();
                        this.goals = GOALS.filter(f => _goals.existsByName(f.goal));
                        this.suggestions = data[1].map(m => <SuggestionData>{suggestion: m, productData: PRODUCTS.find(f => f.product === m.productType)}).filter(f => f.productData);
                         this.appProvider.current.allsuggestionData=this.suggestions
                         var index=this.suggestions.length-1;
                         this.appProvider.current.suggestionData=this.suggestions[index]
                        if(this.appProvider.current.manualsuggestionData){
                         this.suggestions = this.suggestions.concat(this.appProvider.current.manualsuggestionData);
                        }else{
                          if (this.suggestions.length !== data[1].length) {
                            delete this.suggestions;
                            return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.suggestion') + ' ' + this.translateService.instant('message.invalid')).present();
                          }  
                        }
                        
                        this.appProvider.current.selections = data[2].map(m => <SelectionData>{selection: m, productData: PRODUCTS.find(f => f.product === m.productType)});
                        if (this.appProvider.current.selections.length !== data[2].length) {
                            delete this.appProvider.current.selections;
                            return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.selection') + ' ' + this.translateService.instant('message.invalid')).present();
                        }
                       
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
         }
       
    }

    showAdd() {
        return this.appProvider.current.selections ? PRODUCTS.length !== this.appProvider.current.selections.length : false;
    }

    onAdd(): Promise<any> {
        this.manualsuggestion=this.appProvider.current.manualsuggestionData;
        let modal = this.modalCtrl.create(AddPage, {suggestions: this.suggestions}, {enableBackdropDismiss: false});
        modal.onDidDismiss(data => {
            if (!data || data.additions.length === 0) {
                return;
            }
            this.suggestions = this.suggestions.concat(data.additions);
            if(this.manualsuggestion.length===0) {
               this.manualsuggestion=data.additions;
            }
            else{
                this.manualsuggestion=this.manualsuggestion.concat(data.additions);
            }
            this.appProvider.current.manualsuggestionData=this.manualsuggestion;
        });
        return modal.present();
    }

    onExplore(suggestionData: SuggestionData) {
        console.log(JSON.stringify(suggestionData))
        this.appProvider.current.suggestionData = suggestionData;
        this.navController.push(ProductPage ,{selection:'selection'});
    }
     onExploreImage(selectionData: SelectionData) {
         console.log(JSON.stringify(selectionData))
         this.appProvider.current.suggestionData.suggestion.productType=selectionData.selection.productType;
        this.appProvider.current.suggestionData.productData = selectionData.productData;
        
        this.navController.push(ProductPage ,{selection:'image'});
    }

    onApply(selectionData: SelectionData) {
         console.log(JSON.stringify(selectionData))
        this.appProvider.current.selectionData = selectionData;
        delete this.appProvider.current.applicationId;
        switch (this.appProvider.current.selectionData.productData.category) {
            case ProductCategory.CURRENT:
                if (this.appProvider.current.selectionData.productData.product == 'current_account') {
                    return this.navController.push(CurrentCustomerPage);
                } else {
                    return this.navController.push(CurrentAccountApplicationPage);
                }
            case ProductCategory.LENDING:
                return this.navController.push(LendingApplicationPage);
            case ProductCategory.SAVING:
                return this.navController.push(CurrentAccountApplicationPage);
            case ProductCategory.CREDIT:
                return this.navController.push(CurrentAccountApplicationPage);
            case ProductCategory.DEBIT:
                return this.navController.push(CurrentAccountApplicationPage);
            default:
                this.appProvider.createAlert(this.translateService.instant('message.invalid'));


        }
    }

    onRefer(selectionData: any) {
        //alert(JSON.stringify(selectionData))

        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.selectionProvider.userDesignation(this.user_id))
            .subscribe(data => {
                    loading.dismiss()
                    this.cordovaProvider.trackEvent('customer', 'onRefer', 'recommendation');
                    this.userDesignation = data;
                    this.onReferSucc(selectionData);
                    console.log(this.userDesignation);
                    console.log(JSON.stringify(this.userDesignation));
                }, error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onRemove(selectionData: SelectionData) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            //.flatMap(() => this.cordovaProvider.checkMainApi())
            // .flatMap(data => Observable.forkJoin(this.selectionProvider.deleteSelection(selectionData.selection.id, selectionData.selection.suggestion), this.suggestionProvider.readSuggestions()))
            // .subscribe(data =>
              .flatMap(() => this.selectionProvider.deleteSelection(selectionData.selection.id, selectionData.selection.suggestion))
            
            .subscribe(() =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'onRemove', 'recommendation');
                        this.appProvider.current.selections = this.appProvider.current.selections.filter(f => f.selection.id !== selectionData.selection.id);
                        // this.suggestions = data[1].map(m => <SuggestionData>{suggestion: m, productData: PRODUCTS.find(f => f.product === m.productType)}).filter(f => f.productData);
                        // if (this.suggestions.length !== data[1].length) {
                            // delete this.suggestions;
                            // return this.appProvider.createAlert(this.translateService.instant('lead.recommendations.suggestion') + ' ' + this.translateService.instant('message.invalid')).present();
                        // }
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }


    onReferSucc(selectionData: any) {
        // alert(JSON.stringify(selectionData))
        this.navController.push(userDesignationPage, {userDesignation: this.userDesignation, selectionData: selectionData});

    }

    onback(){
    this.navController.setRoot(CarouselPage);
    }
}

export interface SelectionData {
    selection: Selection;
    productData: ProductData;
}

export interface SuggestionData {
    suggestion: Suggestion;
    productData: ProductData;
}