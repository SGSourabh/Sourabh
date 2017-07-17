import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Lending} from "../../../../../models/lending";
import {LendingProvider} from "../../../../../providers/lending";
import {AppProvider} from "../../../../../providers/app";
import {LogProvider} from "../../../../../providers/log";
import {PrintComponent} from "../../../../../components/print/print";
import {LookupProvider} from "../../../../../providers/lookup";
import {SelectionProvider} from "../../../../../providers/selection";
import {CordovaProvider} from "../../../../../providers/cordova";
import {CopayersPage} from "./copayers";
import {Observable} from "rxjs/Observable";
import {ThankYouPage} from "../../thank-you/thank-you";

@Component({
    templateUrl: 'build/pages/lead/customer/lending/application/application.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [LendingProvider, SelectionProvider]
})
export class ApplicationPage implements OnInit {
    lending: Lending;

    // ugly workaround until forms upgrade
    formInvalid: boolean;

    onForm(form): boolean {
        this.formInvalid = form && !form.form.valid;
        return false;
    }

    constructor(private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private navController: NavController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private lookupProvider: LookupProvider,
                private selectionProvider: SelectionProvider,
                private cordovaProvider: CordovaProvider,
                private lendingProvider: LendingProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        //alert(this.appProvider.current.selectionData.productData.product)
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => {
                if (this.appProvider.current.applicationId == null) {
                    let lending = new Lending({
                        selection: this.appProvider.current.selectionData.selection.id,
                        suggestion: this.appProvider.current.selectionData.selection.suggestion,
                        customerType: Object.keys(MAPPINGS[this.appProvider.current.selectionData.productData.product])[0],
                        productType:this.appProvider.current.selectionData.selection.productType
                    });
                    this.logProvider.info(lending);
                    this.logProvider.info(lending.customerType);
                    lending.productName = Object.keys(MAPPINGS[this.appProvider.current.selectionData.productData.product][lending.customerType])[0];
                    this.logProvider.info(lending.productName);
                    lending.loanPurpose = MAPPINGS[this.appProvider.current.selectionData.productData.product][lending.customerType][lending.productName][0]
                    this.logProvider.info(lending.loanPurpose);
                    return this.lendingProvider.createLending(lending);
                }
                return this.lendingProvider.readLending(this.appProvider.current.applicationId);
            }).subscribe(data =>
                loading.dismiss().then(() => {
                    this.lending = data;
                    this.lending.productType = this.appProvider.current.selectionData.productData.product;
                    if (this.appProvider.current.applicationId == null) {
                        this.appProvider.current.applicationId = this.lending.id;
                        this.lending.customerType = Object.keys(MAPPINGS[this.appProvider.current.selectionData.productData.product])[0];
                        return this.onCustomerTypeChange();
                    }
                }),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
        );
    }

    customerTypeOptions(): string[] {
        return Object.keys(MAPPINGS[this.appProvider.current.selectionData.productData.product]);
    }

    productNameOptions(): Observable<string[]> {
        return Observable.of(Object.keys(MAPPINGS[this.appProvider.current.selectionData.productData.product][this.lending.customerType]));
    }

    loanPurposeOptions(): Observable<string[]> {
        return Observable.of(MAPPINGS[this.appProvider.current.selectionData.productData.product][this.lending.customerType][this.lending.productName]);
    }

    onCustomerTypeChange() {
        this.lending.productName = Object.keys(MAPPINGS[this.appProvider.current.selectionData.productData.product][this.lending.customerType])[0];
        this.onProductNameChange();
    }

    onProductNameChange() {
        this.lending.loanPurpose = MAPPINGS[this.appProvider.current.selectionData.productData.product][this.lending.customerType][this.lending.productName][0];
    }

    onCopayers() {
        this.onNext(true);
    }

    onNext(copayer: boolean) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.lendingProvider.updateLending(this.lending))
            .subscribe(
                data =>
                    loading.dismiss().then(() => {
                        this.lending = data;
                        copayer ? this.navController.push(CopayersPage) : this.navController.setRoot(ThankYouPage, {applicationid: this.lending.id}, this.appProvider.navOptions);
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
}

// STRUCTURE
// {
//     "ProductType" : {
//         "CustomerType": {
//             "DisplayProductName": ["DisplayLoanPurpose", "..."]
//         }
//     }
// }
//:  Map<string, Map<string,  Map<string, Array<string>>>
const MAPPINGS = {
    "mortgage_loans": {
        "individual": {
            "residential_home_loan": [
                "right_to_use_land",
                "right_to_use_housing",
                "right_to_use_land_housing",
                "right_to_tenancy_government",
                "other"
            ],
            "construction_or_renovation": [
                "repair_complete_real_estate",
                "construct_repair_house",
                "repair_tenancy_government",
                "other"
            ],
            "under_construction": [
                "under_construction_home",
                "other"
            ]
        },
        "household": {
            "residential_home_loan": [
                "right_to_use_land",
                "right_to_use_housing",
                "right_to_use_land_housing",
                "right_to_tenancy_government",
                "other"
            ],
            "construction_or_renovation": [
                "repair_complete_real_estate",
                "construct_repair_house",
                "repair_tenancy_government",
                "other"
            ],
            "under_construction": [
                "under_construction_home",
                "other"
            ]
        }
    },
    "business_loans": {
        "individual": {
            "working_capital_loan": [
                "additional_short_term_working_capital",
                "additional_repayment_medium",
                "other"
            ],
            "fixed_asset_investment": [

                "purchase_machinery_equipment_transport",
                "purchase_business_location",
                "other"
            ],
            "market_vendor_loan": [
                "purchase_advance_capital",
                "additional_business_capital",
                "other"
            ],
            "share_loan": [
                "share_investment_loan",
                "share_business_loan",
                "cash_advance_share_loan",
                "other"
            ],
            "individual_guarantee": [
                "loan_guarantee",
                "payment_guarantee",
                "bidding_participation_guarantee",
                "contract_performance_guarantee",
                "full_advance_guarantee",
                "reciprocal_guarantee",
                "other"
            ],
            "auto_business_loan": [
                "buy_cars_household",
                "other"
            ],
            "other_loans_secured": [
                "additional_short_term_working_capital",
                "additional_repayment_medium",
                "purchase_machinery_equipment_transport",
                "purchase_business_location",
                "purchase_advance_capital",
                "additional_business_capital",
                "share_investment_loan",
                "share_business_loan",
                "cash_advance_share_loan",
                "loan_guarantee",
                "payment_guarantee",
                "bidding_participation_guarantee",
                "contract_performance_guarantee",
                "full_advance_guarantee",
                "reciprocal_guarantee",
                "buy_cars_household",
                "purcahse_lease_house",
                "other"
            ],
            "auto_business_loan_not_vib": [
                "buy_cars_household",
                "other"
            ],
            "working_capital_loan_fmcg": [
                "additional_short_term_working_capital",
                "additional_repayment_medium",
                "other"
            ],
            "fixed_asset_investment_fmcg": [
                "purchase_machinery_equipment_transport",
                "purchase_business_location",
                "other"
            ],
            "vinamilk_overdraft": [
                "vinamilk_secured_overdraft",
                "vinamilk_unsecured_overdraft",
                "other"
            ]
        },
        "household": {
            "working_capital_loan": [
                "additional_short_term_working_capital",
                "additional_repayment_medium",
                "other"
            ],
            "fixed_asset_investment": [

                "purchase_machinery_equipment_transport",
                "purchase_business_location",
                "other"
            ],
            "market_vendor_loan": [
                "purchase_advance_capital",
                "additional_business_capital",
                "other"
            ],
            "share_loan": [
                "share_investment_loan",
                "share_business_loan",
                "cash_advance_share_loan",
                "other"
            ],
            "individual_guarantee": [
                "loan_guarantee",
                "payment_guarantee",
                "bidding_participation_guarantee",
                "contract_performance_guarantee",
                "full_advance_guarantee",
                "reciprocal_guarantee",
                "other"
            ],
            "auto_business_loan": [
                "buy_cars_household",
                "other"
            ],
            "other_loans_secured": [
                "additional_short_term_working_capital",
                "additional_repayment_medium",
                "purchase_machinery_equipment_transport",
                "purchase_business_location",
                "purchase_advance_capital",
                "additional_business_capital",
                "share_investment_loan",
                "share_business_loan",
                "cash_advance_share_loan",
                "loan_guarantee",
                "payment_guarantee",
                "bidding_participation_guarantee",
                "contract_performance_guarantee",
                "full_advance_guarantee",
                "reciprocal_guarantee",
                "buy_cars_household",
                "purcahse_lease_house",
                "other"
            ],
            "auto_business_loan_not_vib": [
                "buy_cars_household",
                "other"
            ],
            "working_capital_loan_fmcg": [
                "additional_short_term_working_capital",
                "additional_repayment_medium",
                "other"
            ],
            "fixed_asset_investment_fmcg": [
                "purchase_machinery_equipment_transport",
                "purchase_business_location",
                "other"
            ],
            "vinamilk_overdraft": [
                "vinamilk_secured_overdraft",
                "vinamilk_unsecured_overdraft",
                "other"
            ]
        },
        "sme": {
            "short_term_loan_sme": [
                "additional_short_term_working_capital",
                "other"
            ],
            "medium_long_term_loan_sme": [
                "medium_long_term_financing",
                "other"
            ],
            "sme_guarantee": [
                "loan_guarantee",
                "payment_guarantee",
                "bidding_participation_guarantee",
                "contract_performance_guarantee",
                "full_advance_guarantee",
                "reciprocal_guarantee",
                "other"
            ],
            "other_business_loan": [
                "other"
            ],
            "auto_business_loan_corporate": [
                "buy_auto_business_activities",
                "other"
            ],
            "auto_business_loan_corporate_not_vib": [
                "buy_auto_business_activities",
                "other"
            ],
            "other_loans_secured": [
                "additional_short_term_working_capital",
                "loan_guarantee",
                "payment_guarantee",
                "bidding_participation_guarantee",
                "contract_performance_guarantee",
                "full_advance_guarantee",
                "reciprocal_guarantee",
                "other"
            ]
        }
    },
    "auto_loans": {
        "individual": {
            "auto_consumer_loan": [
                "buy_cars_4_9_seats",
                "buy_pickup_car",
                "other"
            ]
        },
        "household": {
            "auto_consumer_loan": [
                "buy_cars_4_9_seats",
                "buy_pickup_car",
                "other"
            ]
        }
    },
    "personal_loans": {
        "individual": {
            "secured_consumer_loan": [
                "purchase_stuff_house",
                "cost_sport_travel_study_research_health"
            ],
            "unsecured_consumer_loan": [
                "consumer_purpose"
            ],
            "overseas_study_loan": [
                "cost_overseas_study"
            ],
            "domestic_study_loan": [
                "cost_domestic_study"
            ],
            "reserved_credit_limit": [
                "credit_limit_redundancy"
            ],
            "financial_capability_determination_loan": [
                "financial_proven"
            ],
            "overdraft": [
                "secured_overdraft",
                "unsecured_overdraft",
            ],
            "other_consumer_loan": [
                "other"
            ],
            "other_loans_secured": [
                "right_to_use_housing",
                "right_to_use_land_housing",
                "right_to_tenancy_government",
                "repair_complete_real_estate",
                "construct_repair_house",
                "repair_tenancy_government",
                "under_construction_home",
                "buy_cars_4_9_seats",
                "buy_pickup_car",
                "purchase_stuff_house",
                "cost_sport_travel_study_research_health",
                "consumer_purpose"
            ]
        },
        "household": {
            "secured_consumer_loan": [
                "purchase_stuff_house",
                "cost_sport_travel_study_research_health"
            ],
            "unsecured_consumer_loan": [
                "consumer_purpose"
            ],
            "overseas_study_loan": [
                "cost_overseas_study"
            ],
            "domestic_study_loan": [
                "cost_domestic_study"
            ],
            "reserved_credit_limit": [
                "credit_limit_redundancy"
            ],
            "financial_capability_determination_loan": [
                "financial_proven"
            ],
            "overdraft": [
                "secured_overdraft",
                "unsecured_overdraft",
            ],
            "other_consumer_loan": [
                "other"
            ],
            "other_loans_secured": [
                "right_to_use_housing",
                "right_to_use_land_housing",
                "right_to_tenancy_government",
                "repair_complete_real_estate",
                "construct_repair_house",
                "repair_tenancy_government",
                "under_construction_home",
                "buy_cars_4_9_seats",
                "buy_pickup_car",
                "purchase_stuff_house",
                "cost_sport_travel_study_research_health",
                "consumer_purpose"
            ]
        }
    }
};

