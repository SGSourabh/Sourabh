import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../../providers/log";
import {AppProvider} from "../../../../../providers/app";
import {Lending} from "./calculator";
import {Observable} from "rxjs/Rx";
import {CurrencyDirective} from "../../../../../directives/currency";
import {PdfProvider} from "../../../../../providers/pdf";
import {UserProvider} from "../../../../../providers/user";
import {CordovaProvider} from "../../../../../providers/cordova";
import {CurrencyPipe} from "../../../../../pipes/currency";
import {Document, Row} from "../../../../../models/pdf";
import {DatePipe, DecimalPipe} from "@angular/common";
import "chart.js/src/chart";
import {LendingRate} from "../../../../../models/rate";
declare var Chart;

@Component({
    templateUrl: 'build/pages/lead/customer/lending/calculator/repayment.html',
    pipes: [TranslatePipe],
    directives: [CurrencyDirective],
    providers: [PdfProvider]
})
export class RepaymentPage implements OnInit, AfterViewInit {
    private model: Lending;
    private lendingPackage: LendingRate;
    advancedRepaymentPeriods: number[];
    optionsToRepay: string[];
    repayments: Repayment[];
    private applicationFileName: string = "Saving.pdf";
    @ViewChild('chart') canvas: ElementRef;
    private chart;
    private dataPoints: DataPoint[];

