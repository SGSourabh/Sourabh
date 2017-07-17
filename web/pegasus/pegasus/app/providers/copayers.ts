import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {LendingCopayer} from "../models/copayers";
import {ENV} from "../env";

@Injectable()
export class CopayersProvider {

    constructor(private appProvider: AppProvider,
                private userProvider: UserProvider,
                private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService) {
        logProvider.class(this);
    }

    readCopayers(lendingId: number): Observable<LendingCopayer[]> {
        this.logProvider.info('provider', 'lendingCopayers', 'readCopayers');

        if (!lendingId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', '-id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
            search: params
        });
        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/basic_lending_applications/' + lendingId + '/copayers', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return (response.json() as LendingCopayer[]).map(m => new LendingCopayer(m));
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readCopayer(lendingId: number, id: number): Observable<LendingCopayer> {
        this.logProvider.info('provider', 'lendingCopayer', 'readCopayer');

        if (!lendingId || !id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/basic_lending_applications/' + lendingId + '/copayers/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return new LendingCopayer(response.json());
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createCopayer(lendingId: number, lendingCopayer: LendingCopayer): Observable<LendingCopayer> {
        this.logProvider.info('provider', 'lendingCopayer', 'createCopayer');

        if (!lendingId || !lendingCopayer || lendingCopayer.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(lendingCopayer);
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/basic_lending_applications/' + lendingId + '/copayers', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return new LendingCopayer(response.json());
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateCopayer(lendingId: number, lendingCopayer: LendingCopayer): Observable<LendingCopayer> {
        this.logProvider.info('provider', 'lendingCopayer', 'updateCopayer');

        if (!lendingId || !lendingCopayer || !lendingCopayer.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(lendingCopayer);
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/basic_lending_applications/' + lendingId + '/copayers/' + lendingCopayer.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return new LendingCopayer(response.json());
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    deleteCopayer(lendingId: number, id: number): Observable<void> {
        this.logProvider.info('provider', 'lendingCopayer', 'deleteCopayer');

        if (!lendingId || !id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.delete(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/basic_lending_applications/' + lendingId + '/copayers/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
            })
            .catch(error => this.appProvider.observableThrow(error));
    }
}
