import {Component, OnInit} from "@angular/core";
import {ViewController} from "ionic-angular";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {AppProvider} from "../../../../../providers/app";
import {LogProvider} from "../../../../../providers/log";
import {PrintComponent} from "../../../../../components/print/print";
import {LookupProvider} from "../../../../../providers/lookup";
import {LendingCopayer} from "../../../../../models/copayers";

@Component({
    templateUrl: 'build/pages/lead/customer/lending/application/new-copayer.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent]
})
export class NewCopayerPage implements OnInit {
    lendingCopayer: LendingCopayer;

    constructor(private logProvider: LogProvider,
                private viewCtrl: ViewController,
                public appProvider: AppProvider,
                public lookupProvider: LookupProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.lendingCopayer = new LendingCopayer();
    }

    onSave() {
        this.viewCtrl.dismiss(this.lendingCopayer);
    }

    dismiss(): Promise<any> {
        return this.viewCtrl.dismiss();
    }

    toDateLessThanOrEqualToFromDate(): boolean {
        if (this.lendingCopayer.dateOfBirth && this.lendingCopayer.idDateOfIssue) {
            let fromTime = new Date(this.lendingCopayer.dateOfBirth).getTime();
            let toTime = new Date(this.lendingCopayer.idDateOfIssue).getTime();
            return fromTime >= toTime;
        }
        return false;
    }

}
