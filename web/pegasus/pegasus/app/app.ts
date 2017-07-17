import {Component, ViewChild, provide, OnInit} from "@angular/core";
import {ionicBootstrap, MenuController, Nav, AlertController, Platform, LoadingController, Events} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {LoginPage} from "./pages/security/login/login";
import {RegistrationPage} from "./pages/security/registration/registration";
import {DashboardPage} from "./pages/dashboard/dashboard";
import {CalendarPage} from "./pages/calendar/calendar";
import {LeadPage} from "./pages/lead/lead";
import {HTTP_PROVIDERS, Http} from "@angular/http";
import {TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from "ng2-translate/ng2-translate";
import {CordovaProvider} from "./providers/cordova";
import {SecurityProvider} from "./providers/security";
import {AppProvider} from "./providers/app";
import {LogProvider} from "./providers/log";
import {LookupProvider} from "./providers/lookup";
import {UserProvider} from "./providers/user";
import {StatePage} from "./pages/state/state";
import {LeadProvider}from "./providers/lead"
import {ENV} from "./env";
import * as moment from "moment";
import {Observable} from "rxjs";
import {Idle, DEFAULT_INTERRUPTSOURCES, IDLE_PROVIDERS} from "ng2-idle/core";
import {RateProvider} from "./providers/rate";

@Component({
    templateUrl: 'build/app.html',
    pipes: [TranslatePipe]
})
class MyApp implements OnInit {
    @ViewChild(Nav) nav: Nav;

    pages: Array<{
        title: string;
        component: any;
        img?: string;
    }>;

    constructor(private logProvider: LogProvider,
                private translateService: TranslateService,
                private securityProvider: SecurityProvider,
                private cordovaProvider: CordovaProvider,
                private platform: Platform,
                private menuController: MenuController,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private loadingController: LoadingController,
                private alertController: AlertController,
                private events: Events,
                private idle: Idle
                ) {
        logProvider.class(this);
    }

     ngOnInit() {
        this.translateService.onLangChange.subscribe(() => {
            this.pages = [
                {title: 'dashboard.dashboard', component: DashboardPage, img: 'analytics'},
                {title: 'calendar.calendar', component: CalendarPage, img: 'calendar'},
                {title: 'lead.leads', component: LeadPage, img: 'people'}
            ];
        });
        this.translateService.setDefaultLang(ENV.language);
        moment.locale(ENV.language);
        this.translateService.use(ENV.language)
            this.idle.setIdle(60 * 15);
            this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
            this.idle.onIdleStart.subscribe(() => {
               let timeout = this.alertController.create({
                        title: this.translateService.instant('message.alert'),
                        message: this.translateService.instant('message.session_timeout'),
                        buttons: [
                            {
                                text: this.translateService.instant('action.yes'),
                                handler: () => {
                                    localStorage.clear();
                                    let loading = this.loadingController.create({
                                        content: this.translateService.instant('action.processing')
                                    });
                                    loading.present()
                                    setTimeout(()=>{
                                        this.nav.setRoot(LoginPage);
                                        loading.dismiss()
                                    },3000)

                                }
                            }
                        ]
                    });
                    timeout.present(timeout);
            });
            this.idle.watch();
            this.platform.registerBackButtonAction(() => {
                if (this.menuController.isOpen()) {
                    this.menuController.close();
                }
                if (this.nav.canGoBack()) {
                    this.nav.pop();
                } else {
                    let confirm = this.alertController.create({
                        title: this.translateService.instant('action.confirm_header'),
                        message: this.translateService.instant('action.leave'),
                        buttons: [
                            {
                                text: this.translateService.instant('action.no')
                            },
                            {
                                text: this.translateService.instant('action.yes'),
                                handler: () => this.platform.exitApp()
                            }
                        ]
                    });
                    confirm.present(confirm);
                }
            }, 1);
            if(localStorage['login']==1){
                      this.appProvider.current.user=localStorage['user_id'];
                      this.userProvider.buildFrom(localStorage['user_id'], localStorage['token']);
                      this.userProvider.readUserProfile(localStorage['user_id']).subscribe(data=> console.log(data))
                      this.nav.setRoot(DashboardPage, {}, this.appProvider.navOptions)
            }
            else{
                if (ENV.bypass) {
                    return this.nav.setRoot(LeadPage);
                }
                else if(ENV.bypass==false){
                    console.log('hi');
                    this.nav.setRoot(LoginPage);
                }
            }
    }

    openPage(page) {
        return this.menuController.close().then(() => this.nav.setRoot(page, {}, this.appProvider.navOptions));
    }

    logout() {
        if (this.userProvider.loggedIn) {
            this.cordovaProvider.trackEvent('security', 'logout', this.userProvider.user.name);
            let loading = this.loadingController.create({content: this.translateService.instant('message.processing')});
            Observable.fromPromise(loading.present())
                .flatMap(() => this.securityProvider.logout())
                .subscribe(
                    next => loading.dismiss().then(() => this.openPage(LoginPage).then(result => this.events.publish('user:logout'))),
                    error => loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                );
        }
    }

    onState() {
        this.menuController.close().then(() => this.nav.push(StatePage, {}));
    }
}

ionicBootstrap(MyApp,
    [
        HTTP_PROVIDERS,
        TRANSLATE_PROVIDERS,
        IDLE_PROVIDERS,
        provide(TranslateLoader, {
            useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
            deps: [Http]
        }),
        TranslateService,
        SecurityProvider,
        CordovaProvider,
        AppProvider,
        LogProvider,
        LookupProvider,
        UserProvider,
        RateProvider,
        LeadProvider
    ], {
        prodMode: ENV.angularProd
    });
