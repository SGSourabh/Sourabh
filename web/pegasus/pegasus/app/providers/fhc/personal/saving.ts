import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "../../log";
import {AppProvider} from "../../app";
import {UserProvider} from "./../../user";
import {Saving, SavingBuilder, ApiCreateSavingResponseData} from "../../../models/fhc/personal/saving";
import {ENV} from "../../../env";

@Injectable()
export class SavingProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readSaving(id: number): Observable<Saving> {
        this.logProvider.info('provider', 'personal', 'saving', 'readSaving');

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

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/personals/savings/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateSavingResponseData: ApiCreateSavingResponseData = response.json();
                return new SavingBuilder()
                    .fromApiCreateSavingResponseData(apiCreateSavingResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new SavingBuilder().build());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createSaving(saving: Saving): Observable<Saving> {
        this.logProvider.info('provider', 'personal', 'saving', 'createSaving');

        if (!saving || saving.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(saving.toApiCreateSavingRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/personals/savings', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateSavingResponseData: ApiCreateSavingResponseData = response.json();
                return new SavingBuilder()
                    .fromApiCreateSavingResponseData(apiCreateSavingResponseData)
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

    updateSaving(saving: Saving): Observable<Saving> {
        this.logProvider.info('provider', 'personal', 'saving', 'updateSaving');

        if (!saving || !saving.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(saving.toApiUpdateSavingRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/personals/savings/' + saving.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateSavingResponseData: ApiCreateSavingResponseData = response.json();
                return new SavingBuilder()
                    .fromApiCreateSavingResponseData(apiCreateSavingResponseData)
                    .setId(saving.id)
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
