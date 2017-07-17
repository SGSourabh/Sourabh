import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
import {Goal, GoalBuilder, ApiReadGoalResponseData, ApiCreateGoalResponseData, ApiUpdateGoalResponseData} from "../models/goals";
import {ENV} from "../env";

@Injectable()
export class GoalsProvider {

    constructor(private appProvider: AppProvider,
                private userProvider: UserProvider,
                private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService) {
        logProvider.class(this);
    }

    readGoals(): Observable<Goal[]> {
        this.logProvider.info('provider', 'goals', 'readGoals');

        let params: URLSearchParams = new URLSearchParams();
        params.set('_sort', '-id');
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            }),
            search: params
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/goals', options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiGoalsResponseData: ApiReadGoalResponseData[] = response.json();
                return apiGoalsResponseData.map(apiGoalResponseData =>
                    new GoalBuilder()
                        .fromApiReadGoalResponseData(apiGoalResponseData)
                        .build()
                );
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    readGoal(id: number): Observable<Goal> {
        this.logProvider.info('provider', 'goal', 'readGoal');

        if (!id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.get(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/goals/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiReadGoalResponseData: ApiReadGoalResponseData = response.json();
                return new GoalBuilder()
                    .fromApiReadGoalResponseData(apiReadGoalResponseData)
                    .setId(id).build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    createGoal(goal: Goal): Observable<Goal> {
        this.logProvider.info('provider', 'goal', 'createGoal');

        if (!goal || !goal.leadId || !goal.name) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(goal.toApiCreateGoalRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.post(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/goals', body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 201) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiCreateGoalResponseData: ApiCreateGoalResponseData = response.json();
                return new GoalBuilder()
                    .fromApiCreateGoalResponseData(apiCreateGoalResponseData)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    updateGoal(goal: Goal): Observable<Goal> {
        this.logProvider.info('provider', 'goal', 'updateGoal');

        if (!goal || !goal.leadId || !goal.id || !goal.name) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let body = JSON.stringify(goal.toApiUpdateGoalRequestData());
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/goals/' + goal.id, body, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiUpdateLeadResponseData: ApiUpdateGoalResponseData = response.json();
                return new GoalBuilder()
                    .fromApiUpdateGoalResponseData(apiUpdateLeadResponseData)
                    .setId(goal.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    partialUpdateGoal(goalId: number, partial: any): Observable<Goal> {
        this.logProvider.info('provider', 'goal', 'partialUpdateGoal');

        if (!goalId) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.patch(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/goals/' + goalId, JSON.stringify(partial), options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 200) {
                    throw Error(this.translateService.instant('message.failed'));
                }
                let apiUpdateGoalResponseData: ApiUpdateGoalResponseData = response.json();
                return new GoalBuilder()
                    .fromApiUpdateGoalResponseData(apiUpdateGoalResponseData)
                    .setId(this.appProvider.current.lead.id)
                    .build();
            })
            .catch(error => {
                if (error.status === 401) {
                    return this.appProvider.observableThrow(this.translateService.instant('message.failed'));
                }
                return this.appProvider.observableThrow(error);
            });
    }

    deleteGoal(id: number): Observable<void> {
        this.logProvider.info('provider', 'goal', 'deleteGoal');

        if (!id) {
            return this.appProvider.observableThrow(this.translateService.instant('message.invalid'));
        }

        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json',
                'User':this.appProvider.current.user,
                'Token': this.userProvider.user.token
            })
        });

        return this.http.delete(ENV.mainApi + '/leads/' + this.appProvider.current.lead.id + '/goals/' + id, options)
            .timeout(ENV.timeout)
            .map(response => {
                if (response.status !== 204) {
                    throw Error(this.translateService.instant('message.failed'));
                }
            })
            .catch(error => this.appProvider.observableThrow(error));
    }
}
