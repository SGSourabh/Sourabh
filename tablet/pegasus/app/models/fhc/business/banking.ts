export interface ApiCreateBankingRequestData {
    cashFlowBank: boolean;
    cashFlowOtherBank: boolean;
    transactBranches: boolean;
    transactInternetBanking: boolean;
    transactSmartphone: boolean;
    transactPhone: boolean;
    payReceiveCheque: boolean;
    payReceiveCash: boolean;
    payReceiveBank: boolean;
    payReceiveOtherBank: boolean;
    paymodeCash: boolean;
    paymodeBank: boolean;
    paymodeOtherBank: boolean;
    bankId:any;
}

export interface ApiCreateBankingResponseData {
    id: number;
    leadId: number;
    cashFlowBank: boolean;
    cashFlowOtherBank: boolean;
    transactBranches: boolean;
    transactInternetBanking: boolean;
    transactSmartphone: boolean;
    transactPhone: boolean;
    payReceiveCheque: boolean;
    payReceiveCash: boolean;
    payReceiveBank: boolean;
    payReceiveOtherBank: boolean;
    paymodeCash: boolean;
    paymodeBank: boolean;
    paymodeOtherBank: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;
}

export interface ApiUpdateBankingRequestData {
    cashFlowBank: boolean;
    cashFlowOtherBank: boolean;
    transactBranches: boolean;
    transactInternetBanking: boolean;
    transactSmartphone: boolean;
    transactPhone: boolean;
    payReceiveCheque: boolean;
    payReceiveCash: boolean;
    payReceiveBank: boolean;
    payReceiveOtherBank: boolean;
    paymodeCash: boolean;
    paymodeBank: boolean;
    paymodeOtherBank: boolean;
    bankId:any;
}

export interface ApiUpdateBankingResponseData {
    id: number;
    leadId: number;
    cashFlowBank: boolean;
    cashFlowOtherBank: boolean;
    transactBranches: boolean;
    transactInternetBanking: boolean;
    transactSmartphone: boolean;
    transactPhone: boolean;
    payReceiveCheque: boolean;
    payReceiveCash: boolean;
    payReceiveBank: boolean;
    payReceiveOtherBank: boolean;
    paymodeCash: boolean;
    paymodeBank: boolean;
    paymodeOtherBank: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;
}

export class Banking {
    id: number;
    leadId: number;
    cashFlowBank: boolean;
    cashFlowOtherBank: boolean;
    transactBranches: boolean;
    transactInternetBanking: boolean;
    transactSmartphone: boolean;
    transactPhone: boolean;
    payReceiveCheque: boolean;
    payReceiveCash: boolean;
    payReceiveBank: boolean;
    payReceiveOtherBank: boolean;
    paymodeCash: boolean;
    paymodeBank: boolean;
    paymodeOtherBank: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;

    constructor(builder: BankingBuilder) {
        this.id = builder.id;
        this.cashFlowBank = builder.cashFlowBank;
        this.cashFlowOtherBank = builder.cashFlowOtherBank;
        this.transactBranches = builder.transactBranches;
        this.transactInternetBanking = builder.transactInternetBanking;
        this.transactSmartphone = builder.transactSmartphone;
        this.transactPhone = builder.transactPhone;
        this.payReceiveCheque = builder.payReceiveCheque;
        this.payReceiveCash = builder.payReceiveCash;
        this.payReceiveBank = builder.payReceiveBank;
        this.payReceiveOtherBank = builder.payReceiveOtherBank;
        this.paymodeCash = builder.paymodeCash;
        this.paymodeBank = builder.paymodeBank;
        this.paymodeOtherBank = builder.paymodeOtherBank;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
        this.bankId = builder.bankId;
    }

