import {Injectable} from "@angular/core";
import {Platform, NavOptions, AlertController, Events, Alert} from "ionic-angular";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ENV, LOCAL, TEST, DEV, STAGING, PROD, LANGUAGE} from "../env";
import {LogProvider} from "./log";
import {Current} from "../models/current";
import {Observable} from "rxjs/Rx";
import * as moment from "moment";

@Injectable()
export class AppProvider {
    navOptions: NavOptions;
    current: Current;

    constructor(private logProvider: LogProvider,
                private translateService: TranslateService,
                private events: Events,
                private platform: Platform,
                private translate: TranslateService,
                private alertCtrl: AlertController) {
        logProvider.class(this);
        this.navOptions = {animate: true, animation: this.platform.is('ios') ? 'ios-transition' : 'md-transition'};
        this.current = new Current('all');
        events.subscribe('user:logout', () => {
            this.current = new Current();
        });
    }

    get env(): string {
        switch (ENV) {
            case LOCAL:
                return "LOCAL";
            case TEST:
                return "TEST";
            case DEV:
                return "DEV";
            case STAGING:
                return "STAGING";
            case PROD:
                return "PROD";
            default:
                return "NONE";
        }
    }

    get debug() {
        return ENV.debug;
    }

    toggleLanguage() {
        this.translateService.use(this.translateService.currentLang === LANGUAGE.ENGLISH ? LANGUAGE.VIETNAMESSE : LANGUAGE.ENGLISH);
        moment.locale(this.translateService.currentLang === LANGUAGE.ENGLISH ? LANGUAGE.VIETNAMESSE : LANGUAGE.ENGLISH);
    }

    createAlert(message: string, callBack?: () => void): Alert {
        let timeout: boolean = message === 'timeout';
        let alertCtrl: Alert = this.alertCtrl.create(
            {
                subTitle: !timeout ? message : this.translateService.instant('message.timeout'),
                enableBackdropDismiss: !timeout,
                buttons: [
                    !timeout || !callBack ? this.translateService.instant('action.close') :
                        {
                            text: this.translateService.instant('action.reload'),
                            handler: callBack ? () => {
                                alertCtrl.dismiss();
                                callBack();
                            } : () => false
                        }
                ]
            }
        );
        return alertCtrl;
    }

    observableThrow(error: any): Observable<any> {
        this.logProvider.error(error);
        try {
            return Observable.throw(error.json().messages.join('. '));
        } catch (e) {
            if (error instanceof Error) {
                if (error.message === 'timeout') {
                    return Observable.throw(error.message);
                }
                let object: any = {name: error.name, message: error.message};
                if (ENV.debug) {
                    object.stack = error.stack;
                }
                return Observable.throw(JSON.stringify(object));
            }
            return Observable.throw(typeof error === 'string' ? error : JSON.stringify(error));
        }
    }

    promiseReject(error: any): Promise<any> {
        this.logProvider.error(error);
        try {
            return Promise.reject(error.json().messages.join('. '));
        } catch (e) {
            if (error instanceof Error) {
                if (error.message === 'timeout') {
                    return Promise.reject(error.message);
                }
                let object: any = {name: error.name, message: error.message};
                if (ENV.debug) {
                    object.stack = error.stack;
                }
                return Promise.reject(JSON.stringify(object));
            }
            return Promise.reject(typeof error === 'string' ? error : JSON.stringify(error));
        }
    }
}
