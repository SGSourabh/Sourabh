import {Banking, BankingBuilder} from "./personal/banking";
import {Lending, LendingBuilder} from "./personal/lending";
import {Protect, ProtectBuilder} from "./personal/protect";
import {Saving, SavingBuilder} from "./personal/saving";

export class Personal {
    private _banking: Banking;
    private _lending: Lending;
    private _protect: Protect;
    private _saving: Saving;

    constructor(builder: PersonalBuilder) {
        this._banking = builder.banking;
        this._lending = builder.lending;
        this._protect = builder.protect;
        this._saving = builder.saving;
    }

    buildBanking(value: Banking): Personal {
        this._banking = new BankingBuilder().fromBanking(value).build();
        return this;
    }

    get banking() {
        return this._banking;
    }

    buildLending(value: Lending): Personal {
        this._lending = new LendingBuilder().fromLending(value).build();
        return this;
    }

    get lending() {
        return this._lending;
    }

    buildProtect(value: Protect): Personal {
        this._protect = new ProtectBuilder().fromProtect(value).build();
        return this;
    }

    get protect() {
        return this._protect;
    }

    buildSaving(value: Saving): Personal {
        this._saving = new SavingBuilder().fromSaving(value).build();
        return this;
    }

    get saving() {
        return this._saving;
    }

}

export class PersonalBuilder {
    private _banking: Banking;
    private _lending: Lending;
    private _protect: Protect;
    private _saving: Saving;

    fromPersonal(value: Personal): PersonalBuilder {
        return this
            .setBanking(value.banking)
            .setLending(value.lending)
            .setProtect(value.protect)
            .setSaving(value.saving);
    }

    setBanking(value: Banking): PersonalBuilder {
        this._banking = value;
        return this;
    }

    get banking() {
        return this._banking;
    }

    setLending(value: Lending): PersonalBuilder {
        this._lending = value;
        return this;
    }

    get lending() {
        return this._lending;
    }

    setProtect(value: Protect): PersonalBuilder {
        this._protect = value;
        return this;
    }

    get protect() {
        return this._protect;
    }

    setSaving(value: Saving): PersonalBuilder {
        this._saving = value;
        return this;
    }

    get saving() {
        return this._saving;
    }

    build(): Personal {
        return new Personal(this);
    }
}
