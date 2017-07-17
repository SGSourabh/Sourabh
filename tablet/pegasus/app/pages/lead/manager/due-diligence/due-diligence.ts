import { Component } from "@angular/core";
import { NavController, Tabs } from "ionic-angular";
import { TranslatePipe } from "ng2-translate/ng2-translate";
import { AppProvider } from "../../../../providers/app";
import { LogProvider } from "../../../../providers/log";
import { PrintComponent } from "../../../../components/print/print";

@Component({
    templateUrl: 'build/pages/lead/manager/due-diligence/due-diligence.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class DueDiligencePage {

    constructor(private logProvider: LogProvider,
        private appProvider: AppProvider,
        private navController: NavController) {
        logProvider.class(this);
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