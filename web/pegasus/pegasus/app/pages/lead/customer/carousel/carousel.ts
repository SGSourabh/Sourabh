import {Component, OnInit} from "@angular/core";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PersonalPage} from "../personal/personal";
import {NavController} from "ionic-angular";
import {BackgroundPage} from "../background/background";
import {GoalsPage} from "../goals/goals";
import {FinancePage} from "../finance/finance";
import {RecommendationPage} from "../recommendation/recommendation";
import {CordovaProvider} from "../../../../providers/cordova";
import {StoredPicture} from "../../../../models/cordova";
import {ApplicationsPage} from "../applications/applications";

@Component({
    templateUrl: 'build/pages/lead/customer/carousel/carousel.html',
    pipes: [TranslatePipe]
})
export class CarouselPage implements OnInit {
    backgroundStoredPicture: StoredPicture;
    goalsStoredPicture: StoredPicture;
    financialStoredPicture: StoredPicture;
    recommendationsStoredPicture: StoredPicture;

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.appProvider.current.introduction = false;
        this.appProvider.current.manualsuggestionData=[];
         this.appProvider.current.allsuggestionData=[];
         var tittle=this.appProvider.current.lead.surname+''+this.appProvider.current.lead.name;
         this.cordovaProvider.trackView(tittle); 
    }

    personal() {
        this.navController.push(PersonalPage);
    }

    background() {
        this.navController.push(BackgroundPage);
    }

    goals() {
        this.navController.push(GoalsPage);
    }

    financial() {
        this.navController.push(FinancePage);
    }

    recommendation() {
        this.navController.push(RecommendationPage);
    }

    application() {
        this.navController.push(ApplicationsPage);
    }
}
