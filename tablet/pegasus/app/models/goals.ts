export interface ApiReadGoalResponseData {
    id: number;
    lead: number;
    name: string;
    priority: number;
    available: number;
    needed: number;
    duration: number;
    personal: boolean;
    business: boolean;
    lending: boolean;
    saving: boolean;
    note: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiCreateGoalRequestData {
    name: string;
    priority: number;
    available: number;
    needed: number;
    duration: number;
    personal: boolean;
    business: boolean;
    lending: boolean;
    saving: boolean;
    note: string;
}

export interface ApiCreateGoalResponseData {
    id: number;
    lead: number;
    name: string;
    priority: number;
    available: number;
    needed: number;
    duration: number;
    personal: boolean;
    business: boolean;
    lending: boolean;
    saving: boolean;
    note: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateGoalRequestData {
    name: string;
    priority: number;
    available: number;
    needed: number;
    duration: number;
    personal: boolean;
    business: boolean;
    lending: boolean;
    saving: boolean;
    note: string;
}

export interface ApiUpdateGoalResponseData {
    id: number;
    lead: number;
    name: string;
    priority: number;
    available: number;
    needed: number;
    duration: number;
    personal: boolean;
    business: boolean;
    lending: boolean;
    saving: boolean;
    note: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export class Goal {
    id: number;
    leadId: number;
    name: string;
    priority: number;
    available: number;
    needed: number;
    duration: number;
    personal: boolean;
    business: boolean;
    lending: boolean;
    saving: boolean;
    note: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;

    constructor(builder: GoalBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.name = builder.name;
        this.priority = builder.priority;
        this.available = builder.available;
        this.needed = builder.needed;
        this.duration = builder.duration;
        this.personal = builder.personal;
        this.business = builder.business;
        this.lending = builder.lending;
        this.saving = builder.saving;
        this.note = builder.note;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
    }

    toApiCreateGoalRequestData(): ApiCreateGoalRequestData {
        return <ApiCreateGoalRequestData>this.toApiGoalData();
    }

    toApiUpdateGoalRequestData(): ApiUpdateGoalRequestData {
        return <ApiUpdateGoalRequestData>this.toApiGoalData();
    }

    toApiGoalData(): any {
        return {
            name: this.name,
            priority: parseInt((this.priority || '').toString()) || null,
            available: parseFloat((this.available || '').toString()) || null,
            needed: parseFloat((this.needed || '').toString()) || null,
            duration: parseInt((this.duration || '').toString()) || null,
            personal: this.personal,
            business: this.business,
            lending: this.lending,
            saving: this.saving,
            note: this.note
        }
    }
}

export class GoalBuilder {
    private _id: number;
    private _leadId: number;
    private _name: string;
    private _priority: number;
    private _available: number;
    private _needed: number;
    private _duration: number;
    private _personal: boolean;
    private _business: boolean;
    private _lending: boolean;
    private _saving: boolean;
    private _note: string;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;

    fromGoal(value: Goal): GoalBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setName(value.name)
            .setPriority(value.priority)
            .setAvailable(value.available)
            .setNeeded(value.needed)
            .setDuration(value.duration)
            .setPersonal(value.personal)
            .setBusiness(value.business)
            .setLending(value.lending)
            .setSaving(value.saving)
            .setNote(value.note)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiReadGoalResponseData(value: ApiCreateGoalResponseData): GoalBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setName(value.name)
            .setPriority(value.priority)
            .setAvailable(value.available)
            .setNeeded(value.needed)
            .setDuration(value.duration)
            .setPersonal(value.personal)
            .setBusiness(value.business)
            .setLending(value.lending)
            .setSaving(value.saving)
            .setNote(value.note)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiCreateGoalResponseData(value: ApiCreateGoalResponseData): GoalBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setName(value.name)
            .setPriority(value.priority)
            .setAvailable(value.available)
            .setNeeded(value.needed)
            .setDuration(value.duration)
            .setPersonal(value.personal)
            .setBusiness(value.business)
            .setLending(value.lending)
            .setSaving(value.saving)
            .setNote(value.note)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiUpdateGoalResponseData(value: ApiUpdateGoalResponseData): GoalBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setName(value.name)
            .setPriority(value.priority)
            .setAvailable(value.available)
            .setNeeded(value.needed)
            .setDuration(value.duration)
            .setPersonal(value.personal)
            .setBusiness(value.business)
            .setLending(value.lending)
            .setSaving(value.saving)
            .setNote(value.note)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    setId(value: number): GoalBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setLeadId(value: number): GoalBuilder {
        this._leadId = value;
        return this;
    }

    get leadId() {
        return this._leadId;
    }

    setName(value: string): GoalBuilder {
        this._name = value;
        return this;
    }

    get name() {
        return this._name;
    }

    setPriority(value: number): GoalBuilder {
        this._priority = value;
        return this;
    }

    get priority() {
        return this._priority;
    }

    setAvailable(value: number): GoalBuilder {
        this._available = value;
        return this;
    }

    get available() {
        return this._available;
    }

    setNeeded(value: number): GoalBuilder {
        this._needed = value;
        return this;
    }

    get needed() {
        return this._needed;
    }

    setDuration(value: number): GoalBuilder {
        this._duration = value;
        return this;
    }

    get duration() {
        return this._duration;
    }

    setPersonal(value: boolean): GoalBuilder {
        this._personal = value;
        return this;
    }

    get personal() {
        return this._personal;
    }

    setBusiness(value: boolean): GoalBuilder {
        this._business = value;
        return this;
    }

    get business() {
        return this._business;
    }

    setLending(value: boolean): GoalBuilder {
        this._lending = value;
        return this;
    }

    get lending() {
        return this._lending;
    }

    setSaving(value: boolean): GoalBuilder {
        this._saving = value;
        return this;
    }

    get saving() {
        return this._saving;
    }

    setNote(value: string): GoalBuilder {
        this._note = value;
        return this;
    }

    get note() {
        return this._note;
    }

    setCreator(value: string): GoalBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): GoalBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): GoalBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): GoalBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }

    build(): Goal {
        return new Goal(this);
    }
}

