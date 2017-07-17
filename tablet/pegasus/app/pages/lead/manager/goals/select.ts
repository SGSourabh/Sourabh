import {Component, OnInit} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";
import {AppProvider} from "../../../../providers/app";
import {LogProvider} from "../../../../providers/log";
import {PrintComponent} from "../../../../components/print/print";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Goal, GoalBuilder} from "../../../../models/goals";
import {CurrencyDirective} from "../../../../directives/currency";
import {IntegerDirective} from "../../../../directives/integer";

@Component({
    templateUrl: 'build/pages/lead/manager/goals/select.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent, CurrencyDirective, IntegerDirective]
})
export class SelectPage implements OnInit {
    availableGoalNames: string[];
    priorities: number[];
    goal: Goal;

    constructor(private logProvider: LogProvider,
                private viewCtrl: ViewController,
                private appProvider: AppProvider,
                private navParams: NavParams) {
        logProvider.class(this);
    }

    ngOnInit() {
        this.availableGoalNames = this.navParams.data.availableGoalNames;
        this.priorities = this.navParams.data.priorities;
        this.priorities.push(this.priorities.length + 1);
        this.goal = new GoalBuilder().setLeadId(this.appProvider.current.lead.id).setPriority(this.priorities.length).build();
        if (this.availableGoalNames.length > 0) {
            this.goal.name = this.availableGoalNames[0];
        }
    }

    onGoalCreate(goal: Goal) {
        this.viewCtrl.dismiss(goal);
    }

    dismiss(): Promise<any> {
        return this.viewCtrl.dismiss();
    }
}