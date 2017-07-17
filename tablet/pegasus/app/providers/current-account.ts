import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {CurrentAccount} from "../models/current-account";
import {CustomerBuilder, Customer, ApiSearchCustomerResponseData} from "../models/customer";
import {LeadBuilder, Lead, LeadSearch, ApiSearchLeadResponseData, ApiCreateLeadResponseData, ApiUpdateLeadResponseData, ApiReadLeadResponseData} from "../models/lead";
import {ENV} from "../env";

@Injectable()
export class CurrentAccountProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readCurrentAccounts(): Observable<CurrentAccount[]> {
        this.logProvider.info('provider', 'currentAccount', 'readCurrentAccounts');

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', '-id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/current_applications/', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount[];
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readCurrentAccount(id: number): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'readCurrentAccount');

        if (!id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/current_applications/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount;
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new CurrentAccount());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }


     readCurrentAccountCustomer(): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'readCurrentAccountCustomer');

        // if (!id) {
        //     return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        // }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id , options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount;
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new CurrentAccount());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }


    updateLead(lead: CurrentAccount): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'updateLead');

        if (!lead || !lead.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(lead);
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + lead.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
               return response.json() as CurrentAccount;
            })
            .catch(error => this.appProvider.observableThrow(error));
    }

   validate(lead: CurrentAccount,fullname:any): Observable<Customer[]> {
        this.logProvider.info('provider', 'currentAccount', 'validate');

        if (!lead) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
                        params.set('idType', lead.idType);
                        params.set('nationalId', lead.nationalId);
                        params.set('fullname', fullname);
                      // params.set('idType', '23WD12');
                      // params.set('nationalId', '01187468');
                     
     
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        return this.http.get(ENV.mainApi + '/customers/validate', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount;
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    validateApplication(lead: CurrentAccount): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'validateApplication');

        if (!lead) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
                     // params.set('cif', '12345');
                     // params.set('idType', 'passport');
                     // params.set('nationalId', '01187468');
                     params.set('idType', lead.idType);
                     params.set('nationalId', lead.nationalId);
                     if (this.appProvider.current.lead.cif==null) {
                        params.set('cif', 'other'); 
                     }else{
                     params.set('cif', this.appProvider.current.lead.cif); 
                     
                     }

     
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        return this.http.get(ENV.mainApi + '/accounts/validate', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount;
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }



    readAccountType(): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'validateApplication');


        let params: URLSearchParams = new URLSearchParams();
                     params.set('currencyCode', 'VND');
                     
     
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        return this.http.get(ENV.mainApi + '/accounts/accountTypes', options)
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


    readAccountSummery(): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'validateApplication');

        // if (!lead.accountType['accountType']) {
        //     return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        // }

        let params: URLSearchParams = new URLSearchParams();
                     params.set('currencyCode', 'VND');
                     params.set('depositType', 'c');
                     params.set('accountType', '692');
                     params.set('cif', this.appProvider.current.lead.cif);
                     // if (this.appProvider.current.lead.cif==null) {
                     //    params.set('cif', 'other'); 
                     // }else{
                     //  params.set('cif', this.appProvider.current.lead.cif);   
                     // }   
                    
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
             search: params
        });

        return this.http.get(ENV.mainApi + '/accounts/caSummaries', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() ;
           
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }


    createCurrentAccount(currentAccount: CurrentAccount): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'createCurrentAccount');

        if (!currentAccount || currentAccount.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(new CurrentAccount(currentAccount));
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/current_applications', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount;
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateCurrentAccount(currentAccount: CurrentAccount): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'updateCurrentAccount');

        if (!currentAccount || !currentAccount.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(new CurrentAccount(currentAccount));
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/current_applications/' + currentAccount.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as CurrentAccount;
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    statusFinalise(id): Observable<CurrentAccount> {
        this.logProvider.info('provider', 'currentAccount', 'statusFinalise');

        if (!id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }
         let status = {
                     "status":null,                             
                };
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/current_applications/' + id + '/finalise',JSON.stringify(status), options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json();
            })
            .catch(error => {
                if (error.status === 404) {
                    return Observable.of(new CurrentAccount());
                }
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }
}

