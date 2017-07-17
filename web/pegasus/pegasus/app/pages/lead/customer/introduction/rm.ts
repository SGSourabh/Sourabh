import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {UserProvider} from "../../../../providers/user";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {CarouselPage} from "../carousel/carousel";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/customer/introduction/rm.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class RmPage {
     customline:any;
     customline1:any;
     customline2:any;
    constructor(private logProvider: LogProvider,
                private appProvider: AppProvider,
                private translateService: TranslateService,
                public userProvider: UserProvider,
                private navController: NavController,
                public cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }
   ngOnInit() {
       var c =this.userProvider.userProfile.introduction.split(/\\n/g)
       this.customline=c;
       var tittle=this.translateService.instant('lead.documents.relationshipManager');
      this.cordovaProvider.trackView(tittle);
    }
    onGetStarted() {
        this.appProvider.current.introduction = true;
        this.navController.setRoot(CarouselPage);
    }

}
