import {Component, OnInit} from "@angular/core";
import {ViewController} from "ionic-angular";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LogProvider} from "../../../../../providers/log";
import {LookupProvider} from "../../../../../providers/lookup";
import {AppProvider} from "../../../../../providers/app";
import {CordovaProvider} from "../../../../../providers/cordova";

@Component({
    templateUrl: 'build/pages/lead/customer/card/suitability/search.html',
    pipes: [TranslatePipe]
})
export class SearchPage implements OnInit {
    companyOptions: string[];

    constructor(private logProvider: LogProvider,
                private viewCtrl: ViewController,
                private lookupProvider: LookupProvider,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.populateCompanyOptions(); 
    }

    populateCompanyOptions(ev?: any) {
        let query = (ev && ev.target && ev.target.value && ev.target.value.trim() != '') ? ev.target.value.trim().toLowerCase() : null;
        this.logProvider.info('getItems:', query);
        this.lookupProvider.translations('lead.card.suitability.lookup.company')
            .map(m => this.translateService.instant('lead.card.suitability.lookup.company.' + m))
            .filter(f => query ? (f.toLowerCase().indexOf(query) > -1) : f)
            .toArray()
            .subscribe(next => this.companyOptions = next);
    }

    onSelect(company: string) {
        this.viewCtrl.dismiss(company);
    }

    onDismiss() {
        this.viewCtrl.dismiss();
    }
}
