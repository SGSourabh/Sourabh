import {Component, OnInit} from "@angular/core";
import {App, NavController} from "ionic-angular";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CordovaProvider} from "../../../../providers/cordova";
import {RmPage} from "./rm";

@Component({
    templateUrl: 'build/pages/lead/customer/introduction/awards.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class AwardsPage implements OnInit {

    constructor(private app: App,
                private logProvider: LogProvider,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private cordovaProvider: CordovaProvider,
                private navController: NavController) {
        logProvider.class(this);
    }

    ngOnInit() {
     var tittle=this.translateService.instant('lead.introduction.awards');
      this.cordovaProvider.trackView(tittle);
    }

    onNext() {
        this.navController.push(RmPage);
    }
}
