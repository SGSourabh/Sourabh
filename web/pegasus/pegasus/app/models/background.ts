export interface ApiBackgroundRequestData {
    education: string;
    employment: string;
    hobbies: string;
    note: string;
    ownership: string;
    residential: string;
    insuranceLife: boolean;
    insuranceGeneral: boolean;
    accumulativeCar: boolean;
    accumulativeOther: boolean;
    classification: string;
    businessState: string;
    occupationType :string;
    businessType:string;
}

export interface ApiBackgroundResponseData {
    education: string;
    employment: string;
    hobbies: string;
    note: string;
    ownership: string;
    residential: string;
    insuranceLife: boolean;
    insuranceGeneral: boolean;
    accumulativeCar: boolean;
    accumulativeOther: boolean;
    classification: string;
    businessState: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    occupationType :string;
    businessType:string;
}

export class Background {
    id: number;
    education: string;
    employment: string;
    hobbies: string;
    note: string;
    ownership: string;
    residential: string;
    insuranceLife: boolean;
    insuranceGeneral: boolean;
    accumulativeCar: boolean;
    accumulativeOther: boolean;
    classification: string;
    businessState: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
    occupationType :string;
    businessType:string;

    constructor(builder: BackgroundBuilder) {
        this.id = builder.id;
        this.education = builder.education;
        this.employment = builder.employment;
        this.hobbies = builder.hobbies;
        this.note = builder.note;
        this.ownership = builder.ownership;
        this.residential = builder.residential;
        this.insuranceLife = builder.insuranceLife;
        this.insuranceGeneral = builder.insuranceGeneral;
        this.accumulativeCar = builder.accumulativeCar;
        this.accumulativeOther = builder.accumulativeOther;
        this.classification = builder.classification;
        this.businessState = builder.businessState;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
        this.occupationType  = builder.occupationType ;
        this.businessType = builder.businessType;
    }

    // get insurance(): boolean {
    //     return this.insuranceLife || this.insuranceGeneral;
    // }
    //
    // get accumulative(): boolean {
    //     return this.accumulativeCar || this.accumulativeOther;
    // }

    toApiBackgroundRequestData(): ApiBackgroundRequestData {
        return {
            education: this.education,
            employment: this.employment,
            hobbies: this.hobbies,
            note: this.note,
            ownership: this.ownership,
            residential: this.residential,
            insuranceLife: this.insuranceLife,
            insuranceGeneral: this.insuranceGeneral,
            accumulativeCar: this.accumulativeCar,
            accumulativeOther: this.accumulativeOther,
            classification: this.classification,
            businessState: this.businessState,
            occupationType :this.occupationType ,
            businessType:this.businessType,
        }
    }
}

export class BackgroundBuilder {
    private _id: number;
    private _education: string;
    private _employment: string;
    private _hobbies: string;
    private _note: string;
    private _ownership: string;
    private _residential: string;
    private _insuranceLife: boolean;
    private _insuranceGeneral: boolean;
    private _accumulativeCar: boolean;
    private _accumulativeOther: boolean;
    private _otherAssets: string;
    private _classification: string;
    private _businessState: string;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;
    private _occupationType :string;
    private _businessType:string;

    fromBackground(value: Background): BackgroundBuilder {
        return this
            .setId(value.id)
            .setEducation(value.education)
            .setEmployment(value.employment)
            .setHobbies(value.hobbies)
            .setNote(value.note)
            .setOwnership(value.ownership)
            .setResidential(value.residential)
            .setInsuranceLife(value.insuranceLife)
            .setInsuranceGeneral(value.insuranceGeneral)
            .setAccumulativeCar(value.accumulativeCar)
            .setAccumulativeOther(value.accumulativeOther)
            .setClassification(value.classification)
            .setBusinessState(value.businessState)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setOccupationType (value.occupationType )
            .setBusinessType(value.businessType );
    }

    fromApiBackgroundResponseData(value: ApiBackgroundResponseData): BackgroundBuilder {
        return this
            .setEducation(value.education)
            .setEmployment(value.employment)
            .setHobbies(value.hobbies)
            .setNote(value.note)
            .setOwnership(value.ownership)
            .setResidential(value.residential)
            .setInsuranceLife(value.insuranceLife)
            .setInsuranceGeneral(value.insuranceGeneral)
            .setAccumulativeCar(value.accumulativeCar)
            .setAccumulativeOther(value.accumulativeOther)
            .setClassification(value.classification)
            .setBusinessState(value.businessState)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setOccupationType (value.occupationType )
            .setBusinessType(value.businessType);
    }

    setId(value: number): BackgroundBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setEducation(value: string): BackgroundBuilder {
        this._education = value;
        return this;
    }

    get education() {
        return this._education;
    }

    setEmployment(value: string): BackgroundBuilder {
        this._employment = value;
        return this;
    }

    get employment() {
        return this._employment;
    }

    setHobbies(value: string): BackgroundBuilder {
        this._hobbies = value;
        return this;
    }

    get hobbies() {
        return this._hobbies;
    }

    setNote(value: string): BackgroundBuilder {
        this._note = value;
        return this;
    }

    get note() {
        return this._note;
    }

    setOwnership(value: string): BackgroundBuilder {
        this._ownership = value;
        return this;
    }

    get ownership() {
        return this._ownership;
    }

    setResidential(value: string): BackgroundBuilder {
        this._residential = value;
        return this;
    }

    get residential() {
        return this._residential;
    }

    setInsuranceLife(value: boolean): BackgroundBuilder {
        this._insuranceLife = value;
        return this;
    }

    get insuranceLife() {
        return this._insuranceLife;
    }

    setInsuranceGeneral(value: boolean): BackgroundBuilder {
        this._insuranceGeneral = value;
        return this;
    }

    get insuranceGeneral() {
        return this._insuranceGeneral;
    }

    setAccumulativeCar(value: boolean): BackgroundBuilder {
        this._accumulativeCar = value;
        return this;
    }

    get accumulativeCar() {
        return this._accumulativeCar;
    }

    setAccumulativeOther(value: boolean): BackgroundBuilder {
        this._accumulativeOther = value;
        return this;
    }

    get accumulativeOther() {
        return this._accumulativeOther;
    }

    setClassification(value: string): BackgroundBuilder {
        this._classification = value;
        return this;
    }

    get classification() {
        return this._classification;
    }

    setBusinessState(value: string): BackgroundBuilder {
        this._businessState = value;
        return this;
    }

    get businessState() {
        return this._businessState;
    }

    setCreator(value: string): BackgroundBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): BackgroundBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): BackgroundBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): BackgroundBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }
    setOccupationType (value: string): BackgroundBuilder {
        this._occupationType = value;
        return this;
    }
     get occupationType () {
        return this._occupationType ;
    }
    setBusinessType(value : string):BackgroundBuilder{
        this._businessType= value;
        return this;
    }
      get businessType() {
        return this._businessType;
    }

    build(): Background {
        return new Background(this);
    }
}
