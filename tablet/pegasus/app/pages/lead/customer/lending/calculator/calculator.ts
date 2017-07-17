import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../../providers/log";
import {AppProvider} from "../../../../../providers/app";
import {Observable} from "rxjs/Rx.KitchenSink";
import {RepaymentPage} from "./repayment";
import {CurrencyDirective} from "../../../../../directives/currency";
import {Lead} from "../../../../../models/lead";
import * as moment from "moment";
import {MORTGAGE_LOANS, AUTO_LOANS, BUSINESS_LOANS, PERSONAL_LOANS} from "../../../../../models/product";
import {RateProvider} from "../../../../../providers/rate";
import {CordovaProvider} from "../../../../../providers/cordova";
import {LendingRate} from "../../../../../models/rate";

@Component({
    templateUrl: 'build/pages/lead/customer/lending/calculator/calculator.html',
    pipes: [TranslatePipe],
    directives: [CurrencyDirective]
})
export class CalculatorPage implements OnInit {
    model: Lending;

    constructor(private appProvider: AppProvider,
                private loadingCtrl: LoadingController,
                private navController: NavController,
                private translateService: TranslateService,
                private logProvider: LogProvider,
                private cordovaProvider: CordovaProvider,
                private rateProvider: RateProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.rateProvider.readLendingRates())
            .subscribe(next => {
                loading.dismiss().then(() => this.model = new Lending(this.appProvider.current.lead, this.appProvider.current.suggestionData.suggestion.productType, Observable.from(next)));
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present());
            });
    }

    productNameOptions(): Observable<string[]> {
        return PRODUCTS
            .filter(f => f.productType === this.model.productType)
            .map(m => m.productName)
            .distinct()
            .toArray();
    }

    lendingPackageOptions(): Observable<string[]> {
        return this.model.lendingRates
            .filter(f => f.productName === this.model.productName)
            .map(m => m.lendingPackage)
            .distinct()
            .toArray();
    }

    hasCollateral(): Observable<boolean> {
        return COLLATERALS
            .count(c => c.productName === this.model.productName)
            .map(value => value > 0);
    }

    collateralOptions(): Observable<string[]> {
        return COLLATERALS
            .filter(f => f.productName === this.model.productName)
            .map(m => m.collateral)
            .distinct()
            .toArray();
    }

    hasManufactured(): boolean {
        return this.model.collateral === TRANSPORTATION;
    }

    //noinspection JSMethodCanBeStatic
    manufacturedOptions(): Observable<number[]> {
        return Observable
            .range(new Date().getFullYear() - 100, 101)
            .toArray()
            .map(m => m.reverse());
    }

    //noinspection JSMethodCanBeStatic
    ownersAgeOptions(): Observable<number[]> {
        return Observable
            .range(18, 101 - 18)
            .toArray();
    }

    ownershipOptions(): Observable<string[]> {
        return COLLATERALS
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.collateral === this.model.collateral)
            .map(m => m.ownership)
            .distinct()
            .toArray();
    }

    brandOptions(): Observable<string[]> {
        return COLLATERALS
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.collateral === this.model.collateral)
            .filter(f => f.ownership === this.model.ownership)
            .map(m => m.brand)
            .distinct()
            .toArray();
    }

    onProductNameChange(): void {
        this.model.lendingRates
            .filter(f => f.productName === this.model.productName)
            .first()
            .map(m => this.model.fromLendingPackage(m))
            .flatMap(() => COLLATERALS)
            .filter(f => f.productName === this.model.productName)
            .map(m => this.model.fromCollateral(m))
            .subscribe();
    }

    onLendingPackageChange(): void {
        this.model.lendingRates
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.lendingPackage === this.model.lendingPackage)
            .first()
            .map(m => this.model.fromLendingPackage(m))
            .subscribe();
    }

    onCollateralChange(): void {
        COLLATERALS
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.collateral === this.model.collateral)
            .first()
            .map(m => this.model.fromCollateral(m))
            .subscribe();
    }

    onOwnershipChange(): void {
        COLLATERALS
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.collateral === this.model.collateral)
            .filter(f => f.ownership === this.model.ownership)
            .first()
            .map(m => this.model.fromCollateral(m))
            .subscribe();
    }

    onBrandChange(): void {
        COLLATERALS
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.collateral === this.model.collateral)
            .filter(f => f.ownership === this.model.ownership)
            .filter(f => f.brand === this.model.brand)
            .first()
            .map(m => this.model.fromCollateral(m))
            .subscribe();
    }

    hasRepaymentSchedule() {
        return this.model.safeLoanAmount() > 0 && this.model.safeLoanTerm() > 0;
    }

    onRepaymentSchedule(): Promise<any> {
        return this.navController.push(RepaymentPage, {lending: this.model});
    }
}