    toApiCreateBankingRequestData(): ApiCreateBankingRequestData {
        return {
            cashFlowBank: this.cashFlowBank,
            cashFlowOtherBank: this.cashFlowOtherBank,
            transactBranches: this.transactBranches,
            transactInternetBanking: this.transactInternetBanking,
            transactSmartphone: this.transactSmartphone,
            transactPhone: this.transactPhone,
            payReceiveCheque: this.payReceiveCheque,
            payReceiveCash: this.payReceiveCash,
            payReceiveBank: this.payReceiveBank,
            payReceiveOtherBank: this.payReceiveOtherBank,
            paymodeCash: this.paymodeCash,
            paymodeBank: this.paymodeBank,
            paymodeOtherBank: this.paymodeOtherBank,
            bankId :this.bankId,
        }
    }

    toApiUpdateBankingRequestData(): ApiUpdateBankingRequestData {
        return {
            cashFlowBank: this.cashFlowBank,
            cashFlowOtherBank: this.cashFlowOtherBank,
            transactBranches: this.transactBranches,
            transactInternetBanking: this.transactInternetBanking,
            transactSmartphone: this.transactSmartphone,
            transactPhone: this.transactPhone,
            payReceiveCheque: this.payReceiveCheque,
            payReceiveCash: this.payReceiveCash,
            payReceiveBank: this.payReceiveBank,
            payReceiveOtherBank: this.payReceiveOtherBank,
            paymodeCash: this.paymodeCash,
            paymodeBank: this.paymodeBank,
            paymodeOtherBank: this.paymodeOtherBank,
            bankId : this.bankId,
        }
    }
}

export class BankingBuilder {
    private _id: number;
    private _leadId: number;
    private _cashFlowBank: boolean;
    private _cashFlowOtherBank: boolean;
    private _transactBranches: boolean;
    private _transactInternetBanking: boolean;
    private _transactSmartphone: boolean;
    private _transactPhone: boolean;
    private _payReceiveCheque: boolean;
    private _payReceiveCash: boolean;
    private _payReceiveBank: boolean;
    private _payReceiveOtherBank: boolean;
    private _paymodeCash: boolean;
    private _paymodeBank: boolean;
    private _paymodeOtherBank: boolean;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;
    private _bankId :any;

    fromBanking(value: Banking): BankingBuilder {
        return this
            .setId(value.id)
            .setCashFlowBank(value.cashFlowBank)
            .setCashFlowOtherBank(value.cashFlowOtherBank)
            .setTransactBranches(value.transactBranches)
            .setTransactInternetBanking(value.transactInternetBanking)
            .setTransactSmartphone(value.transactSmartphone)
            .setTransactPhone(value.transactPhone)
            .setPayReceiveCheque(value.payReceiveCheque)
            .setPayReceiveCash(value.payReceiveCash)
            .setPayReceiveBank(value.payReceiveBank)
            .setPayReceiveOtherBank(value.payReceiveOtherBank)
            .setPaymodeCash(value.paymodeCash)
            .setPaymodeBank(value.paymodeBank)
            .setPaymodeOtherBank(value.paymodeOtherBank)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }

    fromApiCreateBankingResponseData(value: ApiCreateBankingResponseData): BankingBuilder {
        return this
            .setId(value.id)
            .setCashFlowBank(value.cashFlowBank)
            .setCashFlowOtherBank(value.cashFlowOtherBank)
            .setTransactBranches(value.transactBranches)
            .setTransactInternetBanking(value.transactInternetBanking)
            .setTransactSmartphone(value.transactSmartphone)
            .setTransactPhone(value.transactPhone)
            .setPayReceiveCheque(value.payReceiveCheque)
            .setPayReceiveCash(value.payReceiveCash)
            .setPayReceiveBank(value.payReceiveBank)
            .setPayReceiveOtherBank(value.payReceiveOtherBank)
            .setPaymodeCash(value.paymodeCash)
            .setPaymodeBank(value.paymodeBank)
            .setPaymodeOtherBank(value.paymodeOtherBank)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }

