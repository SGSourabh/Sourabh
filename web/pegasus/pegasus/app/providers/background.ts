import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {Background, BackgroundBuilder, ApiBackgroundResponseData} from "../models/background";
import {ENV} from "../env";

@Injectable()
export class BackgroundProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readBackground(id: number): Observable<Background> {
        this.logProvider.info('provider', 'background', 'readBackground');

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

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/backgrounds/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiBackgroundResponseData: ApiBackgroundResponseData = response.json();
                return new BackgroundBuilder()
                    .fromApiBackgroundResponseData(apiBackgroundResponseData)
                    .setId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new BackgroundBuilder().build());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createBackground(background: Background): Observable<Background> {
        this.logProvider.info('provider', 'background', 'createBackground');

        if (!background || background.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(background.toApiBackgroundRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/backgrounds', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiBackgroundResponseData: ApiBackgroundResponseData = response.json();
                return new BackgroundBuilder()
                    .fromApiBackgroundResponseData(apiBackgroundResponseData)
                    .setId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateBackground(background: Background): Observable<Background> {
        this.logProvider.info('provider', 'background', 'updateBackground');

        if (!background || !background.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(background.toApiBackgroundRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/backgrounds/' + background.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiBackgroundResponseData: ApiBackgroundResponseData = response.json();
                return new BackgroundBuilder()
                    .fromApiBackgroundResponseData(apiBackgroundResponseData)
                    .setId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    partialUpdateBackground(backgroundId: number, partial: any): Observable<Background> {
        this.logProvider.info('provider', 'background', 'partialUpdateBackground');

        if (!backgroundId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/backgrounds/' + backgroundId, JSON.stringify(partial), options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiBackgroundResponseData: ApiBackgroundResponseData = response.json();
                return new BackgroundBuilder()
                    .fromApiBackgroundResponseData(apiBackgroundResponseData)
                    .setId(this.appProvider.current.lead.id)
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