export class Goals {
    static MaxGoalsAllowed: number = 10;
    list: Goal[];

    constructor(builder: GoalsBuilder) {
        this.list = builder.list;
        this.sortByPriority();
    }

    sortByPriority() {
        this.list.sort((a, b) => a.priority - b.priority);
    }

    updatePriorities() {
        this.list.forEach((goal, index) => goal.priority = index + 1);
    }

    moveToPriority(goal: Goal) {
        return new Promise((resolve, reject) => {
            let index = this.list.findIndex(f => goal.id ? f.id === goal.id : f.name === goal.name);
            if (index === -1) {
                return reject(new Error('Does not exist'));
            }
            if (goal.priority < 1 || goal.priority > this.list.length) {
                return reject(new Error('Priority invalid'));
            }
            this.list.splice(goal.priority - 1, 0, this.list.splice(index, 1)[0]);
            this.updatePriorities();
            resolve(this.list[goal.priority - 1]);
        });
    }

    exists(goal: Goal) {
        return this.list.findIndex(f => goal.id ? f.id === goal.id : f.name === goal.name) > -1;
    }

    existsByName(name: string) {
        return this.list.findIndex(f => f.name === name) > -1;
    }

    find(goal: Goal): Promise<Goal> {
        return new Promise((resolve, reject) => {
            let _goal = this.list.find(f => goal.id ? f.id === goal.id : f.name === goal.name);
            if (!_goal) {
                return reject(new Error('Does not exist'));
            }
            resolve(_goal);
        });
    }

    findByName(name: string): Promise<Goal> {
        return new Promise((resolve, reject) => {
            let _goal = this.list.find(f => f.name === name);
            if (!_goal) {
                return reject(new Error('Does not exist'));
            }
            resolve(_goal);
        });
    }

    addGoal(goal: Goal): Promise<Goal> {
        return new Promise((resolve, reject) => {
            if (this.exists(goal)) {
                return reject(new Error('exists'));
            }
            let _goal: Goal = new GoalBuilder().fromGoal(goal).setPriority(goal.priority ? goal.priority : this.list.length + 1).build();
            this.list.push(_goal);
            resolve(_goal);
        });
    }

    remove(goal: Goal): Promise<Goal> {
        this.list = this.list.filter(f => goal.id ? f.id !== goal.id : f.name !== goal.name);
        this.updatePriorities();
        return Promise.resolve(goal);
    }

    update(goal: Goal): Promise<Goal> {
        return new Promise((resolve, reject) => {
            let index = this.list.findIndex(f => goal.id ? f.id === goal.id : f.name === goal.name);
            if (index === -1) {
                return reject(new Error('Does not exist'));
            }
            this.list[index] = new GoalBuilder().fromGoal(goal).build();
            resolve(this.list[index]);
        });
    }
}

export class GoalsBuilder {
    private _list: Goal[];

    fromGoals(value: Goals): GoalsBuilder {
        return this.setList(value.list);
    }

    setList(values: Goal[]): GoalsBuilder {
        this._list = values.map(value => new GoalBuilder().fromGoal(value).build());
        return this;
    }

    get list() {
        return this._list ? this._list : this._list = [];
    }

    addGoal(value: Goal): GoalsBuilder {
        this.list.push(new GoalBuilder().fromGoal(value).build());
        return this;
    }

    build(): Goals {
        return new Goals(this);
    }
}

export interface GoalData {
    icon: string,
    goal: string
}

export const GOALS: GoalData[] = [
    {
        icon: "icon-business",
        goal: "start_business"
    },
    {
        icon: "icon-stats_up",
        goal: "develop_business"
    },
    {
        icon: "icon-business_dissolve",
        goal: "dissolve_business"
    },
    {
        icon: "icon-work_company",
        goal: "start_new_job"
    },
    {
        icon: "icon-car",
        goal: "buy_car"
    },
    {
        icon: "icon-stabilize",
        goal: "stablise_finance"
    },
    {
        icon: "icon-umbrella",
        goal: "mitigate_risks"
    },
    {
        icon: "icon-invest_property",
        goal: "invest_in_real_estate"
    },
    {
        icon: "icon-private_house",
        goal: "purchase_a_house"
    },
    {
        icon: "icon-property_construct",
        goal: "house_construction"
    },
    {
        icon: "icon-property_repair",
        goal: "house_repair"
    },
    {
        icon: "icon-house_move",
        goal: "move_house"
    },
    {
        icon: "icon-retire",
        goal: "retire"
    },
    {
        icon: "icon-household_items",
        goal: "purchase_household_items_lt_100m"
    },
    {
        icon: "icon-household_items",
        goal: "purchase_household_items_gt_100m"
    },
    {
        icon: "icon-travel",
        goal: "travel"
    },
    {
        icon: "icon-married",
        goal: "marry"
    },
    {
        icon: "icon-family_baby",
        goal: "have_baby"
    },
    {
        icon: "icon-family_study",
        goal: "support_child_studying_abroad"
    },
    {
        icon: "icon-education_abroad",
        goal: "study_abroad"
    },
    {
        icon: "icon-invest_financial",
        goal: "financial_investment"
    },
    {
        icon: "icon-stats_down",
        goal: "lower_debts"
    }
];