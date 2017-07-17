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
import {Http,RequestOptions,Headers} from "@angular/http";
import {ENV} from "../../../env";
@Component({
    templateUrl: 'build/pages/security/login/login.html',
    providers: [ContentProvider],
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class LoginPage implements OnInit {
    login: any;
    http
    constructor(http:Http,
                private logProvider: LogProvider,
                private appProvider: AppProvider,
                private userProvider: UserProvider,
                private cordovaProvider: CordovaProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private securityProvider: SecurityProvider,
                private loadingController: LoadingController,
                private contentProvider: ContentProvider,
                private events: Events) {
        this.http=http;
        logProvider.class(this);
    }

    ngOnInit() {
        this.login = {};
    }

    onSubmit() {
        let loading = this.loadingController.create({content: this.translateService.instant('message.processing')});
        Observable.fromPromise(loading.present())
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + window.btoa(this.login.username + ":" + this.login.password),
            })});
        localStorage['user_id'] = this.login.username;
        this.http.post(ENV.securityApi +'/login',JSON.stringify({username:this.login.username,password:this.login.password}),options)
            .timeout(ENV.timeout)
            .subscribe(authenticate => {
                      loading.dismiss().then(()=>{
                      localStorage['login']=1;
                      localStorage['password']=this.login.password;
                      this.appProvider.current.user=this.login.username;
                      localStorage['user_id']=JSON.parse(authenticate._body).principal;
                      localStorage['token']=JSON.parse(authenticate._body).token;
                      this.userProvider.buildFrom(JSON.parse(authenticate._body).principal, JSON.parse(authenticate._body).token);
                      this.userProvider.readUserProfile(this.login.username).subscribe(data=> console.log(data))
                      this.navController.setRoot(DashboardPage, {}, this.appProvider.navOptions)
                      })
                },error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

}
