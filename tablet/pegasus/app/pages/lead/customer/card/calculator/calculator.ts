import {Component, OnInit} from "@angular/core";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../../providers/log";
import {AppProvider} from "../../../../../providers/app";
import {CurrencyDirective} from "../../../../../directives/currency";
import {Observable} from "rxjs";
import {PLATINUM_DOUBLE_CASH_BACK, GOLD_CREDIT_CARD, PLATINUM_DEBIT_CARD, CLASSIC_DEBIT_CARD} from "../../../../../models/product";
import {Document, Section} from "../../../../../models/pdf";
import {DecimalPipe} from "@angular/common";
import {CurrencyPipe} from "../../../../../pipes/currency";
import {PdfProvider} from "../../../../../providers/pdf";
import {LoadingController, NavController} from "ionic-angular";
import {CordovaProvider} from "../../../../../providers/cordova";
import {UserProvider} from "../../../../../providers/user";

@Component({
    templateUrl: 'build/pages/lead/customer/card/calculator/calculator.html',
    pipes: [TranslatePipe],
    directives: [CurrencyDirective],
    providers: [PdfProvider]
})
export class CalculatorPage implements OnInit {
    models: Spending[];
    private applicationFileName: string = "Cashback.pdf";

    constructor(private appProvider: AppProvider,
                private logProvider: LogProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private loadingCtrl: LoadingController,
                private pdfDocumentProvider: PdfProvider,
                private cordovaProvider: CordovaProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        SPENDINGS
            .filter(f => f.salesGroup === this.appProvider.current.salesGroupData.salesGroup)
            .map(m => new Spending(m))
            .toArray()
            .subscribe(next => this.models = next);
    }

    calculatedTotalMonthlyCashback() {
        let total = this.models
            .map(m => m.calculatedCashback())
            .reduce((a, b) => a + b);

        switch (this.appProvider.current.salesGroupData.salesGroup) {
            case PLATINUM_DOUBLE_CASH_BACK:
                return Math.min(total, LIMIT_PLATINUM_DOUBLE_CASH_BACK);
            case GOLD_CREDIT_CARD:
                return Math.min(total, LIMIT_GOLD_CREDIT_CARD);
            case PLATINUM_DEBIT_CARD:
                return Math.min(total, LIMIT_PLATINUM_DEBIT_CARD);
            case CLASSIC_DEBIT_CARD:
                return Math.min(total > THRESHOLD_CLASSIC_DEBIT_CARD ? 50000 + ((total - THRESHOLD_CLASSIC_DEBIT_CARD) * (0.3 / 100)) : total * (5 / 100), LIMIT_CLASSIC_DEBIT_CARD);
            default:
                this.appProvider.createAlert(this.translateService.instant('message.invalid'));
        }
    }

    calculatedTotalYearlyCashback() {
        return this.calculatedTotalMonthlyCashback() * 12;
    }

    buildDocument(): Document {
        let total = this.translateService.instant('lead.card.calculator.total') + ' ';
        let vnd = ' (' + this.translateService.instant('lead.lending.calculator.vnd') + ')';
        let currencyPipe = new CurrencyPipe();
        let decimalPipe = new DecimalPipe();
        let document: Document = {
            headerTitle: this.translateService.instant('lookup.productSalesGroup.' + this.appProvider.current.salesGroupData.salesGroup),
            headerSubTitle: this.translateService.instant('lead.card.calculator.cashback'),
            subHeaderItems: [
                {
                    label: total + this.translateService.instant('lead.card.calculator.monthlyCashback') + vnd,
                    value: decimalPipe.transform(this.calculatedTotalMonthlyCashback(), '1.2-2')
                },
                {
                    label: null,
                    value: null
                },
                {
                    label: total + this.translateService.instant('lead.card.calculator.yearlyCashback') + vnd,
                    value: decimalPipe.transform(this.calculatedTotalYearlyCashback(), '1.2-2')
                }
            ],
            sections: [
                {
                    title: this.translateService.instant('lead.card.calculator.category')
                }
            ]
        };
        this.models.forEach(m => {
            let section: Section = {
                "header": this.translateService.instant('lead.card.calculator.' + m.data.category),
                "items": [
                    {"label": this.translateService.instant('lead.card.calculator.monthlySpending') + vnd, "value": currencyPipe.transform(m.spending)}
                ]
            };
            if (this.appProvider.current.salesGroupData.salesGroup !== 'classic_debit_card') {
                section.items.push({"label": this.translateService.instant('lead.card.calculator.cashback') + vnd, "value": decimalPipe.transform(m.calculatedCashback(), '1.2-2')});
            }
            document.sections.push(section);
        });
        this.logProvider.info('buildDocument', document);
        return document;
    }

