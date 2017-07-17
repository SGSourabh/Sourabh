import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams, LoadingController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {ProductData, PRODUCTS} from "../../../../models/product";
import {SuggestionProvider} from "../../../../providers/suggestion";
import {Observable} from "rxjs";
import {Suggestion} from "../../../../models/suggestion";
import {SuggestionData} from "./recommendation";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/customer/recommendation/add.html',
    pipes: [TranslatePipe],
    providers: [SuggestionProvider]
})
export class AddPage implements OnInit {
    private additions: SuggestionData[];
    products: ProductData[];

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private viewCtrl: ViewController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private navParams: NavParams,
                private suggestionProvider: SuggestionProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.additions = [];
        this.products = PRODUCTS.filter(f => (<SuggestionData[]>this.navParams.data.suggestions).map(m => m.productData.product).indexOf(f.product) === -1);
    }

    onSelect(productData: ProductData) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.suggestionProvider.createSuggestion(new Suggestion({productType: productData.product})))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.additions.push({suggestion: data, productData: productData});
                        this.products = this.products.filter(f => f.product !== productData.product);
                        if (this.products.length === 0) {
                            this.onDismiss();
                        }
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onDismiss() {
        this.viewCtrl.dismiss({additions: this.additions});
    }
}
