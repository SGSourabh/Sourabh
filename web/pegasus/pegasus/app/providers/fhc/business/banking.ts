import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "../../log";
import {AppProvider} from "../../app";
import {UserProvider} from "./../../user";
import {Banking, BankingBuilder, ApiCreateBankingResponseData} from "../../../models/fhc/business/banking";
import {ENV} from "../../../env";

@Injectable()
export class BankingProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readBanking(id: number): Observable<Banking> {
        this.logProvider.info('provider', 'business', 'banking', 'readBanking');

        if (!id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/bankings/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateBankingResponseData: ApiCreateBankingResponseData = response.json();
                return new BankingBuilder()
                    .fromApiCreateBankingResponseData(apiCreateBankingResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new BankingBuilder().build());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createBanking(banking: Banking): Observable<Banking> {
        this.logProvider.info('provider', 'business', 'banking', 'createBanking');

        if (!banking || banking.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(banking.toApiCreateBankingRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/bankings', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateBankingResponseData: ApiCreateBankingResponseData = response.json();
                return new BankingBuilder()
                    .fromApiCreateBankingResponseData(apiCreateBankingResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateBanking(banking: Banking): Observable<Banking> {
        this.logProvider.info('provider', 'business', 'banking', 'updateBanking');

        if (!banking || !banking.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(banking.toApiUpdateBankingRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/bankings/' + banking.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateBankingResponseData: ApiCreateBankingResponseData = response.json();
                return new BankingBuilder()
                    .fromApiCreateBankingResponseData(apiCreateBankingResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }
}
