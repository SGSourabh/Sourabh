import {Component, ElementRef, ViewChild, AfterViewInit} from "@angular/core";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../../providers/log";
import {AppProvider} from "../../../../../providers/app";
import {CurrencyDirective} from "../../../../../directives/currency";
import {PROGRESSIVE_SAVER, NON_TERM_SAVINGS_ACCOUNT} from "../../../../../models/product";
import {Observable} from "rxjs/Rx.KitchenSink";
import {PrintComponent} from "../../../../../components/print/print";
import {Document} from "../../../../../models/pdf";
import {CurrencyPipe} from "../../../../../pipes/currency";
import {DecimalPipe} from "@angular/common";
import {LoadingController, NavController} from "ionic-angular";
import {PdfProvider} from "../../../../../providers/pdf";
import {CordovaProvider} from "../../../../../providers/cordova";
import {UserProvider} from "../../../../../providers/user";
import "chart.js/src/chart";
import {RateProvider} from "../../../../../providers/rate";
import {SavingRate} from "../../../../../models/rate";
declare var Chart;

@Component({
    templateUrl: 'build/pages/lead/customer/saving/calculator/calculator.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent, CurrencyDirective],
    providers: [PdfProvider]
})
export class CalculatorPage implements AfterViewInit {
    model: Saving;
    currencyOptions: string[];
    private applicationFileName: string = "Saving.pdf";
    @ViewChild('chart') canvas: ElementRef;
    private chart;

    constructor(private appProvider: AppProvider,
                private logProvider: LogProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private loadingCtrl: LoadingController,
                private pdfDocumentProvider: PdfProvider,
                private cordovaProvider: CordovaProvider,
                private userProvider: UserProvider,
                private rateProvider: RateProvider) {
        logProvider.class(this);
    }

