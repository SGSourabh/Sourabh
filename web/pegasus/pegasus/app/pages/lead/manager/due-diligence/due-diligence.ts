import { Component } from "@angular/core";
import { NavController, Tabs } from "ionic-angular";
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { AppProvider } from "../../../../providers/app";
import { LogProvider } from "../../../../providers/log";
import { PrintComponent } from "../../../../components/print/print";
import {CordovaProvider} from "../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/manager/due-diligence/due-diligence.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class DueDiligencePage {

    constructor(private logProvider: LogProvider,
        private appProvider: AppProvider,
        private navController: NavController,
        private cordovaProvider: CordovaProvider,
         private translateService: TranslateService) {
        logProvider.class(this);
    }
    ngOnInit() {

          var tittle=this.appProvider.current.lead.surname+' '+this.appProvider.current.lead.name;
            this.cordovaProvider.trackView(tittle);
     }
    onNext() {
        let tabs: Tabs = this.navController.parent;
        tabs.select(tabs.getSelected().index + 1);
    }

    ionViewDidLeave() {
        let tabs: Tabs = this.navController.parent;
        tabs.select(tabs.getSelected().index);
    }
}
