import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "../../log";
import {AppProvider} from "../../app";
import {UserProvider} from "./../../user";
import {Lending, LendingBuilder, ApiCreateLendingResponseData} from "../../../models/fhc/business/lending";
import {ENV} from "../../../env";

@Injectable()
export class LendingProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readLending(id: number): Observable<Lending> {
        this.logProvider.info('provider', 'business', 'lending', 'readLending');

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

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/lendings/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateLendingResponseData: ApiCreateLendingResponseData = response.json();
                return new LendingBuilder()
                    .fromApiCreateLendingResponseData(apiCreateLendingResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new LendingBuilder().build());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createLending(lending: Lending): Observable<Lending> {
        this.logProvider.info('provider', 'business', 'lending', 'createLending');

        if (!lending || lending.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(lending.toApiCreateLendingRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/lendings', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateLendingResponseData: ApiCreateLendingResponseData = response.json();
                return new LendingBuilder()
                    .fromApiCreateLendingResponseData(apiCreateLendingResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateLending(lending: Lending): Observable<Lending> {
        this.logProvider.info('provider', 'business', 'lending', 'updateLending');

        if (!lending || !lending.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(lending.toApiUpdateLendingRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/lendings/' + lending.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateLendingResponseData: ApiCreateLendingResponseData = response.json();
                return new LendingBuilder()
                    .fromApiCreateLendingResponseData(apiCreateLendingResponseData)
                    .setId(lending.id)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }
}
