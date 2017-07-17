import { Component, OnInit } from "@angular/core";
import { ModalController, LoadingController, Tabs, NavController } from "ionic-angular";
import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";
import { PrintComponent } from "../../../../components/print/print";
import { LogProvider } from "../../../../providers/log";
import { LookupProvider } from "../../../../providers/lookup";
import { SelectPage } from "./select";
import { AppProvider } from "../../../../providers/app";
import { Goal, Goals, GoalsBuilder } from "../../../../models/goals";
import { GoalsProvider } from "../../../../providers/goals";
import { Observable } from "rxjs/Observable";
import { CurrencyDirective } from "../../../../directives/currency";
import { IntegerDirective } from "../../../../directives/integer";
import {CordovaProvider} from "../../../../providers/cordova";
import {InputNumberDirective} from "../../../../directives/inputNumber";

@Component({
    templateUrl: 'build/pages/lead/manager/goals/goals.html',
    pipes: [TranslatePipe],
    directives: [PrintComponent, CurrencyDirective, IntegerDirective,InputNumberDirective],
    providers: [GoalsProvider]
})
export class GoalsPage implements OnInit {
    goals: Goals;
    goalNames: string[];
    maxGoalsAllowed: number = Goals.MaxGoalsAllowed;

    constructor(private logProvider: LogProvider,
        private navController: NavController,
        private translateService: TranslateService,
        private lookupProvider: LookupProvider,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private appProvider: AppProvider,
        private goalsProvider: GoalsProvider,
        private cordovaProvider: CordovaProvider
        ) {
        logProvider.class(this);
    }

    ngOnInit() {
        var tittle=this.appProvider.current.lead.surname+' '+this.appProvider.current.lead.name;
            this.cordovaProvider.trackView(tittle);
        this.lookupProvider.goals.subscribe(names => this.goalNames = names.sort());
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        // suspected bug in ionic 2.0.0-beta.11 tabs, delay to circumvent
        Observable.of(loading).delay(2000).flatMap(loading => loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.goalsProvider.readGoals())
            .subscribe(data => {
                loading.dismiss().then(() =>{ 
                    this.cordovaProvider.trackEvent('manager', 'onOnInit', 'goals');
                    this.goals = new GoalsBuilder().setList(data).build()
                });
            }, error => {
                //loading.dismiss().then(() => error === 'timeout' ? this.appProvider.createAlert(error, () => this.ngOnInit()).present() : this.goals = new GoalsBuilder().build());
                loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            });
    }

    onAdd() {
        let takenGoalNames: string[] = this.goals.list.map(x => x.name);
        let modal = this.modalCtrl.create(SelectPage, {
            availableGoalNames: this.goalNames.filter(name => takenGoalNames.indexOf(name) === -1),
            priorities: this.goals.list.map(x => x.priority)
        }, { enableBackdropDismiss: false });
        modal.onDidDismiss(goal => {
            if (!goal) {
                return;
            }
            let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
            Observable.fromPromise(loading.present())
                .flatMap(() => this.cordovaProvider.checkMainApi())
                .flatMap(() => this.goalsProvider.createGoal(goal))
                .flatMap(m => this.goals.addGoal(m))
                .flatMap(m => this.goals.list.length > 1 ? this.goals.moveToPriority(m) : Promise.resolve(m))
                .flatMap(m => this.goals.list.length > 1 ? Observable.forkJoin(this.goals.list.map(goal => this.goalsProvider.partialUpdateGoal(goal.id, { priority: goal.priority }))) : Observable.from([m]))
                .subscribe(() =>
                    loading.dismiss().then(()=>{
                        this.cordovaProvider.trackEvent('manager', 'onAdd', 'goals');
                    })
                , error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
                );
        });
        modal.present();
    }

    onPriorityChange(goal: Goal) {
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.goals.moveToPriority(goal))
            .flatMap(() => Observable.forkJoin(this.goals.list.map(goal => this.goalsProvider.partialUpdateGoal(goal.id, { priority: goal.priority }))))
            .subscribe(data =>
                loading.dismiss().then(()=>{
                    this.cordovaProvider.trackEvent('manager', 'onPriorityChange', 'goals'); 
                }),
               
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onRemove(goal: Goal) {
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.goalsProvider.deleteGoal(goal.id))
            .flatMap(() => this.goals.remove(goal))
            .map(() => this.goals.list.length > 0 ? Observable.forkJoin(this.goals.list.map(goal => this.goalsProvider.partialUpdateGoal(goal.id, { priority: goal.priority }))) : this.goals.list)
            .subscribe(() =>
                loading.dismiss().then(()=>this.cordovaProvider.trackEvent('manager', 'onRemove', 'goals')),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onUpdate(goal: Goal) {
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => this.goals.update(goal))
            .flatMap(m => this.goalsProvider.updateGoal(m))
            .subscribe(data =>
                // loading.dismiss().then(() => this.appProvider.createAlert(this.translateService.instant('message.success')).present()),
                loading.dismiss().then(()=>this.cordovaProvider.trackEvent('manager', 'onUpdate', 'goals')),
            error =>
                loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onSave() {
        if (this.goals.list.length === 0) {
            return this.onNext();
        }
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => Observable.forkJoin(this.goals.list.map(goal => this.goalsProvider.updateGoal(goal))))
            .subscribe(data =>
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'onSave', 'goals')
                    this.goals = new GoalsBuilder().setList(<Goal[]>data).build();
                    this.onNext();
                }),
            error => loading.dismiss().then(() => this.appProvider.createAlert(error).present()));
    }

    onNext() {
        let tabs: Tabs = this.navController.parent;
        tabs.select(tabs.getSelected().index + 1);
    }

    ionViewDidLeave() {
        let tabs: Tabs = this.navController.parent;
        if (this.goals.list.length === 0) {
            tabs.select(tabs.getSelected().index);
            return;
        }
        let loading = this.loadingCtrl.create({ content: this.translateService.instant('action.processing') });
        Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(() => Observable.forkJoin(this.goals.list.map(goal => this.goalsProvider.updateGoal(goal))))
            .subscribe(data =>
                loading.dismiss().then(() => {
                    this.cordovaProvider.trackEvent('manager', 'ionViewDidLeave', 'goals')
                    this.goals = new GoalsBuilder().setList(<Goal[]>data).build();
                    tabs.select(tabs.getSelected().index);
                }),
            error => loading.dismiss().then(() => this.appProvider.createAlert(error).present()));
    }
}
