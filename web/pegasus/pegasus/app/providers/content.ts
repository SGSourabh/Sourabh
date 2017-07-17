import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {ENV} from "../env";
import {Content} from "../models/content";
import {CordovaProvider} from "./cordova";

@Injectable()
export class ContentProvider {

    constructor(private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService,
                public appProvider: AppProvider,
                private userProvider: UserProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    private static merge(a: Content[], b: Content[]): Content[] {
        let contents = a.concat(b);
        for (let i = 0; i < contents.length; ++i) {
            for (let j = i + 1; j < contents.length; ++j) {
                if (contents[i].path === contents[j].path) {
                    contents[i].version = Math.max(contents[i].version, contents[j].version);
                    contents.splice(j--, 1);
                }
            }
        }
        return contents
    }

    private static diff(a: Content[], b: Content[]): Content[] {
        return a.filter(filterA => {
            let found = b.find(findB => filterA.path === findB.path);
            return found ? filterA.version > found.version : true;
        });
    }

    writeContents(contents: Content[]): Promise<void> {
        this.logProvider.info('provider', 'content', 'writeContents');

        return this.cordovaProvider.getStoredText('contents.json')
            .then(text => JSON.parse(text) as Content[])
            .then(storedContents => contents = ContentProvider.merge(contents, storedContents))
            .catch(error => console.info('contents.json not stored'))
            .then(() => this.cordovaProvider.storeText('contents.json', JSON.stringify(contents)))
    }

    readContents(): Observable<Content[]> {
        this.logProvider.info('provider', 'content', 'readContents');

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/contents', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.json() as Content[];
            })
            .flatMap(contents =>
                this.cordovaProvider.getStoredText('contents.json')
                    .then(text => JSON.parse(text) as Content[])
                    .then(storedContents => contents = ContentProvider.diff(contents, storedContents))
                    .catch(error => console.info('contents.json not stored'))
                    .then(() => contents)
            )
            .catch(error => {
                return this.appProvider.observableThrow(error);
            });
    }

    readContent(path: string): Observable<string> {
        this.logProvider.info('provider', 'content', 'readContent', path);

        if (!path) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let params: URLSearchParams = new URLSearchParams();
        params.set('path', path);
        let options = new RequestOptions({
            headers: new Headers({
                'Accept': 'text/plain',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }), search: params
        });

        return this.http.get(ENV.mainApi + '/contents/content', options)
            .timeout(300000)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                return response.text();
            }).catch(error => {
                return this.appProvider.observableThrow(error);
            });
    }

}
