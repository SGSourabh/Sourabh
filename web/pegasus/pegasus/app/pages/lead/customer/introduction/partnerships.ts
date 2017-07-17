import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CordovaProvider} from "../../../../providers/cordova";
import {AwardsPage} from "./awards";

@Component({
    templateUrl: 'build/pages/lead/customer/introduction/partnerships.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class PartnershipsPage implements OnInit {

    constructor(private logProvider: LogProvider,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private cordovaProvider: CordovaProvider,
                private navController: NavController) {
        logProvider.class(this);
    }

    ngOnInit() {
       var tittle=this.translateService.instant('lead.introduction.partnerships');
      this.cordovaProvider.trackView(tittle);
    }

    onNext() {
        this.navController.push(AwardsPage);
    }
}
