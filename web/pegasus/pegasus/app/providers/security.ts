import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Rx";
import {LogProvider} from "./log";
import {CordovaProvider} from "./cordova";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {ENV} from "../env";
import {ApiRegisterIn, Register, RegisterBuilder, Registered, ApiAuthenticateIn, AuthenticateBuilder, Authenticate} from "../models/security";

@Injectable()
export class SecurityProvider {

    constructor(private logProvider: LogProvider,
                private cordovaProvider: CordovaProvider,
                private http: Http,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private platform: Platform) {
        logProvider.class(this);
    }

    registered(): Observable<Registered> {
        this.logProvider.info('provider', 'security', 'registered');
        return Observable.fromPromise(this.cordovaProvider.getStoredText('auth.token'))
            .map(result => new Registered(result))
            .catch(error => this.appProvider.observableThrow(error));
    }

    register(username: string, password: string): Observable<Register> {
        this.logProvider.info('provider', 'security', 'register');

        if (!username || !password) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        return Observable.fromPromise(this.cordovaProvider.device())
            .flatMap(device => {
                let apiRegisterIn: ApiRegisterIn = {
                    "username": username,
                    "password": password,
                    "osversion": device.version,
                    "ostype": device.platform,
                    "udid": device.uuid,
                    "clientId": "PegasusMobileApp"
                };
                let options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
                return this.http.post(ENV.securityApi + '/register', JSON.stringify(apiRegisterIn), options)
                    .timeout(ENV.timeout);
            })
            .map(response =>
                new RegisterBuilder()
                    .fromApiRegisterOut(response.json())
                    .build())
            .flatMap(register => this.cordovaProvider.storeText('auth.token', register.handle).then(() => register))
            .catch(error => {
                if (error.status === 0) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.networkInvalid'));
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    authenticate(username: string, password: string): Observable<Authenticate> {
        this.logProvider.info('provider', 'security', 'authenticate');

        if (!username || !password) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        return this.registered()
            .flatMap(registered => {
                let apiAuthenticateIn: ApiAuthenticateIn = {
                    username: username,
                    password: password
                };
                let options = new RequestOptions({
                    headers: new Headers(
                        {
                            'Content-Type': 'application/json',
                            'Device-Handle': registered.handle
                        }
                    )
                });
                return this.http.post(ENV.securityApi + '/authenticate', JSON.stringify(apiAuthenticateIn), options)
                    .timeout(ENV.timeout);
            })
            .map(response =>
                new AuthenticateBuilder()
                    .fromApiAuthenticateOut(response.json())
                    .build())
            .catch(error => {
                if (error.status === 0) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.networkInvalid'));
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    logout(): Observable<boolean> {
        this.logProvider.info('provider', 'security', 'logout');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });
        localStorage.clear();
        return this.http.delete(ENV.securityApi + '/delete', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return true;
            })
            .catch(error => this.appProvider.observableThrow(error));
    }

}
