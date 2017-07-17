import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {LeadBuilder, Lead, LeadSearch, ApiSearchLeadResponseData, ApiCreateLeadResponseData, ApiUpdateLeadResponseData, ApiReadLeadResponseData} from "../models/lead";
import {CustomerBuilder, Customer, ApiSearchCustomerResponseData} from "../models/customer";
import {ENV} from "../env";

@Injectable()
export class LeadProvider {

    constructor(private appProvider: AppProvider,
                private userProvider: UserProvider,
                private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService) {
        logProvider.class(this);
    }

    readLeads(leadSearch: LeadSearch): Observable<Lead[]> {
        this.logProvider.info('provider', 'leads', 'readLeads');
        let params: URLSearchParams = new URLSearchParams();
        let extraPath: string ="";
        params.set('owner', this.userProvider.user.name);
        if (leadSearch) {
            if (leadSearch.owner) {
                params.set('owner', leadSearch.owner);
            }
            if (leadSearch.productType) {
                params.set('productType', leadSearch.productType);
            }
            if (leadSearch.status) {
                params.set('status', leadSearch.status);
            }
            if (leadSearch.from && leadSearch.to) {
                params.set('from', leadSearch.from);
                params.set('to', leadSearch.to);
            }
            if (leadSearch.favourite) {
                params.set('favourite', leadSearch.favourite.toString());
            }
            if (leadSearch.favourite) {
                params.set('favourite', leadSearch.favourite.toString());
            }
             if (leadSearch.newlead) {
                params.set('status', 'customer_verification');
            }
             if (leadSearch.followUp) {
                params.set('fstatus', 'recommendation');
            }
            if (leadSearch.urgent) {
                extraPath = "/oldest";
            }
            if (leadSearch.nationalId) {
                params.set('nationalId', leadSearch.nationalId.toString());
            }
            if (leadSearch.limit) {
                params.set('_limit', leadSearch.limit.toString());
            }
            if (leadSearch.sort) {
                params.set('_sort', leadSearch.sort.toString());
            }
            if (leadSearch.fields) {
                params.set('_fields', leadSearch.fields.toString());
            }
        }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
            search: params
        });
        return this.http.get(ENV.mainApi + '/leads' + extraPath, options).timeout(ENV.timeout).map(response => {
            if (response.status !== 200) {
                throw Error(this.translateService.instant('message.failed'));
            }
            let apiSearchLeadResponseDatas: ApiSearchLeadResponseData[] = response.json();
            return apiSearchLeadResponseDatas.map(apiSearchLeadResponseData =>
                new LeadBuilder()
                    .fromApiSearchLeadResponseData(apiSearchLeadResponseData)
                    .build()
            );
        }).catch(error => {
            if (error.status === 401) {
                return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
            }
            return this.appProvider.observableThrow(error);
        });
    }

    createLead(lead: Lead): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'createLead');

        if (!lead || lead.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        lead.source = 'pegasus';
        let body = JSON.stringify(lead.toApiCreateLeadRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateLeadResponseData: ApiCreateLeadResponseData = response.json();
                return new LeadBuilder()
                    .fromApiCreateLeadResponseData(apiCreateLeadResponseData)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readCustomers(lead: Lead): Observable<Customer[]> {
        this.logProvider.info('provider', 'lead', 'readCustomers');

        if (!lead) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('firstName', lead.name);
        params.set('lastName', lead.surname);
        params.set('phone', lead.phone);
        params.set('productType', lead.productType);
        if (lead.nationalId) {
            params.set('nationalId', lead.nationalId);
        }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/customers', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiSearchCustomerResponseDatas: ApiSearchCustomerResponseData[] = response.json();
                return apiSearchCustomerResponseDatas.map(apiSearchCustomerResponseData =>
                    new CustomerBuilder()
                        .fromApiSearchCustomerResponseData(apiSearchCustomerResponseData)
                        .build()
                );
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateLead(lead: Lead): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'updateLead');

        if (!lead || !lead.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(lead.toApiUpdateLeadRequestData());
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
                let apiUpdateLeadResponseData: ApiUpdateLeadResponseData = response.json();
                return new LeadBuilder()
                    .fromApiUpdateLeadResponseData(apiUpdateLeadResponseData)
                    .setId(lead.id)
                    .build();
            })
            .catch(error => this.appProvider.observableThrow(error));
    }

    readLead(id: number): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'readLead');

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

        return this.http.get(ENV.mainApi + '/leads/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiReadLeadResponseData: ApiReadLeadResponseData = response.json();
                return new LeadBuilder()
                    .fromApiReadLeadResponseData(apiReadLeadResponseData)
                    .setId(id).build();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    partialUpdateLead(leadId: number, partial: any): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'partialUpdateLead');

        if (!leadId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + leadId, JSON.stringify(partial), options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiUpdateLeadResponseData: ApiUpdateLeadResponseData = response.json();
                return new LeadBuilder()
                    .fromApiUpdateLeadResponseData(apiUpdateLeadResponseData)
                    .setId(leadId)
                    .build();
            })
            .catch(error => this.appProvider.observableThrow(error));
    }

    readSummery(lead_Id: any): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'readSummery');

        if (!lead_Id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('_fields', lead_Id);
        
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/leads/summaries', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiSearchCustomerResponseDatas: ApiSearchCustomerResponseData[] = response.json();
                return apiSearchCustomerResponseDatas.map(apiSearchCustomerResponseData =>
                    new CustomerBuilder()
                        .fromApiSearchCustomerResponseData(apiSearchCustomerResponseData)
                        .build()
                );
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    leadCopy(owner:any,product:any): Observable<Lead> {
        this.logProvider.info('provider', 'selection', 'leadCopy');

        if (!this.appProvider.current.lead.id ) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let userRegistration = {
                     "status":'customer_verification',
                     "name": this.appProvider.current.lead.name,
                     "phone": this.appProvider.current.lead.phone,
                     "productType": product,
                     "surname": this.appProvider.current.lead.surname,
                     "branch": '',
                     "email": this.appProvider.current.lead.email,
                     "fullName": this.appProvider.current.lead.fullname,
                     "owner": owner.login
                };
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });
         console.log(JSON.stringify(userRegistration))
        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/copy', JSON.stringify(userRegistration), options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readSummeryDashboard(user:any): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'readSummery');

        if (!user) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        // let params: URLSearchParams = new URLSearchParams();
        // params.set('_fields', user);
        
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
            
        });

        return this.http.get(ENV.mainApi + '/leads/summaries/'+user, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return  response.json();
             
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readOldest(): Observable<Lead> {
        this.logProvider.info('provider', 'lead', 'readOldest');

        // if (!user) {
        //     return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        // }

        // let params: URLSearchParams = new URLSearchParams();
        // params.set('_fields', user);
        
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
           
        });

        return this.http.get(ENV.mainApi + '/leads/oldest', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return  response.json();
             
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

}