interface Product {
    productType: string;
    productName: string;
}

interface Collateral {
    productName: string;
    collateral: string;
    ownership: string;
    brand?: string;
    term?: Function;
}

export class Lending {
    productName: string;
    lendingPackage: string;
    collateral: string;
    ownership: string;
    brand: string;
    manufactured: number;
    ownersAge: number;
    monthlyIncome: number;
    monthlyExpense: number;
    loanAmount: number;
    loanTerm: number;
    loanDate: Date;
    selectedProduct: Product;
    selectedLendingPackage: LendingRate;
    selectedCollateral: Collateral;

    advanceRepayment: boolean;
    advancedRepaymentPeriod: number;
    advancedRepaymentAmount: number;
    partialRepayment: boolean;
    optionsToRepay: string;

    constructor(private lead: Lead, public productType: string, public lendingRates: Observable<LendingRate>) {
        this.loanDate = new Date();
        PRODUCTS
            .filter(f => f.productType === this.productType)
            .first()
            .map(m => this.fromProduct(m))
            .flatMap(() => lendingRates)
            .filter(f => f.productName === this.productName)
            .first()
            .map(m => this.fromLendingPackage(m))
            .flatMap(() => COLLATERALS)
            .filter(f => f.productName === this.productName)
            .first()
            .map(m => this.fromCollateral(m))
            .subscribe(next => next, error => error);
    }

    fromProduct(product: Product): void {
        this.productName = product.productName;
        this.selectedProduct = product;
    }

    fromLendingPackage(lendingPackage: LendingRate): void {
        this.lendingPackage = lendingPackage.lendingPackage;
        this.selectedLendingPackage = lendingPackage;
    }

    fromCollateral(collateral: Collateral): void {
        this.collateral = collateral.collateral;
        this.ownership = collateral.ownership;
        this.brand = collateral.brand;
        this.manufactured = collateral.collateral === TRANSPORTATION ? new Date().getFullYear() : null;
        this.ownersAge = this.lead.dateOfBirth ? moment().diff(moment(this.lead.dateOfBirth), 'years') : 18;
        this.ownersAge = this.ownersAge < 18 ? 18 : this.ownersAge;
        this.ownersAge = this.ownersAge > 100 ? 100 : this.ownersAge;
        this.selectedCollateral = collateral;
    }

    safeLoanTerm() {
        return this.loanTerm ? Math.abs(this.loanTerm) : 0;
    }

    safeSelectedCollateralTerm(): number {
        return Math.min(this.selectedCollateral ? 12 * this.selectedCollateral.term(this.safeLoanAmount(), this.ownersAge, this.loanDate.getFullYear(), this.manufactured) : this.selectedLendingPackage.maxLoanTerm, this.selectedLendingPackage.maxLoanTerm);
    }

    calculatedLoanTerm(): number {
        return Math.min(this.safeLoanTerm(), this.safeSelectedCollateralTerm());
    }

    calculatedDueDate(): Date {
        return new Date(this.loanDate.getFullYear(), this.loanDate.getMonth() + this.calculatedLoanTerm(), this.loanDate.getDate());
    }