    onClose() {
        this.navController.pop();
    }

    onEmail() {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
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
                    //,
                    //  flex1: this.translateService.instant('lookup.productSalesGroup.' + this.appProvider.current.salesGroupData.salesGroup)
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
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.pdfDocumentProvider.generateAndStorePdfFile(JSON.stringify(this.buildDocument()), this.applicationFileName))
            .subscribe(data =>
                    loading.dismiss().then(() => this.cordovaProvider.openDocumentsPdf(this.applicationFileName))
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
}

class Spending {
    spending: number;

    constructor(public data: SpendingData) {
        this.spending = 0;
    }

    calculatedCashback() {
        return this.data.cashback(this.spending);
    }
}

// categories
const SUPERMARKET = 'supermarket';
const DEPARTMENT_STORE = 'departmentStore';
const RESTAURANT = 'restaurant';
const HOTEL = 'hotel';
const AIRLINE_TICKET = 'airlineTicket';
const ELECTRONIC = 'electronic';
const E_COMMERCE = 'eCommerce';
const OVERSEA = 'oversea';
const OTHER_PURCHASES = 'otherPurchases';
const REPAYMENT = 'repayment';

// limits
const LIMIT_PLATINUM_DOUBLE_CASH_BACK = 5000000;
const LIMIT_GOLD_CREDIT_CARD = 300000;
const LIMIT_PLATINUM_DEBIT_CARD = 500000;
const LIMIT_CLASSIC_DEBIT_CARD = 1000000;
const THRESHOLD_CLASSIC_DEBIT_CARD = 1000000;

interface SpendingData {
    salesGroup: string;
    category: string;
    cashback: (spending: number) => number;
}

const SPENDINGS: Observable<SpendingData> = Observable.of(
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: SUPERMARKET, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: DEPARTMENT_STORE, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: RESTAURANT, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: HOTEL, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: AIRLINE_TICKET, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: ELECTRONIC, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: E_COMMERCE, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: OVERSEA, cashback: spending => Math.min((1.00 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: OTHER_PURCHASES, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: PLATINUM_DOUBLE_CASH_BACK, category: REPAYMENT, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DOUBLE_CASH_BACK)},
    {salesGroup: GOLD_CREDIT_CARD, category: SUPERMARKET, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: DEPARTMENT_STORE, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: RESTAURANT, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: HOTEL, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: AIRLINE_TICKET, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: ELECTRONIC, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: E_COMMERCE, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: OVERSEA, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: GOLD_CREDIT_CARD, category: OTHER_PURCHASES, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_GOLD_CREDIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: SUPERMARKET, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: DEPARTMENT_STORE, cashback: spending => Math.min((1.00 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: RESTAURANT, cashback: spending => Math.min((1.00 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: HOTEL, cashback: spending => Math.min((1.00 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: AIRLINE_TICKET, cashback: spending => Math.min((1.00 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: ELECTRONIC, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: E_COMMERCE, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: OVERSEA, cashback: spending => Math.min((1.00 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: PLATINUM_DEBIT_CARD, category: OTHER_PURCHASES, cashback: spending => Math.min((0.50 / 100) * Math.abs(spending), LIMIT_PLATINUM_DEBIT_CARD)},
    {salesGroup: CLASSIC_DEBIT_CARD, category: SUPERMARKET, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: DEPARTMENT_STORE, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: RESTAURANT, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: HOTEL, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: AIRLINE_TICKET, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: ELECTRONIC, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: E_COMMERCE, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: OVERSEA, cashback: spending => spending},
    {salesGroup: CLASSIC_DEBIT_CARD, category: OTHER_PURCHASES, cashback: spending => spending}
);
