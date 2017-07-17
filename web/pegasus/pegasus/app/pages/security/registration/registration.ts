import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../providers/log";
import {PrintComponent} from "../../../components/print/print";
import {Observable} from "rxjs/Rx";
import {SecurityProvider} from "../../../providers/security";
import {LoginPage} from "../login/login";
import {AppProvider} from "../../../providers/app";
import {UserProvider} from "../../../providers/user";
import {CordovaProvider} from "../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/security/registration/registration.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class RegistrationPage implements OnInit {
    registration: any;

    constructor(private logProvider: LogProvider,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private cordovaProvider: CordovaProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private securityProvider: SecurityProvider,
                private loadingController: LoadingController) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.registration = {username: null, password: null};
        var tittle=this.translateService.instant("registration.subtitle")+" "+(this.appProvider.env !== 'PROD' && this.appProvider.env !== 'STAGING' )? this.appProvider.env: '';
        this.cordovaProvider.trackView(tittle);
    }

    onSubmit() {
        let loading = this.loadingController.create({content: this.translateService.instant('message.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi(true))
            .flatMap(() => this.cordovaProvider.checkSecurityApi())
            .flatMap(() => this.securityProvider.register(this.registration.username, this.registration.password))
            .subscribe(register =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('security', 'register', this.registration.username);
                        this.userProvider.handle = register.handle;
                        this.navController.setRoot(LoginPage, {}, this.appProvider.navOptions);
                    }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }
}