    calculatedRate(): number {
        return this.selectedLendingPackage ? this.selectedLendingPackage.honeymoonRate : null;
    }

    safeMonthlyIncome() {
        return this.monthlyIncome ? Math.abs(this.monthlyIncome) : 0;
    }

    safeMonthlyExpense() {
        return this.monthlyExpense ? Math.abs(this.monthlyExpense) : 0;
    }

    safeLoanAmount() {
        return this.loanAmount ? Math.abs(this.loanAmount) : 0;
    }

    safePrincipal() {
        return this.calculatedLoanTerm() > 0 ? this.safeLoanAmount() / this.calculatedLoanTerm() : 0;
    }

    safeInitialRate() {
        return this.selectedLendingPackage ? (this.selectedLendingPackage.honeymoonRate / 100) : 0;
    }

    calculatedMaxLoanAmount(): number {
        if (this.safeMonthlyIncome() == 0 || this.calculatedLoanTerm() == 0) {
            return 0;
        }
        let maxDTI = 0.8;
        if (this.safeMonthlyIncome() >= 10000000 && this.safeMonthlyIncome() < 20000000) {
            maxDTI = 0.4;
        } else if (this.safeMonthlyIncome() >= 20000000 && this.safeMonthlyIncome() < 60000000) {
            maxDTI = 0.75;
        }
        let remainingIncome = (this.safeMonthlyIncome() * maxDTI) - this.safeMonthlyExpense();
        let interestRate = (this.selectedLendingPackage.afterHoneymoonRate ? Math.max(this.selectedLendingPackage.honeymoonRate, this.selectedLendingPackage.afterHoneymoonRate) : this.selectedLendingPackage.honeymoonRate) / 100;
        let maximumLoanAmount = remainingIncome / ((1 / this.calculatedLoanTerm()) + (interestRate / 12));
        return this.selectedLendingPackage.maxLoanAmount ? Math.min(maximumLoanAmount, this.selectedLendingPackage.maxLoanAmount) : maximumLoanAmount;
    }

    safeAdvancedRepaymentAmount() {
        return this.advancedRepaymentAmount ? Math.abs(this.advancedRepaymentAmount) : 0;
    }
}

// product names
const RESIDENTIAL_HOME_LOAN = 'residential_home_loan';
const CONSTRUCTING_RENOVATING_HOME_LOAN = 'constructing_renovating_home_loan';
const UNDER_CONSTRUCTION_HOME_LOAN = 'under_construction_home_loan';
const AUTO_CONSUMER_LOAN = 'auto_consumer_loan';
const AUTO_BUSINESS_LOAN = 'auto_business_loan';
const WORKING_CAPITAL_SHORT_LOAN_FOR_IBL = 'working_capital_short_loan_for_ibl';
const WORKING_CAPITAL_MEDIUM_AND_LONG_TERM_LOAN_FOR_IBL = 'working_capital_medium_and_long_term_loan_for_ibl';
const FIXED_ASSET_INVESTMENT_FOR_IBL = 'fixed_asset_investment_for_ibl';
const SHARE_LOAN = 'share_loan';
const WORKING_CAPITAL_LOAN_FOR_MICRO_SME = 'working_capital_loan_for_micro_sme';
const FIXED_ASSET_INVESTMENT_FOR_MICRO_SME = 'fixed_asset_investment_for_micro_sme';
const SECURED_CONSUMER_LOAN = 'secured_consumer_loan';
const STUDENT_LOAN = 'student_loan';
const VALUABLE_PAPER_LOAN = 'valuable_paper_loan';
const SECURED_OVERDRAFT = 'secured_overdraft';

// collateral
const MORTGAGE = 'mortgage';
const TRANSPORTATION = 'transportation';
const VALUEABLE_PAPERS = 'valueable_papers';
const WITH_OWNERSHIP = 'with';
const THIRD_PARTY = '3rd_party';
const NA = 'na';
const GROUP_1 = 'group_1';
const GROUP_2 = 'group_2';

