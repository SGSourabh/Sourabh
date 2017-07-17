export interface ApiCreateSavingRequestData {
    saveInvest: boolean;
    fundChildren: boolean;
    saveSufficient: boolean;
    saveAndBenefit: boolean;
    setupInvestment: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiCreateSavingResponseData {
    id: number;
    leadId: number;
    saveInvest: boolean;
    fundChildren: boolean;
    saveSufficient: boolean;
    saveAndBenefit: boolean;
    setupInvestment: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateSavingRequestData {
    saveInvest: boolean;
    fundChildren: boolean;
    saveSufficient: boolean;
    saveAndBenefit: boolean;
    setupInvestment: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateSavingResponseData {
    id: number;
    leadId: number;
    saveInvest: boolean;
    fundChildren: boolean;
    saveSufficient: boolean;
    saveAndBenefit: boolean;
    setupInvestment: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export class Saving {
    id: number;
    leadId: number;
    saveInvest: boolean;
    fundChildren: boolean;
    saveSufficient: boolean;
    saveAndBenefit: boolean;
    setupInvestment: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;

    constructor(builder: SavingBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.saveInvest = builder.saveInvest;
        this.fundChildren = builder.fundChildren;
        this.saveSufficient = builder.saveSufficient;
        this.saveAndBenefit = builder.saveAndBenefit;
        this.setupInvestment = builder.setupInvestment;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
    }

    toApiCreateSavingRequestData(): ApiCreateSavingRequestData {
        return {
            saveInvest: this.saveInvest,
            fundChildren: this.fundChildren,
            saveSufficient: this.saveSufficient,
            saveAndBenefit: this.saveAndBenefit,
            setupInvestment: this.setupInvestment,
            creator: this.creator,
            created: this.created,
            updator: this.updator,
            updated: this.updated,
        }
    }

    toApiUpdateSavingRequestData(): ApiUpdateSavingRequestData {
        return {
            saveInvest: this.saveInvest,
            fundChildren: this.fundChildren,
            saveSufficient: this.saveSufficient,
            saveAndBenefit: this.saveAndBenefit,
            setupInvestment: this.setupInvestment,
            creator: this.creator,
            created: this.created,
            updator: this.updator,
            updated: this.updated,
        }
    }
}

export class SavingBuilder {
    private _id: number;
    private _leadId: number;
    private _saveInvest: boolean;
    private _fundChildren: boolean;
    private _saveSufficient: boolean;
    private _saveAndBenefit: boolean;
    private _setupInvestment: boolean;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;

    fromSaving(value: Saving): SavingBuilder {
        return this
            .setId(value.id)
            .setId(value.leadId)
            .setSaveInvest(value.saveInvest)
            .setFundChildren(value.fundChildren)
            .setSaveSufficient(value.saveSufficient)
            .setSaveAndBenefit(value.saveAndBenefit)
            .setSetupInvestment(value.setupInvestment)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiCreateSavingResponseData(value: ApiCreateSavingResponseData): SavingBuilder {
        return this
            .setId(value.id)
            .setId(value.leadId)
            .setSaveInvest(value.saveInvest)
            .setFundChildren(value.fundChildren)
            .setSaveSufficient(value.saveSufficient)
            .setSaveAndBenefit(value.saveAndBenefit)
            .setSetupInvestment(value.setupInvestment)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiUpdateSavingResponseData(value: ApiCreateSavingResponseData): SavingBuilder {
        return this
            .setId(value.id)
            .setId(value.leadId)
            .setSaveInvest(value.saveInvest)
            .setFundChildren(value.fundChildren)
            .setSaveSufficient(value.saveSufficient)
            .setSaveAndBenefit(value.saveAndBenefit)
            .setSetupInvestment(value.setupInvestment)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    setId(value: number): SavingBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setLeadId(value: number): SavingBuilder {
        this._leadId = value;
        return this;
    }

    get leadId() {
        return this._leadId;
    }

    setSaveInvest(value: boolean): SavingBuilder {
        this._saveInvest = value;
        return this;
    }

    get saveInvest() {
        return this._saveInvest;
    }

    setFundChildren(value: boolean): SavingBuilder {
        this._fundChildren = value;
        return this;
    }

    get fundChildren() {
        return this._fundChildren;
    }

    setSaveSufficient(value: boolean): SavingBuilder {
        this._saveSufficient = value;
        return this;
    }

    get saveSufficient() {
        return this._saveSufficient;
    }

    setSaveAndBenefit(value: boolean): SavingBuilder {
        this._saveAndBenefit = value;
        return this;
    }

    get saveAndBenefit() {
        return this._saveAndBenefit;
    }

    setSetupInvestment(value: boolean): SavingBuilder {
        this._setupInvestment = value;
        return this;
    }

    get setupInvestment() {
        return this._setupInvestment;
    }

    setCreator(value: string): SavingBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): SavingBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): SavingBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): SavingBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }

    build(): Saving {
        return new Saving(this);
    }
}
