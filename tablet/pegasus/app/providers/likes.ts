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
export class LikesProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    createLikes(salesGroup:any,productType:any) {
        if ( !salesGroup || !productType) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }
        this.logProvider.info('provider', 'likes', 'createLikes');
        let Likes = {
                    // "suggestion":id,
                     "productSalesGroup":salesGroup,
                     "productType":productType,          
                };
        
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id +'/likes', JSON.stringify(Likes),options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
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



    readOneLikes() {
        this.logProvider.info('provider', 'likes', 'readOneLikes');
       
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id +'/likes/'+this.appProvider.current.lead.id, options)
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



    readLikes(productType:any) {
        this.logProvider.info('provider', 'likes', 'readLikes');
         let params: URLSearchParams = new URLSearchParams();
         if(productType){ 
             params.set('productType', productType);}
         
       
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id +'/likes', options)
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


    deleteLikes(id:number) {
        this.logProvider.info('provider', 'likes', 'readLikes');
       
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Device-Handle': this.userProvider.user.handle,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.delete(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id +'/likes/'+id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                //return response.json();
            })
            .catch(error => {
                // if (error.status === 401) {
                //     return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                // }
                return this.appProvider.observableThrow(error);
            });
    }

   
}
