import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "../../log";
import {AppProvider} from "../../app";
import {UserProvider} from "./../../user";
import {Protect, ProtectBuilder, ApiCreateProtectResponseData} from "../../../models/fhc/business/protect";
import {ENV} from "../../../env";

@Injectable()
export class ProtectProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readProtect(id: number): Observable<Protect> {
        this.logProvider.info('provider', 'business', 'protect', 'readProtect');

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

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/protects/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateProtectResponseData: ApiCreateProtectResponseData = response.json();
                return new ProtectBuilder()
                    .fromApiCreateProtectResponseData(apiCreateProtectResponseData)
                    .setLeadId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new ProtectBuilder().build());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createProtect(protect: Protect): Observable<Protect> {
        this.logProvider.info('provider', 'business', 'protect', 'createProtect');

        if (!protect || protect.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(protect.toApiCreateProtectRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/protects', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateProtectResponseData: ApiCreateProtectResponseData = response.json();
                return new ProtectBuilder()
                    .fromApiCreateProtectResponseData(apiCreateProtectResponseData)
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

    updateProtect(protect: Protect): Observable<Protect> {
        this.logProvider.info('provider', 'business', 'protect', 'updateProtect');

        if (!protect || !protect.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(protect.toApiUpdateProtectRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/fhcs/businesses/protects/' + protect.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateProtectResponseData: ApiCreateProtectResponseData = response.json();
                return new ProtectBuilder()
                    .fromApiCreateProtectResponseData(apiCreateProtectResponseData)
                    .setId(protect.id)
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
