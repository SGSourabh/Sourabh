import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {LeadSearch} from "../../models/lead";
import {LogProvider} from "../../providers/log";
import {LookupProvider} from "../../providers/lookup";
import {AppProvider} from "../../providers/app";
import {PrintComponent} from "../../components/print/print";
import {CordovaProvider} from "../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/search.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class SearchPage {
    leadSearch: LeadSearch;

    constructor(private logProvider: LogProvider,
                private viewCtrl: ViewController,
                private lookupProvider: LookupProvider,
                 private translateService: TranslateService,
                private cordovaProvider: CordovaProvider,
                private appProvider: AppProvider) {
        logProvider.class(this);
        this.leadSearch = {}
    }

    toDateLessThanFromDate(fromDate: string, toDate: string): boolean {
        if (fromDate && toDate) {
            let fromTime = new Date(fromDate).getTime();
            let toTime = new Date(toDate).getTime();
            return fromTime > toTime;
        }
        return false;
    }

    onSearch() {
         var tittle=this.translateService.instant('action.search');
        this.cordovaProvider.trackView(tittle);
        if (this.leadSearch.from && this.leadSearch.to) {
            try {
                this.leadSearch.from = new Date(this.leadSearch.from).toISOString();
                this.leadSearch.to = new Date(this.leadSearch.to).toISOString();
            } catch (e) {
                this.logProvider.error(e);
            }
        }
        this.viewCtrl.dismiss(this.leadSearch);
    }

    onDismiss() {
        this.viewCtrl.dismiss();
    }
}
