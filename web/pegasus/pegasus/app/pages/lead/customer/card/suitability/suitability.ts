import {Component, OnInit} from "@angular/core";
import {NavController, ModalController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../../providers/log";
import {AppProvider} from "../../../../../providers/app";
import {CurrencyDirective} from "../../../../../directives/currency";
import {LookupProvider} from "../../../../../providers/lookup";
import {CordovaProvider} from "../../../../../providers/cordova";
import {SearchPage} from "./search";

@Component({
    templateUrl: 'build/pages/lead/customer/card/suitability/suitability.html',
    pipes: [TranslatePipe],
    directives: [CurrencyDirective]
})
export class SuitabilityPage implements OnInit {
    model: Suitability;
    policyOptions: string[];
    yesNoOptions: string[];
    jobGradeOptions: number[];
    depositOwnershipOptions: string[];
    currencyOptions: string[];
    nationalityOptions: string[];
    durationOptions: string[];
    creditBankOptions: string[];
    businessLifeOptions: string[];
    positionOptions: string[];

    constructor(private appProvider: AppProvider,
                private navController: NavController,
                private logProvider: LogProvider,
                private translateService: TranslateService,
                private lookupProvider: LookupProvider,
                private modalCtrl: ModalController,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
             var tittle=this.translateService.instant('lookup.productType.' + this.appProvider.current.suggestionData.suggestion.productType)+''+this.translateService.instant('lead.card.suitability.suitability');
             this.cordovaProvider.trackView(tittle); 
        this.model = new Suitability(this.appProvider.current.suggestionData.suggestion.productType);

        let policyObservable = this.lookupProvider.translations('lead.card.suitability.lookup.policy');
        policyObservable.first().subscribe(next => this.model.policy = next);
        policyObservable.toArray().subscribe(next => this.policyOptions = next);

        let yesNoObservable = this.lookupProvider.translations('lead.card.suitability.lookup.yesNo');
        yesNoObservable.first().subscribe(next => this.model.haveYouPassedPropationAndSignOfficialContractWithVib = this.model.isThisCollateralFrozenToSecureForAnyLoanCard = next);
        yesNoObservable.toArray().subscribe(next => this.yesNoOptions = next);

        let jobGradeObservable = this.lookupProvider.translations('lead.card.suitability.lookup.jobGrade').map(m => Number(m));
        jobGradeObservable.first().subscribe(next => this.model.whatIsYourGradeLevel = next);
        jobGradeObservable.toArray().subscribe(next => this.jobGradeOptions = next);

        let depositOwnershipObservable = this.lookupProvider.translations('lead.card.suitability.lookup.depositOwnership');
        depositOwnershipObservable.first().subscribe(next => this.model.ownershipOfSavingBookOrCertificateOfDeposit = next);
        depositOwnershipObservable.toArray().subscribe(next => this.depositOwnershipOptions = next);

        let currencyObservable = this.lookupProvider.translations('lead.card.suitability.lookup.currency');
        currencyObservable.first().subscribe(next => this.model.currencyOfTheTermDeposit = next);
        currencyObservable.toArray().subscribe(next => this.currencyOptions = next);

        let nationalityObservable = this.lookupProvider.translations('lead.card.suitability.lookup.nationality');
        nationalityObservable.first().subscribe(next => this.model.areYouAVietnameseOrForeigner = next);
        nationalityObservable.toArray().subscribe(next => this.nationalityOptions = next);

        let durationObservable = this.lookupProvider.translations('lead.card.suitability.lookup.duration');
        durationObservable.first().subscribe(next => this.model.whatIsTenorOfYourCurrentLaborContract = this.model.howLongHaveYouUsedThisCreditCard = this.model.howLongDoYouHaveBeenVnAirlineMembership = next);
        durationObservable.toArray().subscribe(next => this.durationOptions = next);

        let creditBankObservable = this.lookupProvider.translations('lead.card.suitability.lookup.creditBank');
        creditBankObservable.first().subscribe(next => this.model.whichBankDoYouHaveCreditCardsAt = next);
        creditBankObservable.toArray().subscribe(next => this.creditBankOptions = next);

        let businessLifeObservable = this.lookupProvider.translations('lead.card.suitability.lookup.businessLife');
        businessLifeObservable.first().subscribe(next => this.model.howLongYourCompanyHasRun = next);
        businessLifeObservable.toArray().subscribe(next => this.businessLifeOptions = next);

        let companyObservable = this.lookupProvider.translations('lead.card.suitability.lookup.company');
        companyObservable.first().subscribe(next => this.model.whichCompanyDoYouWorkFor = this.translateService.instant('lead.card.suitability.lookup.company.' + next));

        let positionObservable = this.lookupProvider.translations('lead.card.suitability.lookup.position');
        positionObservable.first().subscribe(next => this.model.whichIsYourPositionInYourCompany = next);
        positionObservable.toArray().subscribe(next => this.positionOptions = next);
    }

    showQuestion(question: string): boolean {
        return QUESTION_POLICIES[question].indexOf(this.model.policy) > -1;
    }

    onSearchCompany(): Promise<any> {
        let modal = this.modalCtrl.create(SearchPage, {}, {enableBackdropDismiss: false});
        modal.onDidDismiss(company => company ? this.model.whichCompanyDoYouWorkFor = company : company);
        return modal.present();
    }
}

class Suitability {
    policy: string;
    haveYouPassedPropationAndSignOfficialContractWithVib: string;
    whatIsYourGradeLevel: number;
    ownershipOfSavingBookOrCertificateOfDeposit: string;
    isThisCollateralFrozenToSecureForAnyLoanCard: string;
    valueOfTheTermDeposit: number;
    currencyOfTheTermDeposit: string;
    areYouAVietnameseOrForeigner: string;
    whatIsYourApproximateMonthlySalary: number;
    whatIsTenorOfYourCurrentLaborContract: string;
    whichBankDoYouHaveCreditCardsAt: string;
    howLongHaveYouUsedThisCreditCard: string;
    whatIsTheLimitOfThatCreditCard: number;
    howLongDoYouHaveBeenVnAirlineMembership: string;
    howLongYourCompanyHasRun: string;
    howMuchIsYourMonthlyBusinessIncome: number;
    whichCompanyDoYouWorkFor: string;
    whichIsYourPositionInYourCompany: string;

    constructor(private productType: string) {
        this.valueOfTheTermDeposit = 0;
    }

    calculatedResult() {
        switch (this.policy) {
            case VIB_STAFF: {
                return !(this.haveYouPassedPropationAndSignOfficialContractWithVib === NO && this.whatIsYourGradeLevel < 11);
            }
            case SECURED: {
                if (!this.valueOfTheTermDeposit) {
                    return false;
                }
                if (this.ownershipOfSavingBookOrCertificateOfDeposit === OTHER || this.isThisCollateralFrozenToSecureForAnyLoanCard === YES) {
                    return false;
                }
                return Math.abs(this.valueOfTheTermDeposit) >= 10000000;
            }
            case CARD_TO_CARD: {
                if (!this.whatIsYourApproximateMonthlySalary || !this.whatIsTheLimitOfThatCreditCard) {
                    return false;
                }
                if (this.areYouAVietnameseOrForeigner === VIETNAMESE && Math.abs(this.whatIsYourApproximateMonthlySalary) < 6000000) {
                    return false;
                }
                if (this.areYouAVietnameseOrForeigner === FOREIGNERS && Math.abs(this.whatIsYourApproximateMonthlySalary) < 45000000) {
                    return false;
                }
                if (this.whichBankDoYouHaveCreditCardsAt === OTHER || this.whatIsTenorOfYourCurrentLaborContract === UNDER_1_YEAR || this.howLongHaveYouUsedThisCreditCard === UNDER_1_YEAR) {
                    return false;
                }
                return Math.abs(this.whatIsTheLimitOfThatCreditCard) >= 20000000;
            }
            case VNA: {
                if (!this.whatIsYourApproximateMonthlySalary) {
                    return false;
                }
                if (this.areYouAVietnameseOrForeigner === VIETNAMESE && Math.abs(this.whatIsYourApproximateMonthlySalary) < 6000000) {
                    return false;
                }
                if (this.areYouAVietnameseOrForeigner === FOREIGNERS && Math.abs(this.whatIsYourApproximateMonthlySalary) < 45000000) {
                    return false;
                }
                return !(this.whatIsTenorOfYourCurrentLaborContract === UNDER_1_YEAR || this.howLongDoYouHaveBeenVnAirlineMembership === UNDER_1_YEAR);
            }
            case SALARY: {
                if (!this.whatIsYourApproximateMonthlySalary) {
                    return false;
                }
                if (this.areYouAVietnameseOrForeigner === VIETNAMESE && Math.abs(this.whatIsYourApproximateMonthlySalary) < 6000000) {
                    return false;
                }
                if (this.areYouAVietnameseOrForeigner === FOREIGNERS && Math.abs(this.whatIsYourApproximateMonthlySalary) < 45000000) {
                    return false;
                }
                return this.whatIsTenorOfYourCurrentLaborContract !== UNDER_1_YEAR;

            }
            case SELF_EMPLOYED: {
                if (!this.howMuchIsYourMonthlyBusinessIncome) {
                    return false;
                }
                if (this.howLongYourCompanyHasRun === UNDER_2_YEARS) {
                    return false;
                }
                return Math.abs(this.howMuchIsYourMonthlyBusinessIncome) >= 12000000;
            }
            case V_VIP: {
                return !(this.whichCompanyDoYouWorkFor === COMPANY_OTHER || this.whichIsYourPositionInYourCompany === OTHER);
            }
        }
        return false;
    }

    calculatedLimit(): CreditLimit {
        switch (this.policy) {
            case VIB_STAFF: {
                return {limit: this.whatIsYourGradeLevel ? GRADE_LIMTS[this.whatIsYourGradeLevel] : 0};
            }
            case SECURED: {
                return {limit: this.valueOfTheTermDeposit ? Math.abs(this.valueOfTheTermDeposit) * (this.currencyOfTheTermDeposit === VND ? 0.9 : 0.8) : 0};
            }
            case CARD_TO_CARD: {
                return {limit: this.whatIsTheLimitOfThatCreditCard ? Math.abs(this.whatIsTheLimitOfThatCreditCard) * 1.1 : 0};
            }
            case VNA: {
                let salary = this.whatIsYourApproximateMonthlySalary ? Math.abs(this.whatIsYourApproximateMonthlySalary) : 0;
                if (6000000 <= salary && salary < 8000000) {
                    return {limit: 30000000};
                } else if (8000000 <= salary && salary < 15000000) {
                    return {limit: 75000000};
                } else if (15000000 <= salary) {
                    return {limit: 100000000};
                }
            }
            case SALARY: {
                let salary = this.whatIsYourApproximateMonthlySalary ? Math.abs(this.whatIsYourApproximateMonthlySalary) : 0;
                if (this.areYouAVietnameseOrForeigner === FOREIGNERS) {
                    return {min: salary, max: salary * 2};
                }
                if (this.areYouAVietnameseOrForeigner === VIETNAMESE) {
                    return {min: salary * 2, max: salary * 4.5};
                }
                return {min: 0, max: 0};
            }
            case SELF_EMPLOYED: {
                let businessIncome = this.howMuchIsYourMonthlyBusinessIncome ? Math.abs(this.howMuchIsYourMonthlyBusinessIncome) : 0;
                return {min: businessIncome * 2, max: businessIncome * 4.5};
            }
            case V_VIP: {
                return {limit: this.whichIsYourPositionInYourCompany ? POSITION_LIMTS[this.whichIsYourPositionInYourCompany] : 0};
            }
        }
        return {limit: 0};
    }

    calculatedCard() {
        switch (this.policy) {
            case VIB_STAFF: {
                let limit = this.calculatedLimit().limit;
                if (10000000 <= limit && limit < 20000000) {
                    return CLASSIC;
                } else if (20000000 <= limit && limit < 30000000) {
                    return GOLD;
                } else if (30000000 <= limit) {
                    return PLATINUM;
                }
            }
            case SECURED: {
                let limit = this.calculatedLimit().limit;
                if (10000000 <= limit && limit < 20000000) {
                    return CLASSIC;
                } else if (20000000 <= limit && limit < 30000000) {
                    return GOLD;
                } else if (30000000 <= limit) {
                    return PLATINUM;
                }
            }
            case CARD_TO_CARD: {
                let salary = this.whatIsYourApproximateMonthlySalary ? Math.abs(this.whatIsYourApproximateMonthlySalary) : 0;
                if (6000000 <= salary && salary < 8000000) {
                    return CLASSIC;
                } else if (8000000 <= salary && salary < 15000000) {
                    return GOLD;
                } else if (15000000 <= salary) {
                    return PLATINUM;
                }
            }
            case VNA: {
                let salary = this.whatIsYourApproximateMonthlySalary ? Math.abs(this.whatIsYourApproximateMonthlySalary) : 0;
                if (6000000 <= salary && salary < 8000000) {
                    return CLASSIC;
                } else if (8000000 <= salary && salary < 15000000) {
                    return GOLD;
                } else if (15000000 <= salary) {
                    return PLATINUM;
                }
            }
            case SALARY: {
                let salary = this.whatIsYourApproximateMonthlySalary ? Math.abs(this.whatIsYourApproximateMonthlySalary) : 0;
                if (6000000 <= salary && salary < 8000000) {
                    return CLASSIC;
                } else if (8000000 <= salary && salary < 15000000) {
                    return GOLD;
                } else if (15000000 <= salary) {
                    return PLATINUM;
                }
            }
            case SELF_EMPLOYED: {
                let businessIncome = this.howMuchIsYourMonthlyBusinessIncome ? Math.abs(this.howMuchIsYourMonthlyBusinessIncome) : 0;
                if (12000000 <= businessIncome && businessIncome < 15000000) {
                    return CLASSIC_GOLD
                } else if (15000000 <= businessIncome) {
                    return PLATINUM;
                }
            }
            case V_VIP: {
                let limit = this.calculatedLimit().limit;
                if (10000000 <= limit && limit < 20000000) {
                    return CLASSIC;
                } else if (20000000 <= limit && limit < 30000000) {
                    return GOLD;
                } else if (30000000 <= limit) {
                    return PLATINUM;
                }
            }
        }
        return null;
    }
}

interface CreditLimit {
    limit?: number;
    min?: number;
    max?: number;
}

// policies
const VIB_STAFF = 'vibStaff';
const SECURED = 'secured';
const CARD_TO_CARD = 'cardToCard';
const VNA = 'vna';
const SALARY = 'salary';
const SELF_EMPLOYED = 'selfEmployed';
const V_VIP = 'vVip';

// cards
const PLATINUM = 'platinum';
const GOLD = 'gold';
const CLASSIC = 'classic';
const CLASSIC_GOLD = 'classic_gold';

// yesNos
const NO = 'no';
const YES = 'yes';

// depositOwnerships, creditBank, position
const OTHER = 'other';

// duration
const UNDER_1_YEAR = 'under1Year';

// currencies
const VND = 'vnd';

// nationalities
const VIETNAMESE = 'vietnamese';
const FOREIGNERS = 'foreigners';

// businessLife
const UNDER_2_YEARS = 'under2Years';

// company
const COMPANY_OTHER = 'Other';

const QUESTION_POLICIES = {
    haveYouPassedPropationAndSignOfficialContractWithVib: [VIB_STAFF],
    whatIsYourGradeLevel: [VIB_STAFF],
    ownershipOfSavingBookOrCertificateOfDeposit: [SECURED],
    isThisCollateralFrozenToSecureForAnyLoanCard: [SECURED],
    valueOfTheTermDeposit: [SECURED],
    currencyOfTheTermDeposit: [SECURED],
    areYouAVietnameseOrForeigner: [CARD_TO_CARD, VNA, SALARY],
    whatIsYourApproximateMonthlySalary: [CARD_TO_CARD, VNA, SALARY],
    whatIsTenorOfYourCurrentLaborContract: [CARD_TO_CARD, VNA, SALARY],
    whichBankDoYouHaveCreditCardsAt: [CARD_TO_CARD],
    howLongHaveYouUsedThisCreditCard: [CARD_TO_CARD],
    whatIsTheLimitOfThatCreditCard: [CARD_TO_CARD],
    howLongDoYouHaveBeenVnAirlineMembership: [VNA],
    howLongYourCompanyHasRun: [SELF_EMPLOYED],
    howMuchIsYourMonthlyBusinessIncome: [SELF_EMPLOYED],
    whichCompanyDoYouWorkFor: [V_VIP],
    whichIsYourPositionInYourCompany: [V_VIP]
};

const GRADE_LIMTS = {
    15: 1000000000,
    14: 500000000,
    13: 400000000,
    12: 300000000,
    11: 120000000,
    10: 80000000,
    9: 50000000,
    8: 30000000,
    7: 25000000,
    6: 25000000,
    5: 20000000,
    4: 15000000,
    3: 15000000,
    2: 15000000
};

const POSITION_LIMTS = {
    chairmanBodMember: 500000000,
    ceo: 400000000,
    dceoCfo: 300000000
};
