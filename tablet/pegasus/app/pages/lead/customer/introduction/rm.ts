import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {UserProvider} from "../../../../providers/user";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {CarouselPage} from "../carousel/carousel";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/customer/introduction/rm.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class RmPage {

    constructor(private logProvider: LogProvider,
                private appProvider: AppProvider,
                public userProvider: UserProvider,
                private navController: NavController,
                public cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    onGetStarted() {
        this.appProvider.current.introduction = true;
        this.navController.setRoot(CarouselPage);
    }

}
