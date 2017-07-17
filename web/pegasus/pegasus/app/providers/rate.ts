import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {LendingRate, SavingRate} from "../models/rate";
import {ENV} from "../env";

@Injectable()
export class RateProvider {
    private _lendingRates: Observable<LendingRate[]>;
    private _savingRates: Observable<SavingRate[]>;

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readLendingRates(): Observable<LendingRate[]> {
        this.logProvider.info('provider', 'rate', 'readLendingRates');

        if (this._lendingRates) {
            return this._lendingRates;
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', 'id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/productRates/lending_product_rates', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as LendingRate[]
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readSavingRates(): Observable<SavingRate[]> {
        this.logProvider.info('provider', 'rate', 'readSavingRates');

        if (this._savingRates) {
            return this._savingRates;
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', 'id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/productRates/saving_product_rates', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as SavingRate[]
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }
}
