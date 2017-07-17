import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ENV} from "../env";
import {Events} from "ionic-angular";
import {Observable} from "rxjs/Observable";
import {User, UserBuilder, UserProfile} from "../models/user";

@Injectable()
export class UserProvider {
    user: User;
    userProfile: UserProfile;
    handle: string;

    constructor(private appProvider: AppProvider,
                private logProvider: LogProvider,
                private http: Http,
                private events: Events,
                private translateService: TranslateService) {
        logProvider.class(this);
        if (ENV.bypass) {
            this.handle = 'UIDPASSWORD cred="UGVnYXN1c01vYmlsZUFwcDpjMTZkZDRkNy00ZjhhLTQxM2UtYjgzZC04M2RmZTI3M2QwZDg="';
            this.buildFrom('vib_user', 'dmliX3VzZXI=');
            this.userProfile = {
                login: "vib_user",
                name: "VIB user",
                branch: "4",
                phone: "0969222465",
                title: "Trợ lý quản lý khách hàng",
                email: "vib_user@vib.com.vn",
                introduction: "Lê Quang Hà\nTrợ lý Quản lý khách hàng",
                branchId:"4",
            }
        }
        events.subscribe('user:logout', () => {
            delete this.user;
            delete this.userProfile;
        });
    }

    buildFrom(name: string, token: string) {
        this.user = new UserBuilder()
            .setName(name)
            .setToken(token)
            .setHandle(this.handle)
            .build();
    }

    get loggedIn(): boolean {
        return this.user ? true : false;
    }

    readUserProfile(login: string): Observable<UserProfile> {
        this.logProvider.info('provider', 'user', 'readUserProfile');

        if (!login) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/users/' + login, options)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return this.userProfile = response.json() as UserProfile;
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    translation(name: string): Observable<any> {
        return this.http.get('i18n/' + name + '.json')
            .map(response => response.json())
            .catch(error => this.appProvider.observableThrow(error));
    }

    userKpiScore(user: any): Observable<any> {
        this.logProvider.info('provider', 'user', 'userKpiScore');

        if (!user) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('login', user);

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/users/kpiscore', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json();

            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }
}