    constructor(private appProvider: AppProvider,
                private navController: NavController,
                private navParams: NavParams,
                private logProvider: LogProvider,
                private loadingCtrl: LoadingController,
                private translateService: TranslateService,
                private pdfDocumentProvider: PdfProvider,
                private cordovaProvider: CordovaProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    generateRepaymentSchedule() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        let repaymentSchedule = new RepaymentSchedule(this.model, this.lendingPackage);
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.range(1, repaymentSchedule.term))
            .map(month => repaymentSchedule.mutateRepaymentSchedule(repaymentSchedule).toRepayment())
            .toArray()
            .subscribe(next => {
                loading.dismiss().then(() => {
                    this.repayments = next;
                    this.dataPoints.splice(0, this.dataPoints.length, {x: 0, y: this.model.safeLoanAmount()});
                    if (this.repayments.length <= 12) {
                        this.repayments.forEach(repayment => {
                            this.dataPoints.push({x: repayment.month, y: repayment.balance});
                        });
                    } else {
                        for (let i = 11; i < this.repayments.length; i += 12) {
                            this.dataPoints.push({x: this.repayments[i].month, y: this.repayments[i].balance});
                            if (this.model.advanceRepayment && this.model.partialRepayment && this.model.safeAdvancedRepaymentAmount() > 0 && this.model.advancedRepaymentPeriod < this.repayments.length && i <= this.model.advancedRepaymentPeriod && this.model.advancedRepaymentPeriod < (i + 12)) {
                                this.dataPoints.push({x: this.repayments[this.model.advancedRepaymentPeriod - 1].month, y: this.repayments[this.model.advancedRepaymentPeriod].balance})
                            }
                            if (i < (this.repayments.length - 1) && (this.repayments.length - 1) < (i + 12)) {
                                this.dataPoints.push({x: this.repayments[this.repayments.length - 1].month, y: this.repayments[this.repayments.length - 1].balance});
                            }
                        }
                    }
                    this.chart.update();
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error).present());
            });
    }

    ngOnInit() {
        this.model = this.navParams.data.lending;
        this.model.lendingRates
            .filter(f => f.productName === this.model.productName)
            .filter(f => f.lendingPackage === this.model.lendingPackage)
            .first()
            .subscribe(next => this.lendingPackage = next);
        Observable
            .range(1, this.model.calculatedLoanTerm())
            .toArray()
            .subscribe(next => {
                this.advancedRepaymentPeriods = next;
                this.model.advancedRepaymentPeriod = this.model.calculatedLoanTerm();
            });
        this.optionsToRepay = [NOT_REDUCE_LOAN_TERM, REDUCE_LOAN_TERM];
        this.model.optionsToRepay = NOT_REDUCE_LOAN_TERM;
        this.dataPoints = [];
        this.generateRepaymentSchedule();
    }

    ngAfterViewInit() {
        let decimalPipe = new DecimalPipe();

        Chart.plugins.register({
            beforeDraw: function (instance) {
                var context = instance.chart.ctx;
                var gradient = context.createLinearGradient(0, 0, instance.chart.width, 0);
                gradient.addColorStop(0, '#0066B3');
                gradient.addColorStop(0.5, '#1d9eff');
                gradient.addColorStop(1, '#0066B3');
                context.fillStyle = gradient;
                context.fillRect(0, 0, instance.chart.width, instance.chart.height);
            }
        });

        this.chart = new Chart(this.canvas.nativeElement.getContext("2d"), {
            type: 'line',
            data: {
                datasets: [
                    {
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderWidth: 3,
                        borderColor: "#fbb817",
                        pointBorderColor: "#FF8000",
                        pointBackgroundColor: "#fbb817",
                        pointRadius: 5,
                        pointHoverRadius: 5,
                        data: this.dataPoints,
                        spanGaps: false,
                    }
                ]
            },
            options: {
                layout: {
                    padding: {
                        left: 10,
                        right: 20,
                        top: 20,
                        bottom: 10
                    }
                },
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    backgroundColor: "#f89420",
                    displayColors: false,
                    titleFontSize: 30,
                    titleFontStyle: "normal",
                    titleMarginBottom: 10,
                    bodyFontSize: 30,
                    bodyFontStyle: "normal",
                    footerFontStyle: "normal",
                    footerMarginTop: 10,
                    caretSize: 10,
                    xPadding: 10,
                    yPadding: 10,
                    callbacks: {
                        beforeTitle: (tooltipItem, data) => this.translateService.instant('lead.lending.calculator.balance') + ':',
                        title: (tooltipItem, data) => decimalPipe.transform((tooltipItem[0].yLabel), '1.2-2') + ' ' + this.translateService.instant('lead.lending.calculator.vnd'),
                        beforeLabel: (tooltipItem, data) => this.translateService.instant('lead.lending.calculator.month') + ':',
                        label: (tooltipItem, data) => tooltipItem.xLabel.toString()
                    }
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translateService.instant('lead.lending.calculator.balance'),
                            fontColor: 'white'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.3)'
                        },
                        ticks: {
                            fontColor: 'white'
                        }
                    }],
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translateService.instant('lead.lending.calculator.month'),
                            fontColor: 'white'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.3)'
                        },
                        ticks: {
                            fontColor: 'white'
                        }
                    }]
                }
            }
        });
    }

    partialRepayment() {
        return this.model.advancedRepaymentPeriod < this.model.calculatedLoanTerm();
    }

    calculatedRemainingPrincipalAmount(): number {
        return this.repayments.find(f => f.month === this.model.advancedRepaymentPeriod).balance;
    }

    safeAdvancedRepaymentAmount() {
        return this.model.partialRepayment ? this.model.safeAdvancedRepaymentAmount() : this.calculatedRemainingPrincipalAmount();
    }

    calculatedFeesOfAdvancedRepayment(): number {
        let rate;
        if (this.model.advancedRepaymentPeriod <= 12) {
            rate = this.lendingPackage.year1Rate;
        } else if (this.model.advancedRepaymentPeriod <= 24) {
            rate = this.lendingPackage.year2Rate;
        } else if (this.model.advancedRepaymentPeriod <= 36) {
            rate = this.lendingPackage.year3Rate;
        } else if (this.model.advancedRepaymentPeriod > 36) {
            rate = this.lendingPackage.afterYear4Rate;
        }
        return rate ? (rate / 100) * this.safeAdvancedRepaymentAmount() : 0;
    }

    calculatedTotalAdvancedRepayment(): number {
        return this.calculatedRemainingPrincipalAmount() + this.calculatedFeesOfAdvancedRepayment();
    }

    buildDocument(): Document {
        let vnd = ' (' + this.translateService.instant('lead.lending.calculator.vnd') + ')';
        let currencyPipe = new CurrencyPipe();
        let datePipe = new DatePipe();
        let decimalPipe = new DecimalPipe();
        let document: Document = {
            headerTitle: this.translateService.instant('lookup.productType.' + this.appProvider.current.suggestionData.suggestion.productType),
            headerSubTitle: this.translateService.instant('lead.lending.lending'),
            subHeaderItems: [
                {
                    label: this.translateService.instant('lead.lending.calculator.product_name'),
                    value: this.translateService.instant('lead.lending.calculator.lookup.product_name.' + this.model.productName)
                },
                {
                    label: this.translateService.instant('lead.lending.calculator.lending_package'),
                    value: this.translateService.instant('lead.lending.calculator.lookup.lending_package.' + this.model.lendingPackage)
                }
            ],
            sections: [
                {
                    title: this.translateService.instant('lead.lending.calculator.repayment_schedule'),
                    grid: [
                        {
                            header: true,
                            cells: [
                                this.translateService.instant('lead.lending.calculator.month'),
                                this.translateService.instant('lead.lending.calculator.due_date'),
                                this.translateService.instant('lead.lending.calculator.principal_due') + vnd,
                                this.translateService.instant('lead.lending.calculator.interest_due') + vnd,
                                this.translateService.instant('lead.lending.calculator.total_outstanding') + vnd,
                                this.translateService.instant('lead.lending.calculator.balance') + vnd
                            ]
                        }
                    ]
                }
            ]
        };
        if (this.model.collateral) {
            document.subHeaderItems.push(
                {
                    label: this.translateService.instant('lead.lending.calculator.collateral'),
                    value: this.translateService.instant('lead.lending.calculator.lookup.collateral.' + this.model.collateral)
                },
                {
                    label: this.translateService.instant('lead.lending.calculator.ownership'),
                    value: this.translateService.instant('lead.lending.calculator.lookup.ownership.' + this.model.ownership)
                },
                {
                    label: this.translateService.instant('lead.lending.calculator.brand'),
                    value: this.translateService.instant('lead.lending.calculator.lookup.brand.' + this.model.brand)
                }
            );
            if (this.model.manufactured) {
                document.subHeaderItems.push(
                    {
                        label: this.translateService.instant('lead.lending.calculator.manufactured'),
                        value: this.model.manufactured
                    }
                );
            }
            document.subHeaderItems.push(
                {
                    label: this.translateService.instant('lead.lending.calculator.owners_age'),
                    value: this.model.ownersAge
                }
            );
        }
        document.subHeaderItems.push(
            {
                label: this.translateService.instant('lead.lending.calculator.monthly_income') + vnd,
                value: currencyPipe.transform(this.model.monthlyIncome)
            },
            {
                label: this.translateService.instant('lead.lending.calculator.monthly_expense') + vnd,
                value: currencyPipe.transform(this.model.monthlyExpense)
            },
            {
                label: this.translateService.instant('lead.lending.calculator.loan_amount') + vnd,
                value: currencyPipe.transform(this.model.loanAmount)
            },
            {
                label: this.translateService.instant('lead.lending.calculator.loan_term') + ' ' + this.translateService.instant('lead.lending.calculator.month'),
                value: this.model.loanTerm
            },
            {
                label: this.translateService.instant('lead.lending.calculator.interest_rate') + ' (%)',
                value: decimalPipe.transform(this.model.calculatedRate(), '1.2-2')
            },
            {
                label: this.translateService.instant('lead.lending.calculator.maximum_loan_amount') + vnd,
                value: decimalPipe.transform(this.model.calculatedMaxLoanAmount(), '1.2-2')
            },
            {
                label: this.translateService.instant('lead.lending.calculator.loan_date'),
                value: datePipe.transform(this.model.loanDate, 'dd-MM-y')
            },
            {
                label: this.translateService.instant('lead.lending.calculator.due_date'),
                value: datePipe.transform(this.model.calculatedDueDate(), 'dd-MM-y')
            }
        );
        if (this.model.advanceRepayment) {
            document.subHeaderItems.push(
                {
                    label: this.translateService.instant('lead.lending.calculator.advanced_repayment_period') + ' (' + this.translateService.instant('lead.lending.calculator.month') + ')',
                    value: this.model.advancedRepaymentPeriod
                },
                {
                    label: this.translateService.instant('lead.lending.calculator.remaining_principal_amount') + vnd,
                    value: decimalPipe.transform(this.calculatedRemainingPrincipalAmount(), '1.2-2')
                }
            );
            if (this.model.partialRepayment) {
                document.subHeaderItems.push(
                    {
                        label: this.translateService.instant('lead.lending.calculator.advanced_repayment_amount') + vnd,
                        value: currencyPipe.transform(this.model.advancedRepaymentAmount)
                    },
                    {
                        label: this.translateService.instant('lead.lending.calculator.options_to_repay'),
                        value: this.translateService.instant('lead.lending.calculator.lookup.options_to_repay.' + this.model.optionsToRepay)
                    }
                );
            }
            document.subHeaderItems.push(
                {
                    label: this.translateService.instant('lead.lending.calculator.fees_of_advanced_repayment') + vnd,
                    value: decimalPipe.transform(this.calculatedFeesOfAdvancedRepayment(), '1.2-2')
                },
                {
                    label: this.translateService.instant('lead.lending.calculator.total_advanced_repayment') + vnd,
                    value: decimalPipe.transform(this.calculatedTotalAdvancedRepayment(), '1.2-2')
                }
            );
        }
        this.repayments.forEach(repayment => {
            let row: Row = {
                cells: [
                    repayment.month.toString(),
                    datePipe.transform(repayment.dueDate, 'dd-MM-y'),
                    decimalPipe.transform(repayment.principal, '1.2-2'),
                    decimalPipe.transform(repayment.interest, '1.2-2'),
                    decimalPipe.transform(repayment.outstanding, '1.2-2'),
                    decimalPipe.transform(repayment.balance, '1.2-2')
                ]
            };
            document.sections[0].grid.push(row);
        });
        this.logProvider.info('buildDocument', document);
        return document;
    }

    onEmail() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(document => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(this.buildDocument()), this.applicationFileName))
            .map(storedData => {
                return {
                    to: this.appProvider.current.lead.email ? this.appProvider.current.lead.email : this.userProvider.userProfile.email,
                    from: this.userProvider.userProfile.email,
                    subject: `[VIB] Bảng tính minh họa sản phẩm`,
                    body: `
                            Kính gửi anh/chị
                            <br/><br/>
                            Trước hết, Ngân hàng TMCP Quốc tế Việt Nam cảm ơn anh chị đã quan tâm đến sản phẩm của chúng tôi. Như đã trao đổi trong cuộc gặp gần nhất, chúng tôi rất hân hạnh được tư vấn và giới thiệu sản phẩm của VIB đến với anh / chị
                            <br/><br/>
                            Chúng tôi gửi đến anh/chị bảng tính minh họa sản phẩm theo nội dung của cuộc gặp gần nhất, anh/chị tham khảo thông tin bảng tính chi tiết đính kèm
                            <br/><br/>
                            Lưu ý : toàn bộ những sản phẩm gói khuyến mãi  ưu đãi được giới thiệu cho anh/chị chỉ mang tính chất tham khảo do tại mỗi thời điểm hoàn thành thủ tục đăng ký sử dụng sản phẩm VIB sẽ có các chương trình khuyến mãi khác nhau
                            <br/><br/>
                            Khi cần thêm bất kỳ thông tin nào về sản phẩm, gói khuyến mại, các anh/chị có thể liên hệ lại với số hotline 18008180 để được tư vấn hỗ trợ thêm. Hoặc liên hệ trực tiếp với nhân viên đã tư vấn cho anh/chị qua số điện thoại và địa chỉ e-mail trong đơn đăng ký sản phẩm đính kèm
                            <br/><br/>
                            Hi vọng sẽ mang đến cho anh/chị trải nghiệm thú vị với những sản phẩm và dịch vụ của VIB
                            <br/><br/>
                            Một lần nữa xin được cảm ơn các anh/chị đã tin tưởng và sử dụng sản phẩm của VIB
                    `
                    // ,
                    // flex1: this.translateService.instant('lookup.productType.' + this.appProvider.current.suggestionData.suggestion.productType)
                };
            })
            .flatMap(email => this.pdfDocumentProvider.email(email, this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => this.appProvider.createAlert(this.translateService.instant('message.success')).present())
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onExport() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(this.buildDocument()), this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => this.cordovaProvider.openDocumentsPdf(this.applicationFileName))
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onClose() {
        this.navController.pop().then(() => this.navController.pop());
    }
}

