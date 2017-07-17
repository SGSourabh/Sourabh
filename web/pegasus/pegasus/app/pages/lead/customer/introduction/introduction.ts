import {Component, OnInit} from "@angular/core";
import {NavController} from "ionic-angular";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CordovaProvider} from "../../../../providers/cordova";
import {PartnershipsPage} from "./partnerships";
import {CarouselPage} from "../carousel/carousel";

@Component({
    templateUrl: 'build/pages/lead/customer/introduction/introduction.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class IntroductionPage implements OnInit {
    path: string;

    constructor(private logProvider: LogProvider,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private cordovaProvider: CordovaProvider,
                private navController: NavController) {
        logProvider.class(this);
    }

    ngOnInit() {
         var tittle=this.translateService.instant('lead.introduction.introduction');
      this.cordovaProvider.trackView(tittle);
    }

    onNext() {
        this.navController.push(PartnershipsPage);
    }

    onSkip() {
        this.navController.setRoot(CarouselPage);
    }
}
