export interface ApiCreateProtectRequestData {
    death: boolean;
    disability: boolean;
    criticalIllness: boolean;
    hospitilisation: boolean;
    longevity: boolean;
    manageRisks: boolean;
}

export interface ApiCreateProtectResponseData {
    id: number;
    leadId: number;
    death: boolean;
    disability: boolean;
    criticalIllness: boolean;
    hospitilisation: boolean;
    longevity: boolean;
    manageRisks: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateProtectRequestData {
    death: boolean;
    disability: boolean;
    criticalIllness: boolean;
    hospitilisation: boolean;
    longevity: boolean;
    manageRisks: boolean;
}

export interface ApiUpdateProtectResponseData {
    id: number;
    leadId: number;
    death: boolean;
    disability: boolean;
    criticalIllness: boolean;
    hospitilisation: boolean;
    longevity: boolean;
    manageRisks: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export class Protect {
    id: number;
    leadId: number;
    death: boolean;
    disability: boolean;
    criticalIllness: boolean;
    hospitilisation: boolean;
    longevity: boolean;
    manageRisks: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;

    constructor(builder: ProtectBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.death = builder.death;
        this.disability = builder.disability;
        this.criticalIllness = builder.criticalIllness;
        this.hospitilisation = builder.hospitilisation;
        this.longevity = builder.longevity;
        this.manageRisks = builder.manageRisks;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
    }

    toApiCreateProtectRequestData(): ApiCreateProtectRequestData {
        return {
            death: this.death,
            disability: this.disability,
            criticalIllness: this.criticalIllness,
            hospitilisation: this.hospitilisation,
            longevity: this.longevity,
            manageRisks: this.manageRisks
        }
    }

    toApiUpdateProtectRequestData(): ApiUpdateProtectRequestData {
        return {
            death: this.death,
            disability: this.disability,
            criticalIllness: this.criticalIllness,
            hospitilisation: this.hospitilisation,
            longevity: this.longevity,
            manageRisks: this.manageRisks
        }
    }
}

export class ProtectBuilder {
    private _id: number;
    private _leadId: number;
    private _death: boolean;
    private _disability: boolean;
    private _criticalIllness: boolean;
    private _hospitilisation: boolean;
    private _longevity: boolean;
    private _manageRisks: boolean;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;

    fromProtect(value: Protect): ProtectBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setDeath(value.death)
            .setDisability(value.disability)
            .setCriticalIllness(value.criticalIllness)
            .setHospitilisation(value.hospitilisation)
            .setLongevity(value.longevity)
            .setManageRisks(value.manageRisks)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiCreateProtectResponseData(value: ApiCreateProtectResponseData): ProtectBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setDeath(value.death)
            .setDisability(value.disability)
            .setCriticalIllness(value.criticalIllness)
            .setHospitilisation(value.hospitilisation)
            .setLongevity(value.longevity)
            .setManageRisks(value.manageRisks)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiUpdateProtectResponseData(value: ApiCreateProtectResponseData): ProtectBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setDeath(value.death)
            .setDisability(value.disability)
            .setCriticalIllness(value.criticalIllness)
            .setHospitilisation(value.hospitilisation)
            .setLongevity(value.longevity)
            .setManageRisks(value.manageRisks)
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

    setDeath(value: boolean): ProtectBuilder {
        this._death = value;
        return this;
    }

    get death() {
        return this._death;
    }

    setDisability(value: boolean): ProtectBuilder {
        this._disability = value;
        return this;
    }

    get disability() {
        return this._disability;
    }

    setCriticalIllness(value: boolean): ProtectBuilder {
        this._criticalIllness = value;
        return this;
    }

    get criticalIllness() {
        return this._criticalIllness;
    }

    setHospitilisation(value: boolean): ProtectBuilder {
        this._hospitilisation = value;
        return this;
    }

    get hospitilisation() {
        return this._hospitilisation;
    }

    setLongevity(value: boolean): ProtectBuilder {
        this._longevity = value;
        return this;
    }

    get longevity() {
        return this._longevity;
    }

    setManageRisks(value: boolean): ProtectBuilder {
        this._manageRisks = value;
        return this;
    }

    get manageRisks() {
        return this._manageRisks;
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
