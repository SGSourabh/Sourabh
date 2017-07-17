export interface ApiCreateProtectRequestData {
    buyInsurance: boolean;
    protectIncome: boolean;
    protectInsuredPerson: boolean;
    protectBusinessAssets: boolean;
    protectOther: boolean;
}

export interface ApiCreateProtectResponseData {
    id: number;
    leadId: number;
    buyInsurance: boolean;
    protectIncome: boolean;
    protectInsuredPerson: boolean;
    protectBusinessAssets: boolean;
    protectOther: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateProtectRequestData {
    buyInsurance: boolean;
    protectIncome: boolean;
    protectInsuredPerson: boolean;
    protectBusinessAssets: boolean;
    protectOther: boolean;
}

export interface ApiUpdateProtectResponseData {
    id: number;
    leadId: number;
    buyInsurance: boolean;
    protectIncome: boolean;
    protectInsuredPerson: boolean;
    protectBusinessAssets: boolean;
    protectOther: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export class Protect {
    id: number;
    leadId: number;
    buyInsurance: boolean;
    protectIncome: boolean;
    protectInsuredPerson: boolean;
    protectBusinessAssets: boolean;
    protectOther: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;

    constructor(builder: ProtectBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.buyInsurance = builder.buyInsurance;
        this.protectIncome = builder.protectIncome;
        this.protectInsuredPerson = builder.protectInsuredPerson;
        this.protectBusinessAssets = builder.protectBusinessAssets;
        this.protectOther = builder.protectOther;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
    }

    toApiCreateProtectRequestData(): ApiCreateProtectRequestData {
        return {
            buyInsurance: this.buyInsurance,
            protectIncome: this.protectIncome,
            protectInsuredPerson: this.protectInsuredPerson,
            protectBusinessAssets: this.protectBusinessAssets,
            protectOther: this.protectOther
        }
    }

    toApiUpdateProtectRequestData(): ApiUpdateProtectRequestData {
        return {
            buyInsurance: this.buyInsurance,
            protectIncome: this.protectIncome,
            protectInsuredPerson: this.protectInsuredPerson,
            protectBusinessAssets: this.protectBusinessAssets,
            protectOther: this.protectOther
        }
    }
}

export class ProtectBuilder {
    private _id: number;
    private _leadId: number;
    private _buyInsurance: boolean;
    private _protectIncome: boolean;
    private _protectInsuredPerson: boolean;
    private _protectBusinessAssets: boolean;
    private _protectOther: boolean;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;

    fromProtect(value: Protect): ProtectBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setBuyInsurance(value.buyInsurance)
            .setProtectIncome(value.protectIncome)
            .setProtectInsuredPerson(value.protectInsuredPerson)
            .setProtectBusinessAssets(value.protectBusinessAssets)
            .setProtectOther(value.protectOther)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiCreateProtectResponseData(value: ApiCreateProtectResponseData): ProtectBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setBuyInsurance(value.buyInsurance)
            .setProtectIncome(value.protectIncome)
            .setProtectInsuredPerson(value.protectInsuredPerson)
            .setProtectBusinessAssets(value.protectBusinessAssets)
            .setProtectOther(value.protectOther)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiUpdateProtectResponseData(value: ApiCreateProtectResponseData): ProtectBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setBuyInsurance(value.buyInsurance)
            .setProtectIncome(value.protectIncome)
            .setProtectInsuredPerson(value.protectInsuredPerson)
            .setProtectBusinessAssets(value.protectBusinessAssets)
            .setProtectOther(value.protectOther)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    setId(value: number): ProtectBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setLeadId(value: number): ProtectBuilder {
        this._leadId = value;
        return this;
    }

    get leadId() {
        return this._leadId;
    }

    setBuyInsurance(value: boolean): ProtectBuilder {
        this._buyInsurance = value;
        return this;
    }

    get buyInsurance() {
        return this._buyInsurance;
    }

    setProtectIncome(value: boolean): ProtectBuilder {
        this._protectIncome = value;
        return this;
    }

    get protectIncome() {
        return this._protectIncome;
    }

    setProtectInsuredPerson(value: boolean): ProtectBuilder {
        this._protectInsuredPerson = value;
        return this;
    }

    get protectInsuredPerson() {
        return this._protectInsuredPerson;
    }

    setProtectBusinessAssets(value: boolean): ProtectBuilder {
        this._protectBusinessAssets = value;
        return this;
    }

    get protectBusinessAssets() {
        return this._protectBusinessAssets;
    }

    setProtectOther(value: boolean): ProtectBuilder {
        this._protectOther = value;
        return this;
    }

    get protectOther() {
        return this._protectOther;
    }

    setCreator(value: string): ProtectBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): ProtectBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): ProtectBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): ProtectBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }

    build(): Protect {
        return new Protect(this);
    }
}