const PRODUCTS: Observable<Product> = Observable.of(
    {productType: MORTGAGE_LOANS, productName: RESIDENTIAL_HOME_LOAN},
    {productType: MORTGAGE_LOANS, productName: CONSTRUCTING_RENOVATING_HOME_LOAN},
    {productType: MORTGAGE_LOANS, productName: UNDER_CONSTRUCTION_HOME_LOAN},
    {productType: AUTO_LOANS, productName: AUTO_CONSUMER_LOAN},
    {productType: AUTO_LOANS, productName: AUTO_BUSINESS_LOAN},
    {productType: BUSINESS_LOANS, productName: WORKING_CAPITAL_SHORT_LOAN_FOR_IBL},
    {productType: BUSINESS_LOANS, productName: WORKING_CAPITAL_MEDIUM_AND_LONG_TERM_LOAN_FOR_IBL},
    {productType: BUSINESS_LOANS, productName: FIXED_ASSET_INVESTMENT_FOR_IBL},
    {productType: BUSINESS_LOANS, productName: SHARE_LOAN},
    {productType: BUSINESS_LOANS, productName: WORKING_CAPITAL_LOAN_FOR_MICRO_SME},
    {productType: BUSINESS_LOANS, productName: FIXED_ASSET_INVESTMENT_FOR_MICRO_SME},
    {productType: PERSONAL_LOANS, productName: SECURED_CONSUMER_LOAN},
    {productType: PERSONAL_LOANS, productName: STUDENT_LOAN},
    {productType: PERSONAL_LOANS, productName: VALUABLE_PAPER_LOAN},
    {productType: PERSONAL_LOANS, productName: SECURED_OVERDRAFT}
);

