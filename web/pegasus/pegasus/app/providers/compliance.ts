import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {ComplianceBuilder, Compliance, ApiComplianceResponseData} from "../models/compliance";
import {ENV} from "../env";

@Injectable()
export class ComplianceProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readCompliance(): Observable<Compliance> {
        this.logProvider.info('provider', 'compliance', 'readCompliance');

        let params: URLSearchParams = new URLSearchParams();
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/compliances/' + this.appProvider.current.lead.id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiComplianceResponseData: ApiComplianceResponseData = response.json();
                return new ComplianceBuilder()
                    .fromApiComplianceResponseData(apiComplianceResponseData)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateCompliance(check: Compliance): Observable<Compliance> {
        this.logProvider.info('provider', 'compliance', 'updateCompliance');
        if (!check) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }
        return Observable.of(new ComplianceBuilder()
            .fromCompliance(check)
            .build()
        );
    }
}
