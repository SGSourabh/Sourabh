import {Personal, PersonalBuilder} from "./fhc/personal";
import {Business, BusinessBuilder} from "./fhc/business";

export class Fhc {
    private _personal: Personal;
    private _business: Business;

    constructor(builder: FhcBuilder) {
        this._personal = builder.personal;
        this._business = builder.business;
    }

    buildPersonal(value: Personal): Fhc {
        this._personal = new PersonalBuilder().fromPersonal(value).build();
        return this;
    }

    get personal() {
        return this._personal;
    }

    buildBusiness(value: Business): Fhc {
        this._business = new BusinessBuilder().fromBusiness(value).build();
        return this;
    }

    get business() {
        return this._business;
    }
}

export class FhcBuilder {
    private _personal: Personal;
    private _business: Business;

    fromFhc(value: Fhc): FhcBuilder {
        return this
            .setPersonal(value.personal)
            .setBusiness(value.business);
    }

    setPersonal(value: Personal): FhcBuilder {
        this._personal = value;
        return this;
    }

    get personal() {
        return this._personal;
    }

    setBusiness(value: Business): FhcBuilder {
        this._business = value;
        return this;
    }

    get business() {
        return this._business;
    }

    build(): Fhc {
        return new Fhc(this);
    }
}
