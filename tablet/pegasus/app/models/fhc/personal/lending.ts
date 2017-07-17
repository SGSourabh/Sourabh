export interface ApiCreateLendingRequestData {
    purposeMortgage: boolean;
    purposeAuto: boolean;
    purposePersonal: boolean;
    purposeCreditCard: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creditIntent: boolean;
    bankId:any;
}

export interface ApiCreateLendingResponseData {
    id: number;
    leadId: number;
    purposeMortgage: boolean;
    purposeAuto: boolean;
    purposePersonal: boolean;
    purposeCreditCard: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creditIntent: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;
}

export interface ApiUpdateLendingRequestData {
    purposeMortgage: boolean;
    purposeAuto: boolean;
    purposePersonal: boolean;
    purposeCreditCard: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creditIntent: boolean;
    bankId:any;
}

export interface ApiUpdateLendingResponseData {
    id: number;
    leadId: number;
    purposeMortgage: boolean;
    purposeAuto: boolean;
    purposePersonal: boolean;
    purposeCreditCard: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creditIntent: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;
}

export class Lending {
    id: number;
    leadId: number;
    purposeMortgage: boolean;
    purposeAuto: boolean;
    purposePersonal: boolean;
    purposeCreditCard: boolean;
    lenderBank: boolean;
    lenderOther: boolean;
    interest: string;
    creditIntent: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;

    constructor(builder: LendingBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.purposeMortgage = builder.purposeMortgage;
        this.purposeAuto = builder.purposeAuto;
        this.purposePersonal = builder.purposePersonal;
        this.purposeCreditCard = builder.purposeCreditCard;
        this.lenderBank = builder.lenderBank;
        this.lenderOther = builder.lenderOther;
        this.interest = builder.interest;
        this.creditIntent = builder.creditIntent;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
        this.bankId = builder.bankId;
    }

    toApiCreateLendingRequestData(): ApiCreateLendingRequestData {
        return {
            purposeMortgage: this.purposeMortgage,
            purposeAuto: this.purposeAuto,
            purposePersonal: this.purposePersonal,
            purposeCreditCard: this.purposeCreditCard,
            lenderBank: this.lenderBank,
            lenderOther: this.lenderOther,
            interest: this.interest,
            creditIntent: this.creditIntent,
            bankId : this.bankId
        }
    }

    toApiUpdateLendingRequestData(): ApiUpdateLendingRequestData {
        return {
            purposeMortgage: this.purposeMortgage,
            purposeAuto: this.purposeAuto,
            purposePersonal: this.purposePersonal,
            purposeCreditCard: this.purposeCreditCard,
            lenderBank: this.lenderBank,
            lenderOther: this.lenderOther,
            interest: this.interest,
            creditIntent: this.creditIntent,
            bankId :this.bankId
        }
    }
}

export class LendingBuilder {
    private _id: number;
    private _leadId: number;
    private _purposeMortgage: boolean;
    private _purposeAuto: boolean;
    private _purposePersonal: boolean;
    private _purposeCreditCard: boolean;
    private _lenderBank: boolean;
    private _lenderOther: boolean;
    private _interest: string;
    private _creditIntent: boolean;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;
    private _bankId:any;

    fromLending(value: Lending): LendingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setPurposeMortgage(value.purposeMortgage)
            .setPurposeAuto(value.purposeAuto)
            .setPurposePersonal(value.purposePersonal)
            .setPurposeCreditCard(value.purposeCreditCard)
            .setLenderBank(value.lenderBank)
            .setLenderOther(value.lenderOther)
            .setInterest(value.interest)
            .setCreditIntent(value.creditIntent)
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
            .setPurposeMortgage(value.purposeMortgage)
            .setPurposeAuto(value.purposeAuto)
            .setPurposePersonal(value.purposePersonal)
            .setPurposeCreditCard(value.purposeCreditCard)
            .setLenderBank(value.lenderBank)
            .setLenderOther(value.lenderOther)
            .setInterest(value.interest)
            .setCreditIntent(value.creditIntent)
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
            .setPurposeMortgage(value.purposeMortgage)
            .setPurposeAuto(value.purposeAuto)
            .setPurposePersonal(value.purposePersonal)
            .setPurposeCreditCard(value.purposeCreditCard)
            .setLenderBank(value.lenderBank)
            .setLenderOther(value.lenderOther)
            .setInterest(value.interest)
            .setCreditIntent(value.creditIntent)
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

    setPurposeMortgage(value: boolean): LendingBuilder {
        this._purposeMortgage = value;
        return this;
    }

    get purposeMortgage() {
        return this._purposeMortgage;
    }

    setPurposeAuto(value: boolean): LendingBuilder {
        this._purposeAuto = value;
        return this;
    }

    get purposeAuto() {
        return this._purposeAuto;
    }

    setPurposePersonal(value: boolean): LendingBuilder {
        this._purposePersonal = value;
        return this;
    }

    get purposePersonal() {
        return this._purposePersonal;
    }

    setPurposeCreditCard(value: boolean): LendingBuilder {
        this._purposeCreditCard = value;
        return this;
    }

    get purposeCreditCard() {
        return this._purposeCreditCard;
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

    setCreditIntent(value: boolean): LendingBuilder {
        this._creditIntent = value;
        return this;
    }

    get creditIntent() {
        return this._creditIntent;
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
    setBankId(value:any): LendingBuilder{
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