const COLLATERALS: Observable<Collateral> = Observable.of(
    {productName: RESIDENTIAL_HOME_LOAN, collateral: MORTGAGE, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 25)},
    {productName: RESIDENTIAL_HOME_LOAN, collateral: MORTGAGE, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 25)},
    {
        productName: RESIDENTIAL_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: RESIDENTIAL_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: RESIDENTIAL_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: RESIDENTIAL_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {productName: RESIDENTIAL_HOME_LOAN, collateral: VALUEABLE_PAPERS, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 25)},
    {productName: RESIDENTIAL_HOME_LOAN, collateral: VALUEABLE_PAPERS, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 25)},
    {productName: UNDER_CONSTRUCTION_HOME_LOAN, collateral: MORTGAGE, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 25)},
    {productName: UNDER_CONSTRUCTION_HOME_LOAN, collateral: MORTGAGE, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 25)},
    {
        productName: UNDER_CONSTRUCTION_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: UNDER_CONSTRUCTION_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: UNDER_CONSTRUCTION_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: UNDER_CONSTRUCTION_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), Math.abs(7 - (approved - manufactured)), 25)
    },
    {
        productName: UNDER_CONSTRUCTION_HOME_LOAN,
        collateral: VALUEABLE_PAPERS,
        ownership: WITH_OWNERSHIP,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 25)
    },
    {productName: UNDER_CONSTRUCTION_HOME_LOAN, collateral: VALUEABLE_PAPERS, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 25)},
    {productName: CONSTRUCTING_RENOVATING_HOME_LOAN, collateral: MORTGAGE, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 15)},
    {productName: CONSTRUCTING_RENOVATING_HOME_LOAN, collateral: MORTGAGE, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 15)},
    {
        productName: CONSTRUCTING_RENOVATING_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 15)
    },
    {
        productName: CONSTRUCTING_RENOVATING_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 15)
    },
    {
        productName: CONSTRUCTING_RENOVATING_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), Math.abs(7 - (approved - manufactured)), 15)
    },
    {
        productName: CONSTRUCTING_RENOVATING_HOME_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), Math.abs(7 - (approved - manufactured)), 15)
    },
    {
        productName: CONSTRUCTING_RENOVATING_HOME_LOAN,
        collateral: VALUEABLE_PAPERS,
        ownership: WITH_OWNERSHIP,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 15)
    },
    {
        productName: CONSTRUCTING_RENOVATING_HOME_LOAN,
        collateral: VALUEABLE_PAPERS,
        ownership: THIRD_PARTY,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 15)
    },
    {productName: AUTO_CONSUMER_LOAN, collateral: MORTGAGE, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 7)},
    {productName: AUTO_CONSUMER_LOAN, collateral: MORTGAGE, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {
        productName: AUTO_CONSUMER_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 7)
    },
    {
        productName: AUTO_CONSUMER_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 7)
    },
    {productName: AUTO_CONSUMER_LOAN, collateral: TRANSPORTATION, ownership: THIRD_PARTY, brand: GROUP_1, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {productName: AUTO_CONSUMER_LOAN, collateral: TRANSPORTATION, ownership: THIRD_PARTY, brand: GROUP_2, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {productName: AUTO_CONSUMER_LOAN, collateral: VALUEABLE_PAPERS, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 7)},
    {productName: AUTO_CONSUMER_LOAN, collateral: VALUEABLE_PAPERS, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {productName: AUTO_BUSINESS_LOAN, collateral: MORTGAGE, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 7)},
    {productName: AUTO_BUSINESS_LOAN, collateral: MORTGAGE, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {
        productName: AUTO_BUSINESS_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 7)
    },
    {
        productName: AUTO_BUSINESS_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(7 - (approved - manufactured)), 7)
    },
    {productName: AUTO_BUSINESS_LOAN, collateral: TRANSPORTATION, ownership: THIRD_PARTY, brand: GROUP_1, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {productName: AUTO_BUSINESS_LOAN, collateral: TRANSPORTATION, ownership: THIRD_PARTY, brand: GROUP_2, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {productName: AUTO_BUSINESS_LOAN, collateral: VALUEABLE_PAPERS, ownership: WITH_OWNERSHIP, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), 7)},
    {productName: AUTO_BUSINESS_LOAN, collateral: VALUEABLE_PAPERS, ownership: THIRD_PARTY, brand: NA, term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(80 - age), 7)},
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: MORTGAGE,
        ownership: WITH_OWNERSHIP,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(70 - age), 6)) : (Math.min(Math.abs(70 - age), 5))
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: MORTGAGE,
        ownership: THIRD_PARTY,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(80 - age), 6)) : (Math.min(Math.abs(70 - age), 5))
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(70 - age), Math.abs(5 - (approved - manufactured)), 6)) : (Math.min(Math.abs(70 - age), Math.abs(5 - (approved - manufactured)), 5))
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: TRANSPORTATION,
        ownership: WITH_OWNERSHIP,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => Math.min(Math.abs(70 - age), Math.abs(3 - (approved - manufactured)), 5)
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_1,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(70 - age), Math.abs(5 - (approved - manufactured)), 6)) : (Math.min(Math.abs(70 - age), Math.abs(5 - (approved - manufactured)), 5))
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: TRANSPORTATION,
        ownership: THIRD_PARTY,
        brand: GROUP_2,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(70 - age), Math.abs(3 - (approved - manufactured)), 6)) : (Math.min(Math.abs(70 - age), Math.abs(3 - (approved - manufactured)), 5))
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: VALUEABLE_PAPERS,
        ownership: WITH_OWNERSHIP,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(70 - age), 6)) : (Math.min(Math.abs(70 - age), 5))
    },
    {
        productName: SECURED_CONSUMER_LOAN,
        collateral: VALUEABLE_PAPERS,
        ownership: THIRD_PARTY,
        brand: NA,
        term: (loanAmount, age, approved, manufactured) => loanAmount > 500000000 ? (Math.min(Math.abs(80 - age), 6)) : (Math.min(Math.abs(70 - age), 5))
    }
);