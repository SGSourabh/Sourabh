import {Component, OnInit} from "@angular/core";
import {LogProvider} from "../../providers/log";
import {TranslatePipe, TranslateService} from "ng2-translate";
import {ContentProvider} from "../../providers/content";
import {LoadingController, NavController, AlertController, NavParams} from "ionic-angular";
import {AppProvider} from "../../providers/app";
import {Content} from "../../models/content";
import {CordovaProvider} from "../../providers/cordova";
import {DashboardPage} from "../dashboard/dashboard";
import {Observable} from "rxjs/Rx.KitchenSink";
import {Subscription} from "rxjs";

@Component({
    templateUrl: 'build/pages/content/content.html',
    pipes: [TranslatePipe],
    providers: [ContentProvider]
})
export class ContentPage implements OnInit {
    contents: ContentStatus[];
    updating: Subscription;

    constructor(private logProvider: LogProvider,
                private navParams: NavParams,
                private appProvider: AppProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private loadingController: LoadingController,
                private contentProvider: ContentProvider,
                private cordovaProvider: CordovaProvider,
                private alertController: AlertController) {
        logProvider.class(this);
    }

    ngOnInit() {
        var tittle=this.translateService.instant("content.content");
        this.cordovaProvider.trackView(tittle);
        this.contents = this.navParams.get('contents').map(m => {
            return {content: m}
        });
    }

    remaining() {
        return this.contents.filter(f => !f.done).length;
    }

    onUpdate() {
        let loading = this.loadingController.create({content: this.translateService.instant('message.processing')});
        loading.present().then(() => {
            this.updating = Observable.forkJoin(
                this.contents.map((contentStatus, index) =>
                    Observable.of(this.cordovaProvider.checkMainApi())
                        .flatMap(() => this.contentProvider.readContent(contentStatus.content.path))
                        .flatMap(base64Data => this.cordovaProvider.storeBase64Data(contentStatus.content.path, base64Data, 'image/jpeg'))
                        .map(m => contentStatus)
                        .catch(e => {
                            contentStatus.failed = true;
                            return Observable.of(contentStatus);
                        })
                        .finally(() => this.contents[index].done = true)
                )
            ).subscribe((next: ContentStatus[]) => {
                if (next.filter(f => f.failed).length === 0) {
                    return this.contentProvider.writeContents(next.map(m => m.content)).then(() => this.navController.setRoot(DashboardPage, {}, this.appProvider.navOptions));
                }
                this.contentProvider.writeContents(next.filter(f => !f.failed).map(m => m.content));
                let alert = this.alertController.create({
                    subTitle: next.filter(f => f.failed).length + ' ' + this.translateService.instant('message.failed'),
                    enableBackdropDismiss: false,
                    buttons: [
                        {
                            text: this.translateService.instant('action.skip'),
                            handler: () => alert.dismiss().then(() => this.onSkip())
                        },
                        {
                            text: this.translateService.instant('content.retry'),
                            handler: () => {
                                this.contents = this.contents.filter(f => f.failed).map(m => {
                                    return {content: m.content};
                                });
                                alert.dismiss().then(() => this.onUpdate());
                            }
                        }
                    ]
                });
                alert.present();
            }, error => this.appProvider.createAlert(error, () => this.ngOnInit()).present());
            loading.dismiss();
        });
    }

    onSkip() {
        if (this.updating) {
            this.updating.unsubscribe();
        }
        this.navController.setRoot(DashboardPage, {}, this.appProvider.navOptions);
    }
}

export interface ContentStatus {
    content: Content;
    failed?: boolean;
    done?: boolean;
}
