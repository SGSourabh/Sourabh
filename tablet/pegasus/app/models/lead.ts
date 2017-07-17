import {Customer} from "./customer";

export interface ApiSearchLeadRequestData {
    owner?: string;
    productType?: string;
    status?: string;
    nationalId?: string;
    from?: string;
    to?: string;
    
}

export interface ApiSearchLeadResponseData {
    id: number;
    cif: string;
    dateOfBirth: string;
    email: string;
    favourite: boolean;
    gender: string;
    name: string;
    phone: string;
    productType: string;
    maritalStatus: string;
    surname: string;
    title: string;
    nationalId: string;
    status: string;
    closeReason: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
    owner: string;
    source: string;
    campaign: string;
    homePhone: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiReadLeadResponseData {
    id: number;
    cif: string;
    dateOfBirth: string;
    email: string;
    favourite: boolean;
    gender: string;
    name: string;
    phone: string;
    productType: string;
    maritalStatus: string;
    surname: string;
    title: string;
    nationalId: string;
    status: string;
    closeReason: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
    owner: string;
    source: string;
    campaign: string;
    homePhone: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiCreateLeadRequestData {
    name: string;
    surname: string;
    phone: string;
    productType: string;
    nationalId?: string;
    source: string;
    cif: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    email: string;
    title: string;
    homePhone: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
}

export interface ApiCreateLeadResponseData {
    id: number;
    cif: string;
    dateOfBirth: string;
    email: string;
    favourite: boolean;
    gender: string;
    name: string;
    phone: string;
    productType: string;
    maritalStatus: string;
    surname: string;
    title: string;
    nationalId: string;
    status: string;
    closeReason: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
    owner: string;
    source: string;
    campaign: string;
    homePhone: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateLeadRequestData {
    cif: string;
    dateOfBirth?: string;
    email: string;
    favourite: boolean;
    gender: string;
    name: string;
    phone: string;
    productType: string;
    maritalStatus: string;
    surname: string;
    title: string;
    nationalId: string;
    status: string;
    closeReason: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
    owner: string;
    source: string;
    campaign: string;
    homePhone: string;
}

export interface ApiUpdateLeadResponseData {
    id: number;
    cif: string;
    dateOfBirth: string;
    email: string;
    favourite: boolean;
    gender: string;
    name: string;
    phone: string;
    productType: string;
    maritalStatus: string;
    surname: string;
    title: string;
    nationalId: string;
    status: string;
    closeReason: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
    owner: string;
    source: string;
    campaign: string;
    homePhone: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface LeadSearch {
    owner?: string;
    productType?: string;
    status?: string;
    nationalId?: string;
    from?: string;
    to?: string;
    favourite?: boolean;
    urgent?: boolean;
    limit?: number;
    fields?: string;
    sort?: string;
    newlead?:boolean;
    followUp?:boolean;
}

export class Lead {
    id: number;
    cif: string;
    dateOfBirth: string;
    email: string;
    favourite: boolean;
    gender: string;
    name: string;
    phone: string;
    productType: string;
    maritalStatus: string;
    surname: string;
    title: string;
    nationalId: string;
    status: string;
    closeReason: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    city: string;
    state: string;
    zipCode: string;
    branch: string;
    owner: string;
    source: string;
    campaign: string;
    homePhone: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;

    constructor(builder: LeadBuilder) {
        this.id = builder.id;
        this.cif = builder.cif;
        this.dateOfBirth = builder.dateOfBirth;
        this.email = builder.email;
        this.favourite = builder.favourite;
        this.gender = builder.gender;
        this.name = builder.name;
        this.phone = builder.phone;
        this.productType = builder.productType;
        this.maritalStatus = builder.maritalStatus;
        this.surname = builder.surname;
        this.title = builder.title;
        this.nationalId = builder.nationalId;
        this.status = builder.status;
        this.closeReason = builder.closeReason;
        this.addressLine1 = builder.addressLine1;
        this.addressLine2 = builder.addressLine2;
        this.addressLine3 = builder.addressLine3;
        this.addressLine4 = builder.addressLine4;
        this.city = builder.city;
        this.state = builder.state;
        this.zipCode = builder.zipCode;
        this.branch = builder.branch;
        this.owner = builder.owner;
        this.source = builder.source;
        this.campaign = builder.campaign;
        this.homePhone = builder.homePhone;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
    }

    get fullname(): string {
        return [this.surname, this.name].filter(x => x && x.toString().trim().length > 0).join(' ');
    }

    mergeCustomer(customer: Customer): Lead {
        this.cif = customer.cif;
        if (customer.name) {
            this.name = customer.name;
        }
        if (customer.surname) {
            this.surname = customer.surname;
        }
        this.nationalId = customer.nationalId;
        this.dateOfBirth = customer.dateOfBirth;
        this.maritalStatus = customer.maritalStatus;
        this.gender = customer.gender;
        this.email = customer.email;
        if (customer.phone) {
            this.phone = customer.phone;
        }
        this.title = customer.title;
        this.homePhone = customer.homePhone;
        this.addressLine1 = customer.addressLine1;
        this.addressLine2 = customer.addressLine2;
        this.addressLine3 = customer.addressLine3;
        this.addressLine4 = customer.addressLine4;
        this.city = customer.city;
        this.state = customer.state;
        this.zipCode = customer.zipCode;
        this.branch = customer.branch;
        return this;
    }

    toApiUpdateLeadRequestData(): ApiUpdateLeadRequestData {
        let data: ApiUpdateLeadRequestData = {
            cif: this.cif,
            dateOfBirth: this.dateOfBirth ? new Date(this.dateOfBirth).toISOString() : null,
            email: this.email,
            favourite: this.favourite,
            gender: this.gender,
            name: this.name,
            phone: this.phone,
            productType: this.productType,
            maritalStatus: this.maritalStatus,
            surname: this.surname,
            title: this.title,
            nationalId: this.nationalId,
            status: this.status,
            closeReason: this.closeReason,
            addressLine1: this.addressLine1,
            addressLine2: this.addressLine2,
            addressLine3: this.addressLine3,
            addressLine4: this.addressLine4,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            branch: this.branch,
            owner: this.owner,
            source: this.source,
            campaign: this.campaign,
            homePhone: this.homePhone
        };
        if (!data.dateOfBirth) {
            delete data.dateOfBirth;
        }
        return data;
    }

    toApiCreateLeadRequestData(): ApiCreateLeadRequestData {
        let apiCreateLeadRequestData: ApiCreateLeadRequestData = {
            name: this.name,
            surname: this.surname,
            phone: this.phone,
            productType: this.productType,
            source: this.source,
            cif: this.cif,
            dateOfBirth: this.dateOfBirth,
            maritalStatus: this.maritalStatus,
            gender: this.gender,
            email: this.email,
            title: this.title,
            homePhone: this.homePhone,
            addressLine1: this.addressLine1,
            addressLine2: this.addressLine2,
            addressLine3: this.addressLine3,
            addressLine4: this.addressLine4,
            city: this.city,
            state: this.state,
            zipCode: this.zipCode,
            branch: this.branch
        };
        if (this.nationalId) {
            apiCreateLeadRequestData.nationalId = this.nationalId;
        }
        return apiCreateLeadRequestData;
    }
}

export class LeadBuilder {
    private _id: number;
    private _cif: string;
    private _dateOfBirth: string;
    private _email: string;
    private _favourite: boolean;
    private _gender: string;
    private _name: string;
    private _phone: string;
    private _productType: string;
    private _maritalStatus: string;
    private _surname: string;
    private _title: string;
    private _nationalId: string;
    private _status: string;
    private _closeReason: string;
    private _addressLine1: string;
    private _addressLine2: string;
    private _addressLine3: string;
    private _addressLine4: string;
    private _city: string;
    private _state: string;
    private _zipCode: string;
    private _branch: string;
    private _owner: string;
    private _source: string;
    private _campaign: string;
    private _homePhone: string;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;

    fromLead(value: Lead): LeadBuilder {
        return this
            .setId(value.id)
            .setCif(value.cif)
            .setDateOfBirth(value.dateOfBirth)
            .setEmail(value.email)
            .setFavourite(value.favourite)
            .setGender(value.gender)
            .setName(value.name)
            .setPhone(value.phone)
            .setProductType(value.productType)
            .setMaritalStatus(value.maritalStatus)
            .setSurname(value.surname)
            .setTitle(value.title)
            .setNationalId(value.nationalId)
            .setStatus(value.status)
            .setCloseReason(value.closeReason)
            .setAddressLine1(value.addressLine1)
            .setAddressLine2(value.addressLine2)
            .setAddressLine3(value.addressLine3)
            .setAddressLine4(value.addressLine4)
            .setCity(value.city)
            .setState(value.state)
            .setZipCode(value.zipCode)
            .setBranch(value.branch)
            .setOwner(value.owner)
            .setSource(value.source)
            .setCampaign(value.campaign)
            .setHomePhone(value.homePhone)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiSearchLeadResponseData(value: ApiSearchLeadResponseData): LeadBuilder {
        return this
            .setId(value.id)
            .setCif(value.cif)
            .setDateOfBirth(value.dateOfBirth)
            .setEmail(value.email)
            .setFavourite(value.favourite)
            .setGender(value.gender)
            .setName(value.name)
            .setPhone(value.phone)
            .setProductType(value.productType)
            .setMaritalStatus(value.maritalStatus)
            .setSurname(value.surname)
            .setTitle(value.title)
            .setNationalId(value.nationalId)
            .setStatus(value.status)
            .setCloseReason(value.closeReason)
            .setAddressLine1(value.addressLine1)
            .setAddressLine2(value.addressLine2)
            .setAddressLine3(value.addressLine3)
            .setAddressLine4(value.addressLine4)
            .setCity(value.city)
            .setState(value.state)
            .setZipCode(value.zipCode)
            .setBranch(value.branch)
            .setOwner(value.owner)
            .setSource(value.source)
            .setCampaign(value.campaign)
            .setHomePhone(value.homePhone)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);

    }

    fromApiCreateLeadResponseData(value: ApiCreateLeadResponseData): LeadBuilder {
        return this
            .setId(value.id)
            .setCif(value.cif)
            .setDateOfBirth(value.dateOfBirth)
            .setEmail(value.email)
            .setFavourite(value.favourite)
            .setGender(value.gender)
            .setName(value.name)
            .setPhone(value.phone)
            .setProductType(value.productType)
            .setMaritalStatus(value.maritalStatus)
            .setSurname(value.surname)
            .setTitle(value.title)
            .setNationalId(value.nationalId)
            .setStatus(value.status)
            .setAddressLine1(value.addressLine1)
            .setAddressLine2(value.addressLine2)
            .setAddressLine3(value.addressLine3)
            .setAddressLine4(value.addressLine4)
            .setCity(value.city)
            .setState(value.state)
            .setZipCode(value.zipCode)
            .setBranch(value.branch)
            .setOwner(value.owner)
            .setSource(value.source)
            .setCampaign(value.campaign)
            .setHomePhone(value.homePhone)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiUpdateLeadResponseData(value: ApiUpdateLeadResponseData): LeadBuilder {
        return this
            .setId(value.id)
            .setCif(value.cif)
            .setDateOfBirth(value.dateOfBirth)
            .setEmail(value.email)
            .setFavourite(value.favourite)
            .setGender(value.gender)
            .setName(value.name)
            .setPhone(value.phone)
            .setProductType(value.productType)
            .setMaritalStatus(value.maritalStatus)
            .setSurname(value.surname)
            .setTitle(value.title)
            .setNationalId(value.nationalId)
            .setStatus(value.status)
            .setCloseReason(value.closeReason)
            .setAddressLine1(value.addressLine1)
            .setAddressLine2(value.addressLine2)
            .setAddressLine3(value.addressLine3)
            .setAddressLine4(value.addressLine4)
            .setCity(value.city)
            .setState(value.state)
            .setZipCode(value.zipCode)
            .setBranch(value.branch)
            .setOwner(value.owner)
            .setSource(value.source)
            .setCampaign(value.campaign)
            .setHomePhone(value.homePhone)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiReadLeadResponseData(value: ApiReadLeadResponseData): LeadBuilder {
        return this
            .setId(value.id)
            .setCif(value.cif)
            .setDateOfBirth(value.dateOfBirth)
            .setEmail(value.email)
            .setFavourite(value.favourite)
            .setGender(value.gender)
            .setName(value.name)
            .setPhone(value.phone)
            .setProductType(value.productType)
            .setMaritalStatus(value.maritalStatus)
            .setSurname(value.surname)
            .setTitle(value.title)
            .setNationalId(value.nationalId)
            .setStatus(value.status)
            .setCloseReason(value.closeReason)
            .setAddressLine1(value.addressLine1)
            .setAddressLine2(value.addressLine2)
            .setAddressLine3(value.addressLine3)
            .setAddressLine4(value.addressLine4)
            .setCity(value.city)
            .setState(value.state)
            .setZipCode(value.zipCode)
            .setBranch(value.branch)
            .setOwner(value.owner)
            .setSource(value.source)
            .setCampaign(value.campaign)
            .setHomePhone(value.homePhone)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    setId(value: number): LeadBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setCif(value: string): LeadBuilder {
        this._cif = value;
        return this;
    }

    get cif() {
        return this._cif;
    }

    setDateOfBirth(value: string): LeadBuilder {
        this._dateOfBirth = value;
        return this;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    setEmail(value: string): LeadBuilder {
        this._email = value;
        return this;
    }

    get email() {
        return this._email;
    }

    setFavourite(value: boolean): LeadBuilder {
        this._favourite = value;
        return this;
    }

    get favourite() {
        return this._favourite;
    }

    setGender(value: string): LeadBuilder {
        this._gender = value;
        return this;
    }

    get gender() {
        return this._gender;
    }

    setName(value: string): LeadBuilder {
        this._name = value;
        return this;
    }

    get name() {
        return this._name;
    }

    setPhone(value: string): LeadBuilder {
        this._phone = value;
        return this;
    }

    get phone() {
        return this._phone;
    }

    setProductType(value: string): LeadBuilder {
        this._productType = value;
        return this;
    }

    get productType() {
        return this._productType;
    }

    setMaritalStatus(value: string): LeadBuilder {
        this._maritalStatus = value;
        return this;
    }

    get maritalStatus() {
        return this._maritalStatus;
    }

    setSurname(value: string): LeadBuilder {
        this._surname = value;
        return this;
    }

    get surname() {
        return this._surname;
    }

    setTitle(value: string): LeadBuilder {
        this._title = value;
        return this;
    }

    get title() {
        return this._title;
    }

    setNationalId(value: string): LeadBuilder {
        this._nationalId = value;
        return this;
    }

    get nationalId() {
        return this._nationalId;
    }

    setStatus(value: string): LeadBuilder {
        this._status = value;
        return this;
    }

    get status() {
        return this._status;
    }

    setCloseReason(value: string): LeadBuilder {
        this._closeReason = value;
        return this;
    }

    get closeReason() {
        return this._status;
    }

    setAddressLine1(value: string): LeadBuilder {
        this._addressLine1 = value;
        return this;
    }

    get addressLine1() {
        return this._addressLine1;
    }

    setAddressLine2(value: string): LeadBuilder {
        this._addressLine2 = value;
        return this;
    }

    get addressLine2() {
        return this._addressLine2;
    }

    setAddressLine3(value: string): LeadBuilder {
        this._addressLine3 = value;
        return this;
    }

    get addressLine3() {
        return this._addressLine3;
    }

    setAddressLine4(value: string): LeadBuilder {
        this._addressLine4 = value;
        return this;
    }

    get addressLine4() {
        return this._addressLine4;
    }

    setCity(value: string): LeadBuilder {
        this._city = value;
        return this;
    }

    get city() {
        return this._city;
    }

    setState(value: string): LeadBuilder {
        this._state = value;
        return this;
    }

    get state() {
        return this._state;
    }

    setZipCode(value: string): LeadBuilder {
        this._zipCode = value;
        return this;
    }

    get zipCode() {
        return this._zipCode;
    }

    setBranch(value: string): LeadBuilder {
        this._branch = value;
        return this;
    }

    get branch() {
        return this._branch;
    }

    setOwner(value: string): LeadBuilder {
        this._owner = value;
        return this;
    }

    get owner() {
        return this._owner;
    }

    setSource(value: string): LeadBuilder {
        this._source = value;
        return this;
    }

    get source() {
        return this._source;
    }

    setCampaign(value: string): LeadBuilder {
        this._campaign = value;
        return this;
    }

    get campaign() {
        return this._campaign;
    }

    setHomePhone(value: string): LeadBuilder {
        this._homePhone = value;
        return this;
    }

    get homePhone() {
        return this._homePhone;
    }

    setCreator(value: string): LeadBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): LeadBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): LeadBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): LeadBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }

    build(): Lead {
        return new Lead(this);
    }
}