    fromApiUpdateBankingResponseData(value: ApiCreateBankingResponseData): BankingBuilder {
        return this
            .setId(value.id)
            .setCashFlowBank(value.cashFlowBank)
            .setCashFlowOtherBank(value.cashFlowOtherBank)
            .setTransactBranches(value.transactBranches)
            .setTransactInternetBanking(value.transactInternetBanking)
            .setTransactSmartphone(value.transactSmartphone)
            .setTransactPhone(value.transactPhone)
            .setPayReceiveCheque(value.payReceiveCheque)
            .setPayReceiveCash(value.payReceiveCash)
            .setPayReceiveBank(value.payReceiveBank)
            .setPayReceiveOtherBank(value.payReceiveOtherBank)
            .setPaymodeCash(value.paymodeCash)
            .setPaymodeBank(value.paymodeBank)
            .setPaymodeOtherBank(value.paymodeOtherBank)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }

    setId(value: number): BankingBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setLeadId(value: number): BankingBuilder {
        this._leadId = value;
        return this;
    }

    get leadId() {
        return this._leadId;
    }

    setCashFlowBank(value: boolean): BankingBuilder {
        this._cashFlowBank = value;
        return this;
    }

    get cashFlowBank() {
        return this._cashFlowBank;
    }

    setCashFlowOtherBank(value: boolean): BankingBuilder {
        this._cashFlowOtherBank = value;
        return this;
    }

    get cashFlowOtherBank() {
        return this._cashFlowOtherBank;
    }

    setTransactBranches(value: boolean): BankingBuilder {
        this._transactBranches = value;
        return this;
    }

    get transactBranches() {
        return this._transactBranches;
    }

    setTransactInternetBanking(value: boolean): BankingBuilder {
        this._transactInternetBanking = value;
        return this;
    }

    get transactInternetBanking() {
        return this._transactInternetBanking;
    }

    setTransactSmartphone(value: boolean): BankingBuilder {
        this._transactSmartphone = value;
        return this;
    }

    get transactSmartphone() {
        return this._transactSmartphone;
    }

    setTransactPhone(value: boolean): BankingBuilder {
        this._transactPhone = value;
        return this;
    }

    get transactPhone() {
        return this._transactPhone;
    }

    setPayReceiveCheque(value: boolean): BankingBuilder {
        this._payReceiveCheque = value;
        return this;
    }

    get payReceiveCheque() {
        return this._payReceiveCheque;
    }

    setPayReceiveCash(value: boolean): BankingBuilder {
        this._payReceiveCash = value;
        return this;
    }

    get payReceiveCash() {
        return this._payReceiveCash;
    }

    setPayReceiveBank(value: boolean): BankingBuilder {
        this._payReceiveBank = value;
        return this;
    }

    get payReceiveBank() {
        return this._payReceiveBank;
    }

    setPayReceiveOtherBank(value: boolean): BankingBuilder {
        this._payReceiveOtherBank = value;
        return this;
    }

    get payReceiveOtherBank() {
        return this._payReceiveOtherBank;
    }

    setPaymodeCash(value: boolean): BankingBuilder {
        this._paymodeCash = value;
        return this;
    }

    get paymodeCash() {
        return this._paymodeCash;
    }

    setPaymodeBank(value: boolean): BankingBuilder {
        this._paymodeBank = value;
        return this;
    }

    get paymodeBank() {
        return this._paymodeBank;
    }

    setPaymodeOtherBank(value: boolean): BankingBuilder {
        this._paymodeOtherBank = value;
        return this;
    }

    get paymodeOtherBank() {
        return this._paymodeOtherBank;
    }

    setCreator(value: string): BankingBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): BankingBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): BankingBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): BankingBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }
    setBankId(value:any): BankingBuilder{
        this._bankId =value;
        return this;
    }
    get bankId(){
        return this._bankId;
    }
    build(): Banking {
        return new Banking(this);
    }
}
