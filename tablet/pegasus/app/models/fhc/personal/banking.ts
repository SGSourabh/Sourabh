export interface ApiCreateBankingRequestData {
    cashFlowBank: boolean;
    cashFlowOtherBank: boolean;
    transactBranches: boolean;
    transactInternetBanking: boolean;
    transactSmartphone: boolean;
    transactPhone: boolean;
    paymodeCreditCard: boolean;
    paymodeCash: boolean;
    paymodeBankTransfer: boolean;
    paymodeOther: boolean;
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
    paymodeCreditCard: boolean;
    paymodeCash: boolean;
    paymodeBankTransfer: boolean;
    paymodeOther: boolean;
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
    paymodeCreditCard: boolean;
    paymodeCash: boolean;
    paymodeBankTransfer: boolean;
    paymodeOther: boolean;
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
    paymodeCreditCard: boolean;
    paymodeCash: boolean;
    paymodeBankTransfer: boolean;
    paymodeOther: boolean;
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
    paymodeCreditCard: boolean;
    paymodeCash: boolean;
    paymodeBankTransfer: boolean;
    paymodeOther: boolean;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    bankId:any;

    constructor(builder: BankingBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.cashFlowBank = builder.cashFlowBank;
        this.cashFlowOtherBank = builder.cashFlowOtherBank;
        this.transactBranches = builder.transactBranches;
        this.transactInternetBanking = builder.transactInternetBanking;
        this.transactSmartphone = builder.transactSmartphone;
        this.transactPhone = builder.transactPhone;
        this.paymodeCreditCard = builder.paymodeCreditCard;
        this.paymodeCash = builder.paymodeCash;
        this.paymodeBankTransfer = builder.paymodeBankTransfer;
        this.paymodeOther = builder.paymodeOther;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
        this.bankId  = builder.bankId;
    }

    toApiCreateBankingRequestData(): ApiCreateBankingRequestData {
        return {
            cashFlowBank: this.cashFlowBank,
            cashFlowOtherBank: this.cashFlowOtherBank,
            transactBranches: this.transactBranches,
            transactInternetBanking: this.transactInternetBanking,
            transactSmartphone: this.transactSmartphone,
            transactPhone: this.transactPhone,
            paymodeCreditCard: this.paymodeCreditCard,
            paymodeCash: this.paymodeCash,
            paymodeBankTransfer: this.paymodeBankTransfer,
            paymodeOther: this.paymodeOther,
            bankId: this.bankId
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
            paymodeCreditCard: this.paymodeCreditCard,
            paymodeCash: this.paymodeCash,
            paymodeBankTransfer: this.paymodeBankTransfer,
            paymodeOther: this.paymodeOther,
            bankId : this.bankId
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
    private _paymodeCreditCard: boolean;
    private _paymodeCash: boolean;
    private _paymodeBankTransfer: boolean;
    private _paymodeOther: boolean;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;
    private _bankId:any;

    fromBanking(value: Banking): BankingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setCashFlowBank(value.cashFlowBank)
            .setCashFlowOtherBank(value.cashFlowOtherBank)
            .setTransactBranches(value.transactBranches)
            .setTransactInternetBanking(value.transactInternetBanking)
            .setTransactSmartphone(value.transactSmartphone)
            .setTransactPhone(value.transactPhone)
            .setPaymodeCreditCard(value.paymodeCreditCard)
            .setPaymodeCash(value.paymodeCash)
            .setPaymodeBankTransfer(value.paymodeBankTransfer)
            .setPaymodeOther(value.paymodeOther)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId)
    }

    fromApiCreateBankingResponseData(value: ApiCreateBankingResponseData): BankingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setCashFlowBank(value.cashFlowBank)
            .setCashFlowOtherBank(value.cashFlowOtherBank)
            .setTransactBranches(value.transactBranches)
            .setTransactInternetBanking(value.transactInternetBanking)
            .setTransactSmartphone(value.transactSmartphone)
            .setTransactPhone(value.transactPhone)
            .setPaymodeCreditCard(value.paymodeCreditCard)
            .setPaymodeCash(value.paymodeCash)
            .setPaymodeBankTransfer(value.paymodeBankTransfer)
            .setPaymodeOther(value.paymodeOther)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setBankId(value.bankId);
    }

    fromApiUpdateBankingResponseData(value: ApiCreateBankingResponseData): BankingBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setCashFlowBank(value.cashFlowBank)
            .setCashFlowOtherBank(value.cashFlowOtherBank)
            .setTransactBranches(value.transactBranches)
            .setTransactInternetBanking(value.transactInternetBanking)
            .setTransactSmartphone(value.transactSmartphone)
            .setTransactPhone(value.transactPhone)
            .setPaymodeCreditCard(value.paymodeCreditCard)
            .setPaymodeCash(value.paymodeCash)
            .setPaymodeBankTransfer(value.paymodeBankTransfer)
            .setPaymodeOther(value.paymodeOther)
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

    setPaymodeCreditCard(value: boolean): BankingBuilder {
        this._paymodeCreditCard = value;
        return this;
    }

    get paymodeCreditCard() {
        return this._paymodeCreditCard;
    }

    setPaymodeCash(value: boolean): BankingBuilder {
        this._paymodeCash = value;
        return this;
    }

    get paymodeCash() {
        return this._paymodeCash;
    }

    setPaymodeBankTransfer(value: boolean): BankingBuilder {
        this._paymodeBankTransfer = value;
        return this;
    }

    get paymodeBankTransfer() {
        return this._paymodeBankTransfer;
    }

    setPaymodeOther(value: boolean): BankingBuilder {
        this._paymodeOther = value;
        return this;
    }

    get paymodeOther() {
        return this._paymodeOther;
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
        this._bankId=value;
        return this;
    }
    get bankId(){
        return this._bankId;
    }
    build(): Banking {
        return new Banking(this);
    }
}
