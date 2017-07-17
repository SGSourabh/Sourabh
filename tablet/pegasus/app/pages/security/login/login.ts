import {Component, OnInit} from "@angular/core";
import {NavController, LoadingController, Events} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../providers/log";
import {PrintComponent} from "../../../components/print/print";
import {Observable} from "rxjs/Rx";
import {SecurityProvider} from "../../../providers/security";
import {AppProvider} from "../../../providers/app";
import {UserProvider} from "../../../providers/user";
import {CordovaProvider} from "../../../providers/cordova";
import {ContentPage} from "../../content/content";
import {ContentProvider} from "../../../providers/content";
import {DashboardPage} from "../../dashboard/dashboard";
import {Content} from "../../../models/content";

@Component({
    templateUrl: 'build/pages/security/login/login.html',
    providers: [ContentProvider],
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class LoginPage implements OnInit {
    login: any;

    constructor(private logProvider: LogProvider,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private cordovaProvider: CordovaProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private securityProvider: SecurityProvider,
                private loadingController: LoadingController,
                private contentProvider: ContentProvider,
                private events: Events) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.cordovaProvider.getStoredText('auth.user').then(user => this.login = {username: user}).catch(error => this.login = {})
    }

    onSubmit() {
        localStorage['user_id'] = this.login.username;
        let loading = this.loadingController.create({content: this.translateService.instant('message.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkSecurityApi())
            .flatMap(() => this.cordovaProvider.checkMainApi(true))
            .flatMap(() => this.cordovaProvider.storeText('auth.user', this.login.username))
            .flatMap(() => this.securityProvider.authenticate(this.login.username, this.login.password))
            .subscribe(authenticate => {
                    this.userProvider.buildFrom(authenticate.principal, authenticate.token);
                    this.userProvider.readUserProfile(this.login.username).subscribe(next => {
                        this.cordovaProvider.trackEvent('security', 'login', this.login.username);
                        this.contentProvider.readContents().subscribe(
                            (next: Content[]) => loading.dismiss().then(() => {
                                next.length > 0 ? this.navController.setRoot(ContentPage, {contents: next}, this.appProvider.navOptions) : this.navController.setRoot(DashboardPage, {}, this.appProvider.navOptions);
                            })
                            , error => loading.dismiss().then(() => this.navController.setRoot(DashboardPage, {}, this.appProvider.navOptions))
                        );
                    }, error => loading.dismiss().then(() => this.securityProvider.logout().subscribe(next => {
                        this.appProvider.createAlert(this.translateService.instant('message.failed')).present();
                        this.events.publish('user:logout');
                    }, error => this.appProvider.createAlert(error).present())));
                },
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

}
