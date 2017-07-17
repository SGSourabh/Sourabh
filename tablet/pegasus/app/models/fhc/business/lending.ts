export interface ApiCreateLendingRequestData {
    purposeFixedInvAssets: boolean;
    purposeShortWorkingCapital: boolean;
    purposeBusinessAuto: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    bankId:any;
}

export interface ApiCreateLendingResponseData {
    id: number;
    leadId: number;
    purposeFixedInvAssets: boolean;
    purposeShortWorkingCapital: boolean;
    purposeBusinessAuto: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;
}

export interface ApiUpdateLendingRequestData {
    purposeFixedInvAssets: boolean;
    purposeShortWorkingCapital: boolean;
    purposeBusinessAuto: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    bankId:any;
}

export interface ApiUpdateLendingResponseData {
    id: number;
    leadId: number;
    purposeFixedInvAssets: boolean;
    purposeShortWorkingCapital: boolean;
    purposeBusinessAuto: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;
}

export class Lending {
    id: number;
    leadId: number;
    purposeFixedInvAssets: boolean;
    purposeShortWorkingCapital: boolean;
    purposeBusinessAuto: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;

    constructor(builder: LendingBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.purposeFixedInvAssets = builder.purposeFixedInvAssets;
        this.purposeShortWorkingCapital = builder.purposeShortWorkingCapital;
        this.purposeBusinessAuto = builder.purposeBusinessAuto;
        this.lenderBank = builder.lenderBank;
        this.lenderOther = builder.lenderOther;
        this.interest = builder.interest;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
        this.bankId = builder.bankId;
    }

    toApiCreateLendingRequestData(): ApiCreateLendingRequestData {
        return {
            purposeFixedInvAssets: this.purposeFixedInvAssets,
            purposeShortWorkingCapital: this.purposeShortWorkingCapital,
            purposeBusinessAuto: this.purposeBusinessAuto,
            lenderBank: this.lenderBank,
            lenderOther: this.lenderOther,
            interest: this.interest,
            bankId: this.bankId
        }
    }

    toApiUpdateLendingRequestData(): ApiUpdateLendingRequestData {
        return {
            purposeFixedInvAssets: this.purposeFixedInvAssets,
            purposeShortWorkingCapital: this.purposeShortWorkingCapital,
            purposeBusinessAuto: this.purposeBusinessAuto,
            lenderBank: this.lenderBank,
            lenderOther: this.lenderOther,
            interest: this.interest,
            bankId: this.bankId
        }
    }
}

export class LendingBuilder {
    private _id: number;
    private _leadId: number;
    private _purposeFixedInvAssets: boolean;
    private _purposeShortWorkingCapital: boolean;
    private _purposeBusinessAuto: boolean;
    private _lenderBank: boolean;
    private _lenderOther: boolean;
    private _interest: string;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;
    private _bankId:any;

    fromLending(value: Lending): LendingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setPurposeFixedInvAssets(value.purposeFixedInvAssets)
            .setPurposeShortWorkingCapital(value.purposeShortWorkingCapital)
            .setPurposeBusinessAuto(value.purposeBusinessAuto)
            .setLenderBank(value.lenderBank)
            .setLenderOther(value.lenderOther)
            .setInterest(value.interest)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }

    fromApiCreateLendingResponseData(value: ApiCreateLendingResponseData): LendingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setPurposeFixedInvAssets(value.purposeFixedInvAssets)
            .setPurposeShortWorkingCapital(value.purposeShortWorkingCapital)
            .setPurposeBusinessAuto(value.purposeBusinessAuto)
            .setLenderBank(value.lenderBank)
            .setLenderOther(value.lenderOther)
            .setInterest(value.interest)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }


    fromApiUpdateLendingResponseData(value: ApiCreateLendingResponseData): LendingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setPurposeFixedInvAssets(value.purposeFixedInvAssets)
            .setPurposeShortWorkingCapital(value.purposeShortWorkingCapital)
            .setPurposeBusinessAuto(value.purposeBusinessAuto)
            .setLenderBank(value.lenderBank)
            .setLenderOther(value.lenderOther)
            .setInterest(value.interest)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }

    setId(value: number): LendingBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setLeadId(value: number): LendingBuilder {
        this._leadId = value;
        return this;
    }

    get leadId() {
        return this._leadId;
    }

    setPurposeFixedInvAssets(value: boolean): LendingBuilder {
        this._purposeFixedInvAssets = value;
        return this;
    }

    get purposeFixedInvAssets() {
        return this._purposeFixedInvAssets;
    }

    setPurposeShortWorkingCapital(value: boolean): LendingBuilder {
        this._purposeShortWorkingCapital = value;
        return this;
    }

    get purposeShortWorkingCapital() {
        return this._purposeShortWorkingCapital;
    }

    setPurposeBusinessAuto(value: boolean): LendingBuilder {
        this._purposeBusinessAuto = value;
        return this;
    }

    get purposeBusinessAuto() {
        return this._purposeBusinessAuto;
    }

    setLenderBank(value: boolean): LendingBuilder {
        this._lenderBank = value;
        return this;
    }

    get lenderBank() {
        return this._lenderBank;
    }

    setLenderOther(value: boolean): LendingBuilder {
        this._lenderOther = value;
        return this;
    }

    get lenderOther() {
        return this._lenderOther;
    }

    setInterest(value: string): LendingBuilder {
        this._interest = value;
        return this;
    }

    get interest() {
        return this._interest;
    }

    setCreator(value: string): LendingBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): LendingBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): LendingBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): LendingBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }
    setBankId(value: any): LendingBuilder {
        this._bankId = value;
        return this;
    }
    get bankId(){
        return this._bankId;
    }

    build(): Lending {
        return new Lending(this);
    }
}
