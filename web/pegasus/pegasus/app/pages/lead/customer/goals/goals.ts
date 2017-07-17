import {Component, OnInit} from "@angular/core";
import {LoadingController, NavController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {PrintComponent} from "../../../../components/print/print";
import {LogProvider} from "../../../../providers/log";
import {AppProvider} from "../../../../providers/app";
import {Goal, Goals, GoalsBuilder, GoalBuilder, GoalData, GOALS} from "../../../../models/goals";
import {GoalsProvider} from "../../../../providers/goals";
import {Observable} from "rxjs/Observable";
import {CurrencyDirective} from "../../../../directives/currency";
import {IntegerDirective} from "../../../../directives/integer";
import {InputNumberDirective} from "../../../../directives/inputNumber";
import {FinancePage} from "../finance/finance";
import {CordovaProvider} from "../../../../providers/cordova";

interface GoalState {
    goalData: GoalData,
    active: boolean
}

@Component({
    templateUrl: 'build/pages/lead/customer/goals/goals.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent, CurrencyDirective, IntegerDirective,InputNumberDirective],
    providers: [GoalsProvider]
})
export class GoalsPage implements OnInit {
    showDetails: boolean;
    goalsState: GoalState[];
    goals: Goals;
    activebuttongoal:boolean=true;
    activebuttongoaldetails:boolean=false;
    leftSideGoal=[];
    rightSideGOal=[];
    all_Goal:any
    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private translateService: TranslateService,
                private loadingCtrl: LoadingController,
                private appProvider: AppProvider,
                private goalsProvider: GoalsProvider,
                private cordovaProvider: CordovaProvider) {
        logProvider.class(this);
    }

    ngOnInit() {
        var tittle=this.translateService.instant('lead.goals.goals');
        this.cordovaProvider.trackView(tittle);
        this.showDetails = false;
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.goalsProvider.readGoals())
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'ngOnInit', 'goal');
                        this.goals = new GoalsBuilder().setList(data).build();
                        this.goalsState = GOALS.map(goalData => {
                            return {
                                goalData: goalData,
                                active: this.goals.existsByName(goalData.goal)
                            };
                        });
                        for (let i=0; i<12; i++) {
                          //alert('hello')
                          this.leftSideGoal.push(this.goalsState[i])
                      }
                       for (let i=12; i<this.goalsState.length; i++) {
                      //    alert('hello')
                          this.rightSideGOal.push(this.goalsState[i])
                      }
                      
                    }),
                error =>
                    loading.dismiss().then(() => error === 'timeout' ? this.appProvider.createAlert(error, () => this.ngOnInit()).present() : this.goals = new GoalsBuilder().build())
            );
    }

    toggleActive(goalState: GoalState) {
        goalState.active = !goalState.active;
        if (goalState.active) {
            let goal: Goal = new GoalBuilder()
                .setLeadId(this.appProvider.current.lead.id)
                .setName(goalState.goalData.goal)
                .setAvailable(0)
                .setNeeded(0)
                .setDuration(0)
                .build();
            this.goals.addGoal(goal);
            return;
        }

        this.goals.findByName(goalState.goalData.goal).then(goal => {
            if (!goal.id) {
                this.goals.remove(goal);
                return;
            }
            let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
            Observable.fromPromise(loading.present())
                .flatMap(() => this.cordovaProvider.checkMainApi())
                .flatMap(data => this.goalsProvider.deleteGoal(goal.id))
                .subscribe(data =>
                        loading.dismiss().then(() => this.goals.remove(goal)),
                    error =>
                        loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                );
        }).catch(error => this.appProvider.createAlert(error).present());
    }

    onPriorityChange(goal: Goal) {
        this.goals.moveToPriority(goal).catch(error => this.appProvider.createAlert(error).present());
    }

    onSave(next: boolean) {
        if (this.goals.list.length === 0) {
            return this.navController.pop().then(onfulfilled => next ? this.navController.push(FinancePage) : onfulfilled);
        }
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => Observable.forkJoin(this.goals.list.map(goal => goal.id ? this.goalsProvider.updateGoal(goal) : this.goalsProvider.createGoal(goal))))
            .subscribe(data =>
                    loading.dismiss().then(() => {
                        this.cordovaProvider.trackEvent('customer', 'onSave', 'goal');
                        this.goals = new GoalsBuilder().setList(<Goal[]>data).build();
                        if (this.appProvider.current.introduction) {
                            return next ? this.navController.push(FinancePage) : next;
                        }
                        this.navController.pop().then(() => next ? this.navController.push(FinancePage) : next);
                    }),
                error => loading.dismiss().then(() => this.appProvider.createAlert(error).present()));
    }

    showGoalsDetails(){
        this.showDetails = true;
        this.activebuttongoal=false;
        this.activebuttongoaldetails=true;
    }
    hideGoalsDetails(){
        this.showDetails = false;
        this.activebuttongoal=true;
        this.activebuttongoaldetails=false;
    }

}