class RepaymentSchedule {
    private lendingPackage: LendingRate;
    private month: number;
    private rate: number;
    private dueDate: Date;
    private modelPrincipal: number;
    private principal: number;
    private interest: number;
    private outstanding: number;
    private balance: number;
    public term: number;

    private partialRepaymentAmount;
    private partialInterestRate;
    private maxPartialTimeOfFixedInterestRate;
    private minPartialTimeOfFixedInterestRate;
    private reduceTerm;

    constructor(model: Lending, lendingPackage: LendingRate) {
        this.lendingPackage = model.selectedLendingPackage;
        this.month = 0;
        this.dueDate = new Date(model.loanDate.getTime());
        this.modelPrincipal = model.safePrincipal();
        this.balance = model.safeLoanAmount();
        if (model.partialRepayment) {
            this.partialRepaymentAmount = model.safeAdvancedRepaymentAmount();
            this.partialInterestRate = model.advancedRepaymentPeriod >= lendingPackage.honeymoonPeriod ? lendingPackage.afterHoneymoonRate / 100 : lendingPackage.honeymoonRate / 100;
            this.maxPartialTimeOfFixedInterestRate = Math.floor(this.partialRepaymentAmount / this.modelPrincipal) + model.advancedRepaymentPeriod;
            this.minPartialTimeOfFixedInterestRate = model.advancedRepaymentPeriod + 1;
            this.reduceTerm = model.optionsToRepay === REDUCE_LOAN_TERM;
            this.term = this.reduceTerm ? model.calculatedLoanTerm() - Math.floor(this.partialRepaymentAmount / this.modelPrincipal) : model.calculatedLoanTerm();
        } else {
            this.term = model.advancedRepaymentPeriod;
        }
    }

    mutateRepaymentSchedule(repaymentSchedule: RepaymentSchedule): RepaymentSchedule {
        this.month += 1;
        this.dueDate.setMonth(repaymentSchedule.dueDate.getMonth() + 1);
        if (this.partialRepaymentAmount && !this.reduceTerm && (this.minPartialTimeOfFixedInterestRate <= this.month && this.month <= this.maxPartialTimeOfFixedInterestRate)) {
            this.principal = 0;
            if (this.month === this.minPartialTimeOfFixedInterestRate) {
                this.balance = repaymentSchedule.balance - this.partialRepaymentAmount;
            }
            this.interest = (this.partialInterestRate * this.balance / 360) * 30;
            this.outstanding = this.interest;
        } else {
            if (this.partialRepaymentAmount && this.reduceTerm && this.month === this.minPartialTimeOfFixedInterestRate) {
                this.balance = repaymentSchedule.balance - this.partialRepaymentAmount;
            }
            this.principal = Math.min(this.modelPrincipal, this.balance);
            this.rate = this.month > this.lendingPackage.honeymoonPeriod ? this.lendingPackage.afterHoneymoonRate / 100 : this.lendingPackage.honeymoonRate / 100;
            this.interest = (repaymentSchedule.balance * this.rate / 360) * 30;
            this.outstanding = repaymentSchedule.principal + repaymentSchedule.interest;
            this.balance = repaymentSchedule.balance - repaymentSchedule.principal;
        }
        return this;
    }

    toRepayment(): Repayment {
        return {
            dueDate: new Date(this.dueDate.getTime()),
            principal: this.principal,
            interest: this.interest,
            outstanding: this.outstanding,
            balance: Math.abs(this.balance),
            month: this.month
        }
    }
}

interface Repayment {
    dueDate: Date;
    principal: number;
    interest: number;
    outstanding: number;
    balance: number;
    month: number;
}

interface DataPoint {
    x: number;
    y: number;
}

// options to repay
const NOT_REDUCE_LOAN_TERM = 'not_reduce_loan_term';
const REDUCE_LOAN_TERM = 'reduce_loan_term';