    ngAfterViewInit() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.rateProvider.readSavingRates())
            .subscribe(next => {
                loading.dismiss().then(() => {
                    let nextMapped = Observable.from(next.map(m => {
                        let viewSavingRate = m as ViewSavingRate;
                        viewSavingRate.depositTermData = {term: viewSavingRate.depositTerm, duration: viewSavingRate.depositTermDuration};
                        return viewSavingRate;
                    }));
                    this.model = new Saving(this.appProvider.current.salesGroupData.salesGroup, nextMapped);
                    this.model.savingRates
                        .filter(f => f.salesGroup === this.model.salesGroup)
                        .map(m => m.currency)
                        .distinct()
                        .toArray()
                        .subscribe(next => this.currencyOptions = next);
                    this.setupChart();
                });
            }, error => {
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngAfterViewInit()).present());
            });
    }

    setupChart() {
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
                labels: this.model.intervals,
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
                        data: this.model.values,
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
                        beforeTitle: (tooltipItem, data) => this.translateService.instant('lead.saving.calculator.interestAmount') + ':',
                        title: (tooltipItem, data) => decimalPipe.transform((tooltipItem[0].yLabel - this.model.safeDepositAmount()), '1.2-2') + ' ' + this.translateService.instant('lead.saving.calculator.lookup.currency.' + this.model.currency),
                        beforeLabel: (tooltipItem, data) => this.translateService.instant('lead.saving.calculator.interestReceived') + ':',
                        label: (tooltipItem, data) => decimalPipe.transform(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] - (tooltipItem.index > 0 ? data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index - 1] : this.model.safeDepositAmount()), '1.2-2') + ' ' + this.translateService.instant('lead.saving.calculator.lookup.currency.' + this.model.currency),
                        beforeFooter: (tooltipItem, data) => this.translateService.instant('lead.saving.calculator.totalAmount') + ':',
                        footer: (tooltipItem, data) => decimalPipe.transform((tooltipItem[0].yLabel), '1.2-2') + ' ' + this.translateService.instant('lead.saving.calculator.lookup.currency.' + this.model.currency)
                    }
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translateService.instant('lead.saving.calculator.totalAmount'),
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
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translateService.instant('lead.saving.calculator.depositTerm'),
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

    draw() {
        this.model.calculatedTotalAmount().subscribe(next => {
            this.model.intervals.splice(0, this.model.intervals.length);
            this.model.values.splice(0, this.model.values.length);
            let amount = this.model.safeDepositAmount();
            let interval = 0;
            switch (this.model.interestReceived) {
                case MONTHLY:
                    interval = 1;
                    break;
                case QUARTERLY:
                    interval = 3;
                    break;
                case SIX_MONTH:
                    interval = 6;
                    break;
                case NINE_MONTH:
                    interval = 9;
                    break;
                case TWELVE_MONTH:
                    interval = 12;
                    break;
                case END_OF_TERM:
                    interval = this.model.depositTerm.term;
                    break;
                default:
                    interval = 0;
            }
            let step = ((next - amount) / this.model.depositTerm.term) * interval;
            for (let i = 0; i <= this.model.depositTerm.term; i += interval) {
                this.model.intervals.push(i);
                this.model.values.push(amount);
                amount += step;
            }
            this.chart.update();
        });
    }

    onClose() {
        this.navController.pop();
    }

    onCurrencyChange() {
        this.model.updateInterestReceived()
        .flatMap(() => this.cordovaProvider.checkMainApi())
        .flatMap(() => this.model.updateDepositTerm()).subscribe(next => this.draw());
    }

    interestReceivedOptions() {
        return this.model.savingRates
            .filter(f => f.salesGroup === this.model.salesGroup)
            .filter(f => f.currency === this.model.currency)
            .filter(f => f.threshold === this.model.calculatedDepositThreshold())
            .map(m => m.interestReceived)
            .distinct()
            .toArray();
    }

    onDepositAmountChange() {
        this.model.updateDepositTerm().subscribe(next => this.draw());
    }

    onInterestReceivedChange() {
        this.model.updateDepositTerm().subscribe(next => this.draw());
    }

    onDepositTermChange() {
        this.draw();
    }

    depositTermOptions(): Observable<DepositTermData[]> {
        return this.model.savingRates
            .filter(f => f.salesGroup === this.model.salesGroup)
            .filter(f => f.currency === this.model.currency)
            .filter(f => f.interestReceived === this.model.interestReceived)
            .filter(f => f.threshold === this.model.calculatedDepositThreshold())
            .map(m => m.depositTermData)
            .distinct()
            .toArray();
    }

    buildDocument(): Document {
        let total = this.translateService.instant('lead.card.calculator.total') + ' ';
        let currency = ' (' + this.translateService.instant('lead.saving.calculator.lookup.currency.' + this.model.currency) + ')';
        let currencyPipe = new CurrencyPipe();
        let decimalPipe = new DecimalPipe();
        let document: Document = {
            headerTitle: this.translateService.instant('lookup.productSalesGroup.' + this.appProvider.current.salesGroupData.salesGroup),
            headerSubTitle: this.translateService.instant('lead.saving.saving'),
            subHeaderItems: [
                {
                    label: this.translateService.instant('lead.saving.calculator.currency'),
                    value: this.translateService.instant('lead.saving.calculator.lookup.currency.' + this.model.currency)
                },
                {
                    label: null,
                    value: null
                },
                {
                    label: this.translateService.instant('lead.saving.calculator.depositAmount') + currency,
                    value: currencyPipe.transform(this.model.depositAmount)
                },
                {
                    label: null,
                    value: null
                },
                {
                    label: this.translateService.instant('lead.saving.calculator.interestReceived'),
                    value: this.translateService.instant('lead.saving.calculator.lookup.interestReceived.' + this.model.interestReceived)
                },
                {
                    label: null,
                    value: null
                },
                {
                    label: this.translateService.instant('lead.saving.calculator.depositTerm'),
                    value: this.model.depositTerm.term + ' ' + this.translateService.instant('lead.saving.calculator.lookup.duration.' + this.model.depositTerm.duration)
                },
                {
                    label: null,
                    value: null
                }
            ]
        };
        Observable.forkJoin(this.model.calculatedInterestRate(), this.model.calculatedInterestAmount(), this.model.calculatedTotalAmount())
            .subscribe(values => {
                document.subHeaderItems.push(
                    {
                        label: this.translateService.instant('lead.saving.calculator.interestRate') + ' (%)',
                        value: decimalPipe.transform(values[0], '1.2-2')
                    },
                    {
                        label: null,
                        value: null
                    },
                    {
                        label: this.translateService.instant('lead.saving.calculator.interestAmount') + currency,
                        value: decimalPipe.transform(values[1], '1.2-2')
                    },
                    {
                        label: null,
                        value: null
                    }, {
                        label: this.translateService.instant('lead.saving.calculator.totalAmount') + currency,
                        value: decimalPipe.transform(values[2], '1.2-2')
                    }
                );
            });
        this.logProvider.info('buildDocument', document);
        return document;
    }

    onEmail() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(document => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(this.buildDocument()), this.applicationFileName))
            .map(() => {
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
                    //flex1: this.translateService.instant('lookup.productSalesGroup.' + this.appProvider.current.salesGroupData.salesGroup)
                };
            })
            .flatMap(() => this.cordovaProvider.checkMainApi())
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
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(this.buildDocument()), this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => this.cordovaProvider.openDocumentsPdf(this.applicationFileName))
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
}

class Saving {
    currency: string;
    productType: string;
    depositAmount: number;
    interestReceived: string;
    depositTerm: DepositTermData;
    intervals: number[];
    values: number[];

