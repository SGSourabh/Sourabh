export interface ApiComplianceRequestData {
    firstName?: string;
    lastName?: string;
    nationalID?: string;
}

export interface ApiComplianceResponseData {
    value: boolean;
}

export class Compliance {
    value: boolean;

    constructor(builder: ComplianceBuilder) {
        this.value = builder.value;
    }
}

export class ComplianceBuilder {
    private _value: boolean;

    fromCompliance(value: Compliance): ComplianceBuilder {
        return this
            .setValue(value.value);
    }

    fromApiComplianceResponseData(value: ApiComplianceResponseData): ComplianceBuilder {
        return this
            .setValue(value.value);
    }

    setValue(value: boolean): ComplianceBuilder {
        this._value = value;
        return this;
    }

    get value() {
        return this._value;
    }

    build(): Compliance {
        return new Compliance(this);
    }
}
