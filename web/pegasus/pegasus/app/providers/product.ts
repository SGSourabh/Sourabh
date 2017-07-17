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
export class productProvider {
   cif:any;
    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }


    readLendings(status:any) {
        this.logProvider.info('provider', 'product', 'readLendings');
       let params: URLSearchParams = new URLSearchParams();
        if (status=='false') {
                params.set('needUpdate', 'false');
            }else{
              params.set('needUpdate', 'true');
            }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

       // return this.http.get(ENV.mainApi + '/customerportfolio/' + this.appProvider.current.lead.cif +'/lendings', options)
        return this.http.get(ENV.mainApi + '/customerportfolio/' +this.appProvider.current.lead.cif+'/lendings', options)
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


    readCurrent_account(status:any) {
        this.logProvider.info('provider', 'product', 'readCurrent_account');
        let params: URLSearchParams = new URLSearchParams();
        if (status=='false') {
                params.set('needUpdate', 'false');
            }else{
              params.set('needUpdate', 'true');
            }
       
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        // return this.http.get(ENV.mainApi + '/customerportfolio/' + this.appProvider.current.lead.cif +'/current_account', options)
        return this.http.get(ENV.mainApi + '/customerportfolio/' +this.appProvider.current.lead.cif+'/current_account', options)
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



    readSaving_account(status:any) {
        this.logProvider.info('provider', 'product', 'readSaving_account');
       let params: URLSearchParams = new URLSearchParams();
        if (status=='false') {
                params.set('needUpdate', 'false');
            }else{
              params.set('needUpdate', 'true');
            }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        //return this.http.get(ENV.mainApi + '/customerportfolio/' + this.appProvider.current.lead.cif +'/saving_account', options)
        return this.http.get(ENV.mainApi + '/customerportfolio/' +this.appProvider.current.lead.cif+'/saving_account', options)
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


    readCard(status:any) {
    	
        this.logProvider.info('provider', 'product', 'readCard');
       let params: URLSearchParams = new URLSearchParams();
        if (status=='false') {
        	this.cif=212121212;
                params.set('needUpdate', 'false');
            }else{
            	this.cif=231313131;
              params.set('needUpdate', 'true');
            }

            params.set('nationalId', this.appProvider.current.lead.nationalId);
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        //return this.http.get(ENV.mainApi + '/customerportfolio/' + this.appProvider.current.lead.cif +'/card', options)
        return this.http.get(ENV.mainApi + '/customerportfolio/' +this.appProvider.current.lead.cif+'/card', options)
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


    readInternet_banking(status:any) {
        this.logProvider.info('provider', 'product', 'readInternet_banking');
       let params: URLSearchParams = new URLSearchParams();
        if (status=='false') {
                params.set('needUpdate', 'false');
            }else{
              params.set('needUpdate', 'true');
            }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        //return this.http.get(ENV.mainApi + '/customerportfolio/' + this.appProvider.current.lead.cif +'/internet_banking', options)
        return this.http.get(ENV.mainApi + '/customerportfolio/' +this.appProvider.current.lead.cif+'/internet_banking', options)
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
