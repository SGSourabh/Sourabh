import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {Selection, SelectionBag} from "../models/selection";
import {ENV} from "../env";

@Injectable()
export class SelectionProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readSelections(suggestionId: number): Observable<Selection[]> {
        this.logProvider.info('provider', 'selection', 'readSelections');

        if (!this.appProvider.current.lead.id || !suggestionId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', '-id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/suggestions/' + suggestionId + '/selections', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return (response.json() as SelectionBag[]).map(m => new Selection(m));
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readSelection(id: number, suggestionId: number): Observable<Selection> {
        this.logProvider.info('provider', 'selection', 'readSelection');

        if (!this.appProvider.current.lead.id || !suggestionId || !id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/suggestions/' + suggestionId + '/selections/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return new Selection(response.json());
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createSelection(selection: Selection, suggestionId: number): Observable<Selection> {
        this.logProvider.info('provider', 'selection', 'createSelection');

        if (!this.appProvider.current.lead.id || !selection || selection.id || !suggestionId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(selection.toCreate());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/suggestions/' + suggestionId + '/selections', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return new Selection(response.json());
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateSelection(selection: Selection, suggestionId: number): Observable<Selection> {
        this.logProvider.info('provider', 'selection', 'updateSelection');

        if (!this.appProvider.current.lead.id || !selection || !selection.id || !suggestionId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(selection.toUpdate());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/suggestions/' + suggestionId + '/selections/' + selection.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return new Selection(response.json());
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }



    patchSelection(selection: Selection, suggestionId: number,user:any): Observable<Selection> {
        this.logProvider.info('provider', 'selection', 'updateSelection');

        if (!this.appProvider.current.lead.id || !selection || !selection.id || !suggestionId || !user) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

       let referelstatus = {
                     "recipient":user,
                     "status":'referred'            
                };
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/suggestions/' + suggestionId + '/selections/' + selection.id,JSON.stringify(referelstatus), options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
               return new Selection(response.json());
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    deleteSelection(id: number, suggestionId: number): Observable<void> {
        this.logProvider.info('provider', 'selection', 'deleteSelection');

        if (!this.appProvider.current.lead.id || !id || !suggestionId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.delete(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/suggestions/' + suggestionId + '/selections/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
            }).catch(error => {
                return this.appProvider.observableThrow(error);
            });
    }

    readSelectionsByLead(): Observable<Selection[]> {
        this.logProvider.info('provider', 'selection', 'readSelectionsByLead');

        if (!this.appProvider.current.lead.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', '-id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/selections', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return (response.json() as SelectionBag[]).map(m => new Selection(m));
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }


    userDesignation(user_id:any): Observable<Selection[]> {
        this.logProvider.info('provider', 'suggestion', 'userDesignation');

        if (!this.appProvider.current.lead.id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('login', user_id);
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/users/enriched', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
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

    
}
