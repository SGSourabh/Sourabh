import {Banking, BankingBuilder} from "./business/banking";
import {Lending, LendingBuilder} from "./business/lending";
import {Protect, ProtectBuilder} from "./business/protect";

export class Business {
    private _banking: Banking;
    private _lending: Lending;
    private _protect: Protect;

    constructor(builder: BusinessBuilder) {
        this._banking = builder.banking;
        this._lending = builder.lending;
        this._protect = builder.protect;
    }

    buildBanking(value: Banking): Business {
        this._banking = new BankingBuilder().fromBanking(value).build();
        return this;
    }

    get banking() {
        return this._banking;
    }

    buildLending(value: Lending): Business {
        this._lending = new LendingBuilder().fromLending(value).build();
        return this;
    }

    get lending() {
        return this._lending;
    }

    buildProtect(value: Protect): Business {
        this._protect = new ProtectBuilder().fromProtect(value).build();
        return this;
    }

    get protect() {
        return this._protect;
    }

}

export class BusinessBuilder {
    private _banking: Banking;
    private _lending: Lending;
    private _protect: Protect;

    fromBusiness(value: Business): BusinessBuilder {
        return this
            .setBanking(value.banking)
            .setLending(value.lending)
            .setProtect(value.protect);
    }

    setBanking(value: Banking): BusinessBuilder {
        this._banking = value;
        return this;
    }

    get banking() {
        return this._banking;
    }

    setLending(value: Lending): BusinessBuilder {
        this._lending = value;
        return this;
    }

    get lending() {
        return this._lending;
    }

    setProtect(value: Protect): BusinessBuilder {
        this._protect = value;
        return this;
    }

    get protect() {
        return this._protect;
    }

    build(): Business {
        return new Business(this);
    }
}
