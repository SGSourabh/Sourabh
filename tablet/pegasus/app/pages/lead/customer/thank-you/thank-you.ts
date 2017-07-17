import {Component} from "@angular/core";
import {NavController, LoadingController, NavParams, AlertController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {AppProvider} from "../../../../providers/app";
import {LogProvider} from "../../../../providers/log";
import {PrintComponent} from "../../../../components/print/print";
import {Lead} from "../../../../models/lead";
import {LeadProvider} from "../../../../providers/lead";
import {Lending} from "../../../../models/lending";
import {PdfProvider} from "../../../../providers/pdf";
import {CordovaProvider} from "../../../../providers/cordova";
import {LendingCopayer} from "../../../../models/copayers";
import {Goal} from "../../../../models/goals";
import {Background} from "../../../../models/background";
import {CurrentAccount} from "../../../../models/current-account";
import {BackgroundProvider} from "../../../../providers/background";
import {Banking as PersonalBanking} from "../../../../models/fhc/personal/banking";
import {Lending as PersonalLending} from "../../../../models/fhc/personal/lending";
import {Protect as PersonalProtect} from "../../../../models/fhc/personal/protect";
import {Saving as PersonalSaving} from "../../../../models/fhc/personal/saving";
import {BankingProvider as PersonalBankingProvider} from "../../../../providers/fhc/personal/banking";
import {LendingProvider as PersonalLendingProvider} from "../../../../providers/fhc/personal/lending";
import {ProtectProvider as PersonalProtectProvider} from "../../../../providers/fhc/personal/protect";
import {SavingProvider as PersonalSavingProvider} from "../../../../providers/fhc/personal/saving";
import {Banking as BusinessBanking} from "../../../../models/fhc/business/banking";
import {Lending as BusinessLending} from "../../../../models/fhc/business/lending";
import {Protect as BusinessProtect} from "../../../../models/fhc/business/protect";
import {BankingProvider  as BusinessBankingProvider} from "../../../../providers/fhc/business/banking";
import {LendingProvider as BusinessLendingProvider} from "../../../../providers/fhc/business/lending";
import {ProtectProvider as BusinessProtectProvider} from "../../../../providers/fhc/business/protect";
import {UserProvider} from "../../../../providers/user";
import {GoalsProvider} from "../../../../providers/goals";
import * as moment from "moment";
import {Observable} from "rxjs/Observable";
import {CurrentAccountProvider} from "../../../../providers/current-account";
import {LendingProvider} from "../../../../providers/lending";
import {CopayersProvider} from "../../../../providers/copayers";
import {CarouselPage} from "../carousel/carousel";
import {ProductCategory} from "../../../../models/product";
// import {Appointment} from '../../../../models/appointment';
// import {AppointmentProvider} from '../../../../providers/appointment';
// import {Compliance} from '../../../../models/compliance';
// import {ComplianceProvider} from '../../../../providers/compliance';
import {Document, Section} from "../../../../models/pdf";

@Component({
    templateUrl: 'build/pages/lead/customer/thank-you/thank-you.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent],
    providers: [
        PersonalBankingProvider,
        PersonalLendingProvider,
        PersonalProtectProvider,
        PersonalSavingProvider,
        BusinessBankingProvider,
        BusinessLendingProvider,
        BusinessProtectProvider,
        BackgroundProvider,
        GoalsProvider,
        CurrentAccountProvider,
        LendingProvider,
        CopayersProvider,
        PdfProvider,
        LeadProvider
    ]
})
export class ThankYouPage {
    lead: Lead;
    private productType: string;
    private productName: string;
    private applicationFileName: string = "Application.pdf";
    applictionId;

    constructor(private logProvider: LogProvider,
                private appProvider: AppProvider,
                private navCtrl: NavController,
                private loadingCtrl: LoadingController,
                private translateService: TranslateService,
                private personalBankingProvider: PersonalBankingProvider,
                private personalLendingProvider: PersonalLendingProvider,
                private personalProtectProvider: PersonalProtectProvider,
                private personalSavingProvider: PersonalSavingProvider,
                private businessBankingProvider: BusinessBankingProvider,
                private businessLendingProvider: BusinessLendingProvider,
                private businessProtectProvider: BusinessProtectProvider,
                private backgroundProvider: BackgroundProvider,
                // private complianceProvider: ComplianceProvider,
                private goalsProvider: GoalsProvider,
                private userProvider: UserProvider,
                // private appointmentProvider: AppointmentProvider,
                private currentAccountProvider: CurrentAccountProvider,
                private lendingProvider: LendingProvider,
                private copayersProvider: CopayersProvider,
                private pdfDocumentProvider: PdfProvider,
                private leadProvider: LeadProvider,
                private cordovaProvider: CordovaProvider,
                public navParams: NavParams,
                public alertCtrl: AlertController) {
        logProvider.class(this);
    }

    buildDocument(lead: Lead): Document {
        let document: Document = {
            "headerTitle": this.translateService.instant('lead.documents.applicationDocument'),
            "headerSubTitle": this.appProvider.current.selectionData.productData.product ? this.translateService.instant('lookup.productType.' + this.appProvider.current.selectionData.productData.product) : null,
            "subHeaderItems": [
                {
                    "label": this.translateService.instant('lead.documents.relationshipManager'),
                    "value": this.userProvider.userProfile.name
                },
                {
                    "label": this.translateService.instant('lead.documents.customerName'),
                    "value": lead.fullname
                },
                {
                    "label": this.translateService.instant('lead.documents.customerPhone'),
                    "value": lead.phone
                },
                {
                    "label": this.translateService.instant('lead.documents.appointmentDate'),
                    "value": moment().format("DD-MM-YYYY")
                }
                // {
                //     "label": this.translateService.instant('lead.documents.appointmentTime'),
                //     "value": this.appointment && this.appointment.start ? moment(this.appointment.start).format("HH:mm") : null
                // },
                // {
                //     "label": this.translateService.instant('lead.documents.customerIdentity'),
                //     "value": lead.nationalId
                // }
            ],
            "sections": []
        };
        this.logProvider.info('buildDocument', document);
        return document;
    }

    addIdentification(document: Document, lead: Lead): void {
        if (!lead) {
            this.logProvider.warn('addIdentification exit');
            return;
        }
        let section = {
            "title": this.translateService.instant('lead.documents.identification'),
            "header": this.translateService.instant('lead.documents.personalDetails'),
            "items": [
                {"label": this.translateService.instant('lead.name'), "value": lead.name},
                {"label": this.translateService.instant('lead.surname'), "value": lead.surname},
                {"label": this.translateService.instant('lead.dateOfBirth'), "value": lead.dateOfBirth ? moment(lead.dateOfBirth).format("DD-MM-YYYY") : null},
                {"label": this.translateService.instant('lead.nationalId'), "value": lead.nationalId},
                {"label": this.translateService.instant('lead.gender'), "value": lead.gender ? this.translateService.instant('lookup.gender.' + lead.gender) : null}
            ]
        };
        this.logProvider.info('addIdentification', section);
        document.sections.push(section);
    }

    addCommunication(document: Document, lead: Lead): void {
        if (!lead) {
            this.logProvider.warn('addCommunication exit');
            return;
        }
        let section = {
            "header": this.translateService.instant('lead.documents.communication'),
            "items": [
                {"label": this.translateService.instant('lead.phone'), "value": lead.phone},
                {"label": this.translateService.instant('lead.email'), "value": lead.email},
                {"label": this.translateService.instant('lead.address'), "value": lead.addressLine1},
            ]
        };
        ['addressLine2', 'addressLine3', 'addressLine4', 'city', 'state', 'zipCode'].forEach(key => {
            if (lead[key]) {
                section.items.push({"label": '', "value": lead[key]});
            }
        });
        this.logProvider.info('addCommunication', section);
        document.sections.push(section);
    }

    // addCompliance(document: Document, compliance: Compliance): void {
    //     let section = {
    //         "title": this.translateService.instant('compliance.compliance'),
    //         "header": this.translateService.instant('compliance.cic'),
    //         "items": [
    //             {
    //                 "label": this.translateService.instant('compliance.status'),
    //                 "value": !compliance ? this.translateService.instant('compliance.notCaptured') : compliance.value ? this.translateService.instant('compliance.pass') : this.translateService.instant('compliance.fail')
    //             }
    //         ]
    //     };
    //     this.logProvider.info('addCompliance', section);
    //     document.sections.push(section);
    // }

    addBackground(document: Document, background: Background): void {
        if (!background) {
            this.logProvider.warn('addBackground exit');
            return;
        }
        let section = {
            "title": this.translateService.instant('lead.documents.needsAnalysis'),
            "header": this.translateService.instant('lead.background.background'),
            "items": [
                {
                    "label": this.translateService.instant('lead.background.education'),
                    "value": background.education ? this.translateService.instant('lookup.backgroudEducation.' + background.education) : null
                },
                {
                    "label": this.translateService.instant('lead.background.employment'),
                    "value": background.employment ? this.translateService.instant('lookup.employment.' + background.employment) : null
                },
                {"label": this.translateService.instant('lead.background.hobbies'), "value": background.hobbies},
                {
                    "label": this.translateService.instant('lead.background.residential'),
                    "value": background.residential ? this.translateService.instant('lookup.residential.' + background.residential) : null
                },
                {"label": this.translateService.instant('lead.background.ownership'), "value": background.ownership ? this.translateService.instant('lookup.ownership.' + background.ownership) : null},
                {
                    "label": this.translateService.instant('lead.background.classification'),
                    "value": background.classification ? this.translateService.instant('lookup.classification.' + background.classification) : null
                },
                {
                    "label": this.translateService.instant('lead.background.businessState'),
                    "value": background.businessState ? this.translateService.instant('lookup.businessState.' + background.businessState) : null
                },
                {
                    "label": this.translateService.instant('lead.background.insuranceLife'),
                    "value": background.insuranceLife ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.background.insuranceGeneral'),
                    "value": background.insuranceGeneral ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.background.accumulativeCar'),
                    "value": background.accumulativeCar ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.background.accumulativeOther'),
                    "value": background.accumulativeOther ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {"label": this.translateService.instant('lead.background.note'), "value": background.note}
            ]
        };
        this.logProvider.info('addBackground', section);
        document.sections.push(section);
    }

    addGoals(document: Document, goals: Goal[]): void {
        if (!goals || goals.length < 1) {
            this.logProvider.warn('addGoals exit');
            return;
        }
        let sections: Section[] = [
            {
                "header": this.translateService.instant('lead.goals.goals'),
                "items": []
            }
        ];
        goals.forEach(goal => {
            let section: Section = {
                "subHeader": this.translateService.instant('lead.goals.goal.goal'),
                "items": [
                    {"label": this.translateService.instant('lead.goals.goal.goal'), "value": this.translateService.instant('lookup.goals.' + goal.name)},
                    // { "label": this.translateService.instant('lead.goals.goal.priority'), "value": goal.priority },
                    {"label": this.translateService.instant('lead.goals.goal.available'), "value": goal.available},
                    {"label": this.translateService.instant('lead.goals.goal.needed'), "value": goal.needed},
                    {"label": this.translateService.instant('lead.goals.goal.duration'), "value": goal.duration},
                    {
                        "label": this.translateService.instant('lead.goals.goal.personal'),
                        "value": goal.personal ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                    },
                    {
                        "label": this.translateService.instant('lead.goals.goal.business'),
                        "value": goal.business ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                    },
                    {
                        "label": this.translateService.instant('lead.goals.goal.lending'),
                        "value": goal.lending ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                    },
                    {"label": this.translateService.instant('lead.goals.goal.saving'), "value": goal.saving ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')},
                    {"label": this.translateService.instant('lead.goals.goal.note'), "value": goal.note}
                ]
            };
            sections.push(section);
        });
        sections.forEach(section => {
            this.logProvider.info('addGoal', section);
            document.sections.push(section);
        });
    }

    addPersonalBanking(document: Document, banking: PersonalBanking): void {
        if (!banking) {
            this.logProvider.warn('addPersonalBanking exit');
            return;
        }
        let section = {
            "title": this.translateService.instant('lead.fhc.financial'),
            "header": this.translateService.instant('lead.fhc.individual.personal'),
            "subHeader": this.translateService.instant('lead.fhc.individual.banking.banking'),
            "items": []
        }
        let howPB = [];
        if (banking.cashFlowBank) {
            howPB.push(this.translateService.instant('lead.fhc.individual.banking.cashFlowBank'))
        }
        if (banking.cashFlowOtherBank) {
            howPB.push(this.translateService.instant('lead.fhc.individual.banking.cashFlowOtherBank'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.individual.banking.doYouManageThroughBankQuestion'), "value": howPB.join(", ")});
        let howTransactPB = [];
        if (banking.transactBranches) {
            howTransactPB.push(this.translateService.instant('lead.fhc.individual.banking.transactBranches'))
        }
        if (banking.transactInternetBanking) {
            howTransactPB.push(this.translateService.instant('lead.fhc.individual.banking.transactInternetBanking'))
        }
        if (banking.transactInternetBanking) {
            howTransactPB.push(this.translateService.instant('lead.fhc.individual.banking.transactSmartphone'))
        }
        if (banking.transactPhone) {
            howTransactPB.push(this.translateService.instant('lead.fhc.individual.banking.transactPhone'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.individual.banking.transactionHowQuestion'), "value": howTransactPB.join(", ")});
        let howPaymodePB = [];
        if (banking.paymodeCreditCard) {
            howPaymodePB.push(this.translateService.instant('lead.fhc.individual.banking.paymodeCreditCard'))
        }
        if (banking.paymodeCash) {
            howPaymodePB.push(this.translateService.instant('lead.fhc.individual.banking.paymodeCash'))
        }
        if (banking.paymodeBankTransfer) {
            howPaymodePB.push(this.translateService.instant('lead.fhc.individual.banking.paymodeBankTransfer'))
        }
        if (banking.paymodeOther) {
            howPaymodePB.push(this.translateService.instant('lead.fhc.individual.banking.paymodeOther'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.individual.banking.paymodeQuestion'), "value": howPaymodePB.join(", ")});
        this.logProvider.info('addPersonalBanking', section);
        document.sections.push(section);
    }

    addPersonalLending(document: Document, lending: PersonalLending): void {
        if (!lending) {
            this.logProvider.warn('addPersonalLending exit');
            return;
        }
        let section = {
            "subHeader": this.translateService.instant('lead.fhc.individual.lending.lending'),
            "items": []
        }
        let howLenderPL = [];
        if (lending.lenderBank) {
            howLenderPL.push(this.translateService.instant('lead.fhc.individual.lending.lenderBank'))
        }
        if (lending.lenderOther) {
            howLenderPL.push(this.translateService.instant('lead.fhc.individual.lending.lenderOther'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.individual.lending.whichBankQuestion'), "value": howLenderPL.join(", ")});
        let howPurposePL = [];
        if (lending.purposeMortgage) {
            howPurposePL.push(this.translateService.instant('lead.fhc.individual.lending.purposeMortgage'))
        }
        if (lending.purposeAuto) {
            howPurposePL.push(this.translateService.instant('lead.fhc.individual.lending.purposeAuto'))
        }
        if (lending.purposePersonal) {
            howPurposePL.push(this.translateService.instant('lead.fhc.individual.lending.purposePersonal'))
        }
        if (lending.purposeCreditCard) {
            howPurposePL.push(this.translateService.instant('lead.fhc.individual.lending.purposeCreditCard'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.individual.lending.doYouHaveAloanQuestion'), "value": howPurposePL.join(", ")});
        section.items.push({
            "label": this.translateService.instant('lead.fhc.individual.lending.interest'),
            "value": lending.interest ? this.translateService.instant('lookup.interest.' + lending.interest) : null
        });
        this.logProvider.info('addPersonalLending', section);
        document.sections.push(section);
    }

    addPersonalProtect(document: Document, protect: PersonalProtect): void {
        if (!protect) {
            this.logProvider.warn('addPersonalProtect exit');
            return;
        }
        let section = {
            "subHeader": this.translateService.instant('lead.fhc.individual.protect.protect'),
            "items": [
                {
                    "label": this.translateService.instant('lead.fhc.individual.protect.death'),
                    "value": protect.death ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.protect.disability'),
                    "value": protect.disability ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.protect.criticalIllness'),
                    "value": protect.criticalIllness ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.protect.hospitilisation'),
                    "value": protect.hospitilisation ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.protect.longevity'),
                    "value": protect.longevity ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.protect.manageRisks'),
                    "value": protect.manageRisks ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                }
            ]
        }
        this.logProvider.info('addPersonalProtect', section);
        document.sections.push(section);
    }

    addPersonalSaving(document: Document, saving: PersonalSaving): void {
        if (!saving) {
            this.logProvider.warn('addPersonalSaving exit');
            return;
        }
        let section = {
            "subHeader": this.translateService.instant('lead.fhc.individual.saving.saving'),
            "items": [
                {
                    "label": this.translateService.instant('lead.fhc.individual.saving.saveInvest'),
                    "value": saving.saveInvest ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.saving.fundChildren'),
                    "value": saving.fundChildren ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.saving.saveSufficient'),
                    "value": saving.saveSufficient ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.saving.saveAndBenefit'),
                    "value": saving.saveAndBenefit ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                },
                {
                    "label": this.translateService.instant('lead.fhc.individual.saving.setupInvestment'),
                    "value": saving.setupInvestment ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                }
            ]
        }
        this.logProvider.info('addPersonalSaving', section);
        document.sections.push(section);
    }

    addBusinessBanking(document: Document, banking: BusinessBanking): void {
        if (!banking) {
            this.logProvider.warn('addBusinessBanking exit');
            return;
        }
        let section = {
            "header": this.translateService.instant('lead.fhc.business.business'),
            "subHeader": this.translateService.instant('lead.fhc.business.banking.banking'),
            "items": []
        }
        let howBB = [];
        if (banking.cashFlowBank) {
            howBB.push(this.translateService.instant('lead.fhc.business.banking.cashFlowBank'))
        }
        if (banking.cashFlowOtherBank) {
            howBB.push(this.translateService.instant('lead.fhc.business.banking.cashFlowOtherBank'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.banking.cashflowManageQuestion'), "value": howBB.join(", ")});
        let howTransactBB = [];
        if (banking.transactBranches) {
            howTransactBB.push(this.translateService.instant('lead.fhc.business.banking.transactBranches'))
        }
        if (banking.transactInternetBanking) {
            howTransactBB.push(this.translateService.instant('lead.fhc.business.banking.transactInternetBanking'))
        }
        if (banking.transactInternetBanking) {
            howTransactBB.push(this.translateService.instant('lead.fhc.business.banking.transactSmartphone'))
        }
        if (banking.transactPhone) {
            howTransactBB.push(this.translateService.instant('lead.fhc.business.banking.transactPhone'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.banking.transactionHowQuestion'), "value": howTransactBB.join(", ")});
        let howPayReceiveBB = [];
        if (banking.payReceiveCheque) {
            howPayReceiveBB.push(this.translateService.instant('lead.fhc.business.banking.payReceiveCheque'))
        }
        if (banking.payReceiveCash) {
            howPayReceiveBB.push(this.translateService.instant('lead.fhc.business.banking.payReceiveCash'))
        }
        if (banking.payReceiveBank) {
            howPayReceiveBB.push(this.translateService.instant('lead.fhc.business.banking.payReceiveBank'))
        }
        if (banking.payReceiveOtherBank) {
            howPayReceiveBB.push(this.translateService.instant('lead.fhc.business.banking.payReceiveOtherBank'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.banking.paymentReceiveQuestion'), "value": howPayReceiveBB.join(", ")});
        let howPaymodeBB = [];
        if (banking.paymodeBank) {
            howPaymodeBB.push(this.translateService.instant('lead.fhc.business.banking.paymodeBank'))
        }
        if (banking.paymodeCash) {
            howPaymodeBB.push(this.translateService.instant('lead.fhc.business.banking.paymodeCash'))
        }
        if (banking.paymodeOtherBank) {
            howPaymodeBB.push(this.translateService.instant('lead.fhc.business.banking.paymodeOtherBank'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.banking.paymodeQuestion'), "value": howPaymodeBB.join(", ")});
        this.logProvider.info('addBusinessBanking', section);
        document.sections.push(section);
    }

    addBusinessLending(document: Document, lending: BusinessLending): void {
        if (!lending) {
            this.logProvider.warn('addBusinessLending exit');
            return;
        }
        let section = {
            "subHeader": this.translateService.instant('lead.fhc.business.lending.lending'),
            "items": []
        };
        let howLenderPL = [];
        if (lending.lenderBank) {
            howLenderPL.push(this.translateService.instant('lead.fhc.business.lending.lenderBank'))
        }
        if (lending.lenderOther) {
            howLenderPL.push(this.translateService.instant('lead.fhc.business.lending.lenderOther'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.lending.whichBankQuestion'), "value": howLenderPL.join(", ")});
        let howPurposeBL = [];
        if (lending.purposeFixedInvAssets) {
            howPurposeBL.push(this.translateService.instant('lead.fhc.business.lending.purposeFixedInvAssets'))
        }
        if (lending.purposeShortWorkingCapital) {
            howPurposeBL.push(this.translateService.instant('lead.fhc.business.lending.purposeShortWorkingCapital'))
        }
        if (lending.purposeBusinessAuto) {
            howPurposeBL.push(this.translateService.instant('lead.fhc.business.lending.purposeBusinessAuto'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.lending.purpose'), "value": howPurposeBL.join(", ")});
        section.items.push({
            "label": this.translateService.instant('lead.fhc.business.lending.interest'),
            "value": lending.interest ? this.translateService.instant('lookup.interest.' + lending.interest) : null
        });
        this.logProvider.info('addBusinessLending', section);
        document.sections.push(section);
    }

    addBusinessProtect(document: Document, protect: BusinessProtect): void {
        if (!protect) {
            this.logProvider.warn('addBusinessProtect exit');
            return;
        }
        let section = {
            "subHeader": this.translateService.instant('lead.fhc.business.protect.protect'),
            "items": [
                {
                    "label": this.translateService.instant('lead.fhc.business.protect.buyInsurance'),
                    "value": protect.buyInsurance ? this.translateService.instant('action.yes') : this.translateService.instant('action.no')
                }
            ]
        };
        let howProtectBP = [];
        if (protect.protectIncome) {
            howProtectBP.push(this.translateService.instant('lead.fhc.business.protect.protectIncome'))
        }
        if (protect.protectInsuredPerson) {
            howProtectBP.push(this.translateService.instant('lead.fhc.business.protect.protectInsuredPerson'))
        }
        if (protect.protectBusinessAssets) {
            howProtectBP.push(this.translateService.instant('lead.fhc.business.protect.protectBusinessAssets'))
        }
        if (protect.protectOther) {
            howProtectBP.push(this.translateService.instant('lead.fhc.business.protect.protectOther'))
        }
        section.items.push({"label": this.translateService.instant('lead.fhc.business.protect.itemsToProtectQuestion'), "value": howProtectBP.join(", ")});
        this.logProvider.info('addBusinessProtect', section);
        document.sections.push(section);
    }

    addProductSelection(document: Document): void {
        let section = {
            "title": this.translateService.instant('lead.documents.productSelection'),
            "header": this.translateService.instant('lead.documents.productDetails'),
            "items": [
                {
                    "label": this.translateService.instant('lead.documents.productGroup'),
                    "value": this.appProvider.current.selectionData.productData.product ? this.translateService.instant('lookup.productType.' + this.appProvider.current.selectionData.productData.product) : null
                },
                {
                    "label": this.translateService.instant('lead.documents.product'),
                    "value": this.productName ? this.translateService.instant((this.appProvider.current.selectionData.productData.category === ProductCategory.LENDING ? 'lookup.productSalesGroupsLending.' : 'lookup.productSalesGroup.') + this.productName) : null
                }
            ]
        };
        this.logProvider.info('addProductSelection', section);
        document.sections.push(section);
    }

    addLending(document: Document, lending: Lending): void {
        if (!lending) {
            this.logProvider.warn('addLending exit');
            return;
        }
        let section = {
            "title": this.translateService.instant('lead.documents.lendingApplication'),
            "header": this.translateService.instant('lead.documents.applicationDetails'),
            "subHeader": this.translateService.instant('lead.lending.payer'),
            "items": [
                {
                    "label": this.translateService.instant('lead.lending.customerType'),
                    "value": lending.customerType ? this.translateService.instant('lookup.customerType.' + lending.customerType) : null
                },
                {
                    "label": this.translateService.instant('lead.lending.productName'),
                    "value": lending.productName ? this.translateService.instant('lookup.productSalesGroupsLending.' + lending.productName) : null
                },
                {"label": this.translateService.instant('lead.lending.loanPurpose'), "value": lending.loanPurpose ? this.translateService.instant('lookup.loanPurpose.' + lending.loanPurpose) : null},
                {"label": this.translateService.instant('lead.lending.education'), "value": lending.education ? this.translateService.instant('lookup.education.' + lending.education) : null},
                {"label": this.translateService.instant('lead.lending.idDateOfIssue'), "value": lending.idDateOfIssue ? moment(lending.idDateOfIssue).format("DD-MM-YYYY") : null},
                {"label": this.translateService.instant('lead.lending.idPlaceOfIssue'), "value": lending.idPlaceOfIssue},
                {"label": this.translateService.instant('lead.lending.permanentAddress'), "value": lending.permanentAddressLine1}
            ]
        };
        ['permanentAddressLine2', 'permanentAddressLine3', 'permanentAddressLine4', 'permanentCity', 'permanentState', 'permanentZipCode', 'country'].forEach(key => {
            if (lending[key]) {
                section.items.push({"label": '', "value": lending[key]});
            }
        });
        this.logProvider.info('addLending', section);
        document.sections.push(section);
    }

    addLendingCopayers(document: Document, lendingCopayers: LendingCopayer[]): void {
        if (!lendingCopayers || lendingCopayers.length < 1) {
            this.logProvider.warn('addLendingCopayers exit');
            return;
        }
        let sections: Section[] = [
            {
                "header": this.translateService.instant('lead.lending.lendingCopayer.lendingCopayers'),
                "items": []
            }
        ];
        lendingCopayers.forEach(lendingCopayer => {
            let section: Section = {
                "subHeader": this.translateService.instant('lead.lending.lendingCopayer.lendingCopayer'),
                "items": [
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.relationship'), "value": this.translateService.instant('lookup.relationship.' + lendingCopayer.relationship)},
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.name'), "value": lendingCopayer.name},
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.surname'), "value": lendingCopayer.surname},
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.dateOfBirth'),
                        "value": lendingCopayer.dateOfBirth ? moment(lendingCopayer.dateOfBirth).format("DD-MM-YYYY") : null
                    },
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.gender'),
                        "value": lendingCopayer.gender ? this.translateService.instant('lookup.gender.' + lendingCopayer.gender) : null
                    },
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.maritalStatus'),
                        "value": lendingCopayer.maritalStatus ? this.translateService.instant('lookup.maritalStatus.' + lendingCopayer.maritalStatus) : null
                    },
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.education'),
                        "value": lendingCopayer.education ? this.translateService.instant('lookup.education.' + lendingCopayer.education) : null
                    },
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.idType'),
                        "value": lendingCopayer.idType ? this.translateService.instant('lookup.idType.' + lendingCopayer.idType) : null
                    },
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.idNumber'), "value": lendingCopayer.idNumber},
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.idDateOfIssue'),
                        "value": lendingCopayer.idDateOfIssue ? moment(lendingCopayer.idDateOfIssue).format("DD-MM-YYYY") : null
                    },
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.idPlaceOfIssue'), "value": lendingCopayer.idPlaceOfIssue},
                    {
                        "label": this.translateService.instant('lead.lending.lendingCopayer.ownership'),
                        "value": lendingCopayer.ownership ? this.translateService.instant('lookup.ownership.' + lendingCopayer.ownership) : null
                    },
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.businessRegistrationNumber'), "value": lendingCopayer.businessRegistrationNumber},
                    {"label": this.translateService.instant('lead.lending.lendingCopayer.permanentAddressLine1'), "value": lendingCopayer.permanentAddressLine1}
                ]
            };
            ['permanentAddressLine2', 'permanentAddressLine3', 'permanentAddressLine4', 'permanentCity', 'permanentState', 'permanentZipCode', 'country'].forEach(key => {
                if (lendingCopayer[key]) {
                    section.items.push({"label": '', "value": lendingCopayer[key]});
                }
            });
            sections.push(section);
        });
        sections.forEach(section => {
            this.logProvider.info('addLendingCopayer', section);
            document.sections.push(section);
        });
    }

    addCurrentAccount(document: Document, currentAccount: CurrentAccount): void {
        if (!currentAccount) {
            this.logProvider.warn('addCurrentAccount exit');
            return;
        }
        let section = {
            "title": this.translateService.instant('lead.documents.currentAccountApplication'),
            "header": this.translateService.instant('lead.documents.applicationDetails'),
            "items": [
                {
                    "label": this.translateService.instant('lead.currentAccount.placeOfBirth'),
                    "value": currentAccount.placeOfBirth ? this.translateService.instant('lookup.placesOfBirth.' + currentAccount.placeOfBirth) : null
                },
                {"label": this.translateService.instant('lead.currentAccount.idDateOfIssue'), "value": currentAccount.idDateOfIssue ? moment(currentAccount.idDateOfIssue).format("DD-MM-YYYY") : null},
                {"label": this.translateService.instant('lead.currentAccount.idPlaceOfIssue'), "value": currentAccount.idPlaceOfIssue},
                {
                    "label": this.translateService.instant('lead.currentAccount.occupation'),
                    "value": currentAccount.occupation ? this.translateService.instant('lookup.occupation.' + currentAccount.occupation) : null
                },
                {"label": this.translateService.instant('lead.currentAccount.permanentAddress'), "value": currentAccount.permanentAddressLine1}
            ]
        };
        ['permanentAddressLine2', 'permanentAddressLine3', 'permanentAddressLine4', 'permanentCity', 'permanentState', 'permanentZipCode', 'country'].forEach(key => {
            if (currentAccount[key]) {
                section.items.push({"label": '', "value": currentAccount[key]});
            }
        });
        this.logProvider.info('addCurrentAccount', section);
        document.sections.push(section);
    }

    assembleDocument(): Observable<Document> {
        let args: any[] = [
            this.personalBankingProvider.readBanking(this.appProvider.current.lead.id),
            this.personalLendingProvider.readLending(this.appProvider.current.lead.id),
            this.personalProtectProvider.readProtect(this.appProvider.current.lead.id),
            this.personalSavingProvider.readSaving(this.appProvider.current.lead.id),
            this.businessBankingProvider.readBanking(this.appProvider.current.lead.id),
            this.businessLendingProvider.readLending(this.appProvider.current.lead.id),
            this.businessProtectProvider.readProtect(this.appProvider.current.lead.id),
            this.backgroundProvider.readBackground(this.appProvider.current.lead.id),
            this.goalsProvider.readGoals()
        ];
        if (this.appProvider.current.selectionData.productData.category === ProductCategory.LENDING) {
            args.push(this.lendingProvider.readLending(this.appProvider.current.applicationId));
            args.push(this.copayersProvider.readCopayers(this.appProvider.current.applicationId));
        } else {
            args.push(this.currentAccountProvider.readCurrentAccount(this.appProvider.current.applicationId));
        }
        let _observable = Observable.forkJoin(args);
        return _observable
            .map((data) => {
                let document = this.buildDocument(this.appProvider.current.lead);
                this.addIdentification(document, this.appProvider.current.lead);
                this.addCommunication(document, this.appProvider.current.lead);
                this.addBackground(document, data[7]);
                this.addGoals(document, data[8]);
                this.addPersonalBanking(document, data[0]);
                this.addPersonalLending(document, data[1]);
                this.addPersonalProtect(document, data[2]);
                this.addPersonalSaving(document, data[3]);
                this.addBusinessBanking(document, data[4]);
                this.addBusinessLending(document, data[5]);
                this.addBusinessProtect(document, data[6]);
                this.addProductSelection(document);
                if (this.appProvider.current.selectionData.productData.category === ProductCategory.LENDING) {
                    this.addLending(document, data[9]);
                    this.addLendingCopayers(document, data[10]);
                } else {
                    this.addCurrentAccount(document, data[9]);
                }
                this.logProvider.info('document', document);
                return document;
            })
            .catch(error => this.appProvider.observableThrow(error));
    }

    onComplete() {
          this.leadecomplete();
        // let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        // if (this.appProvider.current.selectionData.productData.category === ProductCategory.LENDING) {
        //     Observable.fromPromise(loading.present())
        //         .flatMap(() => this.cordovaProvider.checkMainApi())
        //         .flatMap(data => this.lendingProvider.statusFinalise(this.appProvider.current.lead.id))
        //         .subscribe(response => {
        //                 loading.dismiss()
        //                 if (response['finalisable'] == true || response['finalisable'] == 'true') {
        //                     let alert = this.alertCtrl.create({
        //                         title: 'Confirmation',
        //                         message: 'Do  you wish to close the lead ?',
        //                         buttons: [
        //                             {
        //                                 text: 'No',
        //                                 handler: () => {
        //                                     this.leadecomplete();
        //                                 }
        //                             },
        //                             {
        //                                 text: 'Yes',
        //                                 handler: () => {
        //                                     this.leadeclose();
        //                                     alert.dismiss()
        //                                 }
        //                             }
        //                         ]
        //                     });
        //                     alert.present();
        //                 } else {
        //                     this.leadecomplete();
        //                 }
        //             }

        //             , error =>
        //                 loading.dismiss().then(() => this.appProvider.createAlert(error).present())
        //         );

        // } else {
        //     Observable.fromPromise(loading.present())
        //         .flatMap(() => this.cordovaProvider.checkMainApi())
        //         .flatMap(data => this.currentAccountProvider.statusFinalise(this.appProvider.current.lead.id))
        //         .subscribe(response => {
        //                 loading.dismiss()
        //                 if (response['finalisable'] == true || response['finalisable'] == 'true') {
        //                     let alert = this.alertCtrl.create({
        //                         title: 'Confirmation',
        //                         message: 'Do  you wish to close the lead ?',
        //                         buttons: [
        //                             {
        //                                 text: 'No',
        //                                 handler: () => {
        //                                     this.leadecomplete();
        //                                     alert.dismiss()
        //                                 }
        //                             },
        //                             {
        //                                 text: 'Yes',
        //                                 handler: () => {
        //                                     this.leadeclose();
        //                                     alert.dismiss()
        //                                 }
        //                             }
        //                         ]
        //                     });
        //                     alert.present();
        //                 } else {
        //                     this.leadecomplete();
        //                 }
        //             }
        //             , error =>
        //                 loading.dismiss().then(() => this.appProvider.createAlert(error).present())
        //         );
        // }
    }

    leadeclose() {
        //alert(this.appProvider.current.lead.id)
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.leadProvider.partialUpdateLead(this.appProvider.current.lead.id, {"status": "closed"}))
            .flatMap(data => this.assembleDocument())
            // .flatMap(document => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(document), this.applicationFileName))
            .map(storedData => {
                return {
                    to: this.userProvider.userProfile.email,
                    from: this.userProvider.userProfile.email,
                    subject: `[Pegasus] Đơn đăng ký [${this.appProvider.current.lead.fullname}]${this.appProvider.current.selectionData.productData.product ? ' ' + this.translateService.instant('lookup.productType.' + this.appProvider.current.selectionData.productData.product) : ''}`,
                    body: `Kính gửi anh / chị,\n\nĐây là thông tin về mục tiêu, sức khỏe tài chính, và sản phẩm mong muốn của khách hàng [${this.appProvider.current.lead.fullname}] trong buổi làm việc ngày [${moment().format("DD-MM-YYYY")}].\n\nAnh / chị tiếp tục xử lý hồ sơ này nếu có thể, hoặc gửi đến bộ phận khác có liên quan để tiếp tục phục vụ khách hàng tốt nhất.\n\nCảm ơn anh / chị.`
                };
            })
            .flatMap(email => this.pdfDocumentProvider.email(email, this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.appProvider.createAlert(this.translateService.instant('message.success')).present()
                        this.navCtrl.setRoot(CarouselPage, {}, this.appProvider.navOptions);
                    })
                // loading.dismiss().then(() => this.doc = data)
                , error =>
                    loading.dismiss().then(() => {
                        this.appProvider.createAlert(error).present()
                        this.navCtrl.setRoot(CarouselPage, {}, this.appProvider.navOptions);
                    })
            );
        //this.navCtrl.setRoot(CarouselPage, {}, this.appProvider.navOptions);
    }

    leadecomplete() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.assembleDocument())
            // .flatMap(document => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(document), this.applicationFileName))
            .map(storedData => {
                return {
                    to: this.userProvider.userProfile.email,
                    from: this.userProvider.userProfile.email,
                    subject: `[Pegasus] Đơn đăng ký [${this.appProvider.current.lead.fullname}]${this.appProvider.current.selectionData.productData.product ? ' ' + this.translateService.instant('lookup.productType.' + this.appProvider.current.selectionData.productData.product) : ''}`,
                    body: `Kính gửi anh / chị,\n\nĐây là thông tin về mục tiêu, sức khỏe tài chính, và sản phẩm mong muốn của khách hàng [${this.appProvider.current.lead.fullname}] trong buổi làm việc ngày [${moment().format("DD-MM-YYYY")}].\n\nAnh / chị tiếp tục xử lý hồ sơ này nếu có thể, hoặc gửi đến bộ phận khác có liên quan để tiếp tục phục vụ khách hàng tốt nhất.\n\nCảm ơn anh / chị.`
                };
            })
            .flatMap(email => this.pdfDocumentProvider.email(email, this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.appProvider.createAlert(this.translateService.instant('message.success')).present()
                        this.navCtrl.setRoot(CarouselPage, {}, this.appProvider.navOptions);
                    })
                // loading.dismiss().then(() => this.doc = data)
                , error =>
                    loading.dismiss().then(() => {
                        this.appProvider.createAlert(error).present()
                        this.navCtrl.setRoot(CarouselPage, {}, this.appProvider.navOptions);
                    })
            );

    }

    // doc: any;

    onExportDocument() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.assembleDocument())
            .flatMap(document => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(document), this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => this.cordovaProvider.openDocumentsPdf(this.applicationFileName))
                // loading.dismiss().then(() => this.doc = data)
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onEmailDocument() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(data => this.assembleDocument())
            .flatMap(document => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(document), this.applicationFileName))
            .map(storedData => {
                return {
                    to: this.appProvider.current.lead.email ? this.appProvider.current.lead.email : this.userProvider.userProfile.email,
                    from: this.userProvider.userProfile.email,
                    subject: `[VIB] Đơn đăng ký sản phẩm`,
                    body: `Kính gửi anh/chị<br/><br/>Trước hết, Ngân hàng TMCP Quốc tế Việt Nam cảm ơn anh chị đã quan tâm đến sản phẩm của chúng tôi. Như đã trao đổi trong cuộc gặp lần trước, chúng tôi rất hân hạnh được tư vấn và giới thiệu sản phẩm của VIB đến với anh / chị.<br/><br/>Để chúng tôi có thể sớm hoàn thành hồ sơ của anh/chị, anh/chị vui lòng kiểm tra lại đơn đăng ký đính kèm và cung cấp cho chúng tôi các thông tin và giấy tờ còn thiếu.  Nhân viên của VIB sẽ liên lạc với anh / chị trong một vài ngày tới để giúp anh chị hoàn tất thủ tục đăng ký.<br/><br/>Lưu ý : toàn bộ những sản phẩm gói khuyến mãi  ưu đãi được giới thiệu cho anh/chị chỉ mang tính chất tham khảo do tại mỗi thời điểm hoàn thành thủ tục đăng ký sử dụng sản phẩm VIB sẽ có các chương trình khuyến mãi khác nhau.<br/><br/>Khi cần thêm bất kỳ thông tin nào về sản phẩm, gói khuyến mại, các anh/chị có thể liên hệ lại với số hotline 18008180 để được tư vấn hỗ trợ thêm. Hoặc liên hệ trực tiếp với nhân viên đã tư vấn cho anh/chị qua số điện thoại và địa chỉ e-mail trong đơn đăng ký sản phẩm đính kèm.<br/><br/>Hi vọng sẽ mang đến cho anh/chị trải nghiệm thú vị với những sản phẩm và dịch vụ của VIB<br/><br/>Một lần nữa xin được cảm ơn các anh/chị đã tin tưởng và sử dụng sản phẩm của VIB.`,
                    flex1: this.appProvider.current.selectionData.productData.product ? this.appProvider.current.selectionData.productData.product : ''
                };
            })
            .flatMap(email => this.pdfDocumentProvider.email(email, this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => this.appProvider.createAlert(this.translateService.instant('message.success')).present())
                // loading.dismiss().then(() => this.doc = data)
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

}
