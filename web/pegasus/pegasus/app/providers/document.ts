import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {Lead} from "../models/lead";
import {Document, DocumentBuilder, ApiReadDocumentResponseData, ApiCreateDocumentResponseData, ApiUpdateDocumentResponseData} from "../models/document";
import {ENV} from "../env";

@Injectable()
export class DocumentProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider) {
        logProvider.class(this);
    }

    readDocuments(): Observable<Document[]> {
        this.logProvider.info('provider', 'documents', 'readDocuments');

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', '-id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/documents', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiDocumentsResponseData: ApiReadDocumentResponseData[] = response.json();
                return apiDocumentsResponseData.map(apiDocumentResponseData =>
                    new DocumentBuilder().fromApiReadDocumentResponseData(apiDocumentResponseData)
                        .setEntityIdNumber(this.appProvider.current.lead.id)
                        .setEntityIdType("Lead")
                        .build());
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readDocument(id: number): Observable<Document> {
        this.logProvider.info('provider', 'document', 'readDocument');

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

        return this.http.get(ENV.mainApi + '/documents/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiReadDocumentResponseData: ApiReadDocumentResponseData = response.json();
                return new DocumentBuilder()
                    .fromApiReadDocumentResponseData(apiReadDocumentResponseData)
                    .setId(id)
                    .setEntityIdNumber(this.appProvider.current.lead.id)
                    .setEntityIdType("Lead")
                    .build();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createDocument(document: Document): Observable<Document> {
        this.logProvider.info('provider', 'document', 'createDocument');

        if (!document || !document.entityIdNumber || !document.entityIdType) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(document.toApiCreateDocumentRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/documents', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateDocumentResponseData: ApiCreateDocumentResponseData = response.json();
                return new DocumentBuilder()
                    .fromApiCreateDocumentResponseData(apiCreateDocumentResponseData)
                    .setEntityIdNumber(this.appProvider.current.lead.id)
                    .setEntityIdType("Lead")
                    .build();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateDocument(document: Document): Observable<Document> {
        this.logProvider.info('provider', 'document', 'updateDocument');

        if (!document || !document.entityIdNumber || !document.entityIdNumber || !document.entityIdType) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(document.toApiUpdateDocumentRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/documents/' + document.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiUpdateLeadResponseData: ApiUpdateDocumentResponseData = response.json();
                return new DocumentBuilder()
                    .fromApiUpdateDocumentResponseData(apiUpdateLeadResponseData)
                    .setId(document.id).setEntityIdNumber(this.appProvider.current.lead.id)
                    .setEntityIdType("Lead")
                    .build();
            }).catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

}
