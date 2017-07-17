import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {
    Appointment,
    AppointmentBuilder,
    ApiSearchAppointmentRequestData,
    ApiSearchAppointmentResponseData,
    ApiReadAppointmentResponseData,
    ApiCreateAppointmentResponseData,
    ApiUpdateAppointmentResponseData,
    ApiSearchAppointmentEnrichedResponseData
} from "../models/appointment";
import {ENV} from "../env";
import {NavController} from "ionic-angular";
import {LoginPage} from "../pages/security/login/login";
@Injectable()
export class AppointmentProvider {

    constructor(private navController: NavController,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService) {
        logProvider.class(this);
    }

    readAppointments(apiSearchAppointmentRequestData: ApiSearchAppointmentRequestData): Observable<Appointment[]> {
        this.logProvider.info('provider', 'appointments', 'readAppointments');

        let params: URLSearchParams = new URLSearchParams();
        // params.set('sort', "start");
        if (apiSearchAppointmentRequestData) {
            if (apiSearchAppointmentRequestData.lead) {
                params.set('lead', apiSearchAppointmentRequestData.lead.toString());
            }
            if (apiSearchAppointmentRequestData.from && apiSearchAppointmentRequestData.to) {
                params.set('from', apiSearchAppointmentRequestData.from);
                params.set('to', apiSearchAppointmentRequestData.to);
            }
            if (apiSearchAppointmentRequestData.creator) {
                params.set('creator', apiSearchAppointmentRequestData.creator.toString());
            }
            if (apiSearchAppointmentRequestData.limit) {
                params.set('_limit', apiSearchAppointmentRequestData.limit.toString());
            }
            // if (apiSearchAppointmentRequestData.sort) {
            //     params.set('_sort', apiSearchAppointmentRequestData.sort.toString());
            // }
            if (apiSearchAppointmentRequestData.fields) {
                params.set('_fields', apiSearchAppointmentRequestData.fields.toString());
            }
        }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/appointments', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status === 401) {
                    this.logout();
                }
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiSearchAppointmentResponseData: ApiSearchAppointmentResponseData[] = response.json();
                return apiSearchAppointmentResponseData.map(data =>
                    new AppointmentBuilder()
                        .fromApiReadAppointmentResponseData(data)
                        .build());
            })
            .catch(error => {
                if (error.status === 401) {
                    this.logout();
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readEnrichedAppointments(apiSearchAppointmentRequestData: ApiSearchAppointmentRequestData): Observable<Appointment[]> {
        this.logProvider.info('provider', 'appointments', 'readEnrichedAppointments');

        let params: URLSearchParams = new URLSearchParams();
        // params.set('sort', "start");
        if (apiSearchAppointmentRequestData) {
            if (apiSearchAppointmentRequestData.lead) {
                params.set('lead', apiSearchAppointmentRequestData.lead.toString());
            }
            if (apiSearchAppointmentRequestData.from && apiSearchAppointmentRequestData.to) {
                params.set('from', apiSearchAppointmentRequestData.from);
                params.set('to', apiSearchAppointmentRequestData.to);
            }
            if (apiSearchAppointmentRequestData.creator) {
                params.set('creator', apiSearchAppointmentRequestData.creator.toString());
            }
            if (apiSearchAppointmentRequestData.limit) {
                params.set('_limit', apiSearchAppointmentRequestData.limit.toString());
            }
            // if (apiSearchAppointmentRequestData.sort) {
            //     params.set('_sort', apiSearchAppointmentRequestData.sort.toString());
            // }
            if (apiSearchAppointmentRequestData.fields) {
                params.set('_fields', apiSearchAppointmentRequestData.fields.toString());
            }
        }
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/appointments', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status === 401) {
                    this.logout();
                }
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiSearchAppointmentEnrichedResponseData: ApiSearchAppointmentEnrichedResponseData[] = response.json();
                return apiSearchAppointmentEnrichedResponseData.map(data =>
                    new AppointmentBuilder()
                        .fromApiSearchAppointmentEnrichedResponseData(data)
                        .build());
            })
            .catch(error => {
                if (error.status === 401) {
                    this.logout();
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readAppointment(id: number): Observable<Appointment> {
        this.logProvider.info('provider', 'appointment', 'readAppointment');

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

        return this.http.get(ENV.mainApi + '/appointments/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status === 401) {
                    this.logout();
                }
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiReadAppointmentResponseData: ApiReadAppointmentResponseData = response.json();
                return new AppointmentBuilder()
                    .fromApiReadAppointmentResponseData(apiReadAppointmentResponseData)
                    .setId(id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    this.logout()
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createAppointment(appointment: Appointment): Observable<Appointment> {
        this.logProvider.info('provider', 'appointment', 'createAppointment');

        if (!appointment || !appointment.leadId || !appointment.start || !appointment.end || (appointment.start > appointment.end) || !appointment.location) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(appointment.toApiCreateAppointmentRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/appointments', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status === 401) {
                    this.logout();
                }
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateAppointmentResponseData: ApiCreateAppointmentResponseData = response.json();
                return new AppointmentBuilder()
                    .fromApiCreateAppointmentResponseData(apiCreateAppointmentResponseData)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    this.logout();
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateAppointment(appointment: Appointment): Observable<Appointment> {
        this.logProvider.info('provider', 'appointment', 'updateAppointment');

        if (!appointment || !appointment.exchangeId  || !appointment.start || !appointment.end || (appointment.start > appointment.end) || !appointment.location) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(appointment.toApiUpdateAppointmentRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/appointments/' + appointment.exchangeId+'/'+appointment.exchangeKey, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status === 401) {
                    this.logout();
                }
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiUpdateAppointmentResponseData: ApiUpdateAppointmentResponseData = response.json();
                return new AppointmentBuilder()
                    .fromApiUpdateAppointmentResponseData(apiUpdateAppointmentResponseData)
                    .setId(appointment.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    this.logout();
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    deleteAppointment(id: string): Observable<void> {
        this.logProvider.info('provider', 'appointment', 'deleteAppointment');

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

        return this.http.delete(ENV.mainApi + '/appointments/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status === 401) {
                    this.logout();
                }
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
            }).catch(error => {
                return this.appProvider.observableThrow(error);
            });
    }
    logout(){
        localStorage.clear();
        this.navController.setRoot(LoginPage);
    }

}