    constructor(public salesGroup: string, public savingRates: Observable<ViewSavingRate>) {
        savingRates
            .filter(f => f.salesGroup === salesGroup)
            .first()
            .subscribe(next => {
                this.salesGroup = next.salesGroup;
                this.currency = next.currency;
                this.interestReceived = next.interestReceived;
                this.depositTerm = next.depositTermData;
                this.intervals = [];
                this.values = [];
                let interval;
                switch (this.interestReceived) {
                    case MONTHLY:
                        interval = 1;
                        break;
                    case QUARTERLY:
                        interval = 3;
                        break;
                    case SIX_MONTH:
                        interval = 6;
                        break;
                    case NINE_MONTH:
                        interval = 9;
                        break;
                    case TWELVE_MONTH:
                        interval = 12;
                        break;
                    case END_OF_TERM:
                        interval = this.depositTerm.term;
                        break;
                    default:
                        interval = 0;
                }
                for (let i = 0; i <= this.depositTerm.term; i += interval) {
                    this.intervals.push(i);
                    this.values.push(0);
                }
            });
    }

    calculatedDepositThreshold() {
        if (PROGRESSIVE_SAVER === this.salesGroup) {
            let amount = this.safeDepositAmount();
            switch (this.currency) {
                case USD:
                    if (amount < 50000) {
                        return LEVEL_1;
                    } else if (amount < 300000) {
                        return LEVEL_2;
                    }
                    return LEVEL_3;
                case EUR:
                    if (amount < 50000) {
                        return LEVEL_1;
                    } else if (amount < 500000) {
                        return LEVEL_2;
                    }
                    return LEVEL_3;
                default:
                    if (amount < 500000000) {
                        return LEVEL_1;
                    } else if (amount < 2000000000) {
                        return LEVEL_2;
                    }
                    return LEVEL_3;
            }
        } else if (NON_TERM_SAVINGS_ACCOUNT === this.salesGroup) {
            let amount = this.safeDepositAmount();
            if (amount < 5000000) {
                return LEVEL_1;
            } else if (amount < 10000000) {
                return LEVEL_2;
            } else if (amount < 50000000) {
                return LEVEL_3;
            } else if (amount < 100000000) {
                return LEVEL_4;
            }
            return LEVEL_5;
        }
        return NO;
    }

    updateInterestReceived() {
        let updateInterestReceived = this.savingRates
            .filter(f => f.salesGroup === this.salesGroup)
            .filter(f => f.currency === this.currency)
            .filter(f => f.threshold === this.calculatedDepositThreshold())
            .first();
        updateInterestReceived.subscribe(next => this.interestReceived = next.interestReceived);
        return updateInterestReceived;
    }

    updateDepositTerm() {
        let updateDepositTerm = this.savingRates
            .filter(f => f.salesGroup === this.salesGroup)
            .filter(f => f.currency === this.currency)
            .filter(f => f.interestReceived === this.interestReceived)
            .filter(f => f.threshold === this.calculatedDepositThreshold())
            .first();
        updateDepositTerm.subscribe(next => this.depositTerm = next.depositTermData);
        return updateDepositTerm;
    }

    calculatedInterestRate(): Observable<number> {
        return this.savingRates
            .filter(f => f.salesGroup === this.salesGroup)
            .filter(f => f.currency === this.currency)
            .filter(f => f.interestReceived === this.interestReceived)
            .filter(f => f.depositTerm === this.depositTerm.term)
            .filter(f => f.depositTermDuration === this.depositTerm.duration)
            .filter(f => f.threshold === this.calculatedDepositThreshold())
            .first()
            .map(m => m.interest)
    }

    safeDepositAmount(): number {
        return this.depositAmount ? Math.abs(this.depositAmount) : 0;
    }

    safeDepositTerm(): number {
        return this.depositTerm ? (this.depositTerm.term * (MONTH === this.depositTerm.duration ? 30 : 7)) : 0;
    }

    calculatedInterestAmount(): Observable<number> {
        return this.calculatedInterestRate()
            .map(m => m / 100)
            .map(m => m * this.safeDepositAmount())
            .map(m => m * this.safeDepositTerm())
            .map(m => m / 360);
    }

    calculatedTotalAmount(): Observable<number> {
        return this.calculatedInterestAmount().map(m => m + this.safeDepositAmount());
    }
}

// currencies
const USD = 'usd';
const EUR = 'eur';

// interest received
const END_OF_TERM = 'endOfTerm';
const QUARTERLY = 'quarterly';
const MONTHLY = 'monthly';
const SIX_MONTH = '6_month';
const NINE_MONTH = '9_month';
const TWELVE_MONTH = '12_month';

// durations
const MONTH = 'month';

// thresholds
const NO = 'no';
const LEVEL_1 = 'level_1';
const LEVEL_2 = 'level_2';
const LEVEL_3 = 'level_3';
const LEVEL_4 = 'level_4';
const LEVEL_5 = 'level_5';

interface DepositTermData {
    term: number;
    duration: string;
}

interface ViewSavingRate extends SavingRate {
    depositTermData: DepositTermData;
}
