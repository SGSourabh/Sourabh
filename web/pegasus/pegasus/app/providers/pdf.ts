import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {CordovaProvider} from "./cordova";
import {ENV} from "../env";
import {StoredData} from "../models/cordova";
import {Email} from "../models/email";

@Injectable()
export class PdfProvider {

    constructor(private appProvider: AppProvider,
                private userProvider: UserProvider,
                private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }
    generateAndStorePdfFile(jsonContent: string, filename: string): Observable<StoredData> {
        this.logProvider.info('provider', 'pdf', 'generateAndStorePdfFile');

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });
        return this.http.post(ENV.mainApi + '/documents', jsonContent, options)
            .timeout(ENV.timeout)
            .flatMap(response =>{
                window.open("data:application/pdf;base64," + response.text() );
                return ' ';
            })
            .catch(error => this.appProvider.observableThrow(error));
    }
    generateAndStorePdfFileEmail(jsonContent: string, filename: string): Observable<StoredData> {
        this.logProvider.info('provider', 'pdf', 'generateAndStorePdfFile');

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });
        return this.http.post(ENV.mainApi + '/documents', jsonContent, options)
            .timeout(ENV.timeout)
            .map(response =>{
                 return response.text()
            })
            .catch(error => this.appProvider.observableThrow(error));
    }
    emaill(email: Email, filename: string,pdfdata:any): Observable<string> {
        this.logProvider.info('provider', 'pdf', 'generateAndStorePdfFile');

                let options = new RequestOptions({
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain',
                        'User':this.appProvider.current.user,
                        'Token': this.userProvider.user.token
                    })
                });
                 email.attachment = pdfdata;
                return this.http.post(ENV.mainApi + '/emails', JSON.stringify(email), options)
                    .timeout(ENV.timeout)
                    .flatMap(response =>{
                        if (response.status !== 200) {
                           throw Error(this.translateService.instant('message.failed'));
                         }
                       return response.statusText
                    })
                   .catch(error => this.appProvider.observableThrow(error));
    }
    email(email: Email, filename: string): Observable<string> {
        this.logProvider.info('provider', 'pdf', 'email');
        return Observable.fromPromise(this.cordovaProvider.getStoredBase64Data(filename))
            .flatMap(data => {
                let options = new RequestOptions({
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'User':this.appProvider.current.user,
                        'Token': this.userProvider.user.token
                    })
                });
                email.attachment = data;
                return this.http.post(ENV.mainApi + '/emails', JSON.stringify(email), options);
            })
            .map(response => {
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.statusText
            })
            .catch(error => this.appProvider.observableThrow(error));
         
    }

}
