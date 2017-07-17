export interface ApiSearchCustomerRequestData {
    name: string;
    surname: string;
    phone: string;
    productType: string;
    nationalId?: string;
}

export interface ApiSearchCustomerResponseData {
    cif: string;
    name: string;
    surname: string;
    nationalId: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    email: string;
    phone: string;
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

export class Customer {
    cif: string;
    name: string;
    surname: string;
    nationalId: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    email: string;
    phone: string;
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

    get fullAddress() {
        let addressInfo = []
        for (let line of [this.addressLine1, this.addressLine2, this.addressLine3, this.addressLine4, this.city, this.state, this.zipCode]) {
            if (line && line.toString().trim().length) {
                addressInfo.push(line)
            }
        }
        return addressInfo.join(", ");
    }

    constructor(builder: CustomerBuilder) {
        this.cif = builder.cif;
        this.name = builder.name;
        this.surname = builder.surname;
        this.nationalId = builder.nationalId;
        this.dateOfBirth = builder.dateOfBirth;
        this.maritalStatus = builder.maritalStatus;
        this.gender = builder.gender;
        this.email = builder.email;
        this.phone = builder.phone;
        this.title = builder.title;
        this.homePhone = builder.homePhone;
        this.addressLine1 = builder.addressLine1;
        this.addressLine2 = builder.addressLine2;
        this.addressLine3 = builder.addressLine3;
        this.addressLine4 = builder.addressLine4;
        this.city = builder.city;
        this.state = builder.state;
        this.zipCode = builder.zipCode;
        this.branch = builder.branch;
    }

    get fullname(): string {
        return [this.surname, this.name].filter(x => x && x.toString().trim().length > 0).join(' ');
    }
}

export class CustomerBuilder {
    private _cif: string;
    private _name: string;
    private _surname: string;
    private _nationalId: string;
    private _dateOfBirth: string;
    private _maritalStatus: string;
    private _gender: string;
    private _email: string;
    private _phone: string;
    private _title: string;
    private _homePhone: string;
    private _addressLine1: string;
    private _addressLine2: string;
    private _addressLine3: string;
    private _addressLine4: string;
    private _city: string;
    private _state: string;
    private _zipCode: string;
    private _branch: string;

    fromApiSearchCustomerResponseData(value: ApiSearchCustomerResponseData): CustomerBuilder {
        return this
            .setCif(value.cif)
            .setName(value.name)
            .setSurname(value.surname)
            .setNationalId(value.nationalId)
            .setDateOfBirth(value.dateOfBirth)
            .setMaritalStatus(value.maritalStatus)
            .setGender(value.gender)
            .setEmail(value.email)
            .setPhone(value.phone)
            .setTitle(value.title)
            .setHomePhone(value.homePhone)
            .setAddressLine1(value.addressLine1)
            .setAddressLine2(value.addressLine2)
            .setAddressLine3(value.addressLine3)
            .setAddressLine4(value.addressLine4)
            .setCity(value.city)
            .setState(value.state)
            .setZipCode(value.zipCode)
            .setBranch(value.branch);
    }

    setCif(value: string): CustomerBuilder {
        this._cif = value;
        return this;
    }

    get cif() {
        return this._cif;
    }

    setName(value: string): CustomerBuilder {
        this._name = value;
        return this;
    }

    get name() {
        return this._name;
    }

    setSurname(value: string): CustomerBuilder {
        this._surname = value;
        return this;
    }

    get surname() {
        return this._surname;
    }

    setNationalId(value: string): CustomerBuilder {
        this._nationalId = value;
        return this;
    }

    get nationalId() {
        return this._nationalId;
    }

    setDateOfBirth(value: string): CustomerBuilder {
        this._dateOfBirth = value;
        return this;
    }

    get dateOfBirth() {
        return this._dateOfBirth;
    }

    setMaritalStatus(value: string): CustomerBuilder {
        this._maritalStatus = value;
        return this;
    }

    get maritalStatus() {
        return this._maritalStatus;
    }

    setGender(value: string): CustomerBuilder {
        this._gender = value;
        return this;
    }

    get gender() {
        return this._gender;
    }

    setEmail(value: string): CustomerBuilder {
        this._email = value;
        return this;
    }

    get email() {
        return this._email;
    }

    setPhone(value: string): CustomerBuilder {
        this._phone = value;
        return this;
    }

    get phone() {
        return this._phone;
    }

    setTitle(value: string): CustomerBuilder {
        this._title = value;
        return this;
    }

    get title() {
        return this._title;
    }

    setHomePhone(value: string): CustomerBuilder {
        this._homePhone = value;
        return this;
    }

    get homePhone() {
        return this._homePhone;
    }

    setAddressLine1(value: string): CustomerBuilder {
        this._addressLine1 = value;
        return this;
    }

    get addressLine1() {
        return this._addressLine1;
    }

    setAddressLine2(value: string): CustomerBuilder {
        this._addressLine2 = value;
        return this;
    }

    get addressLine2() {
        return this._addressLine2;
    }

    setAddressLine3(value: string): CustomerBuilder {
        this._addressLine3 = value;
        return this;
    }

    get addressLine3() {
        return this._addressLine3;
    }

    setAddressLine4(value: string): CustomerBuilder {
        this._addressLine4 = value;
        return this;
    }

    get addressLine4() {
        return this._addressLine4;
    }

    setCity(value: string): CustomerBuilder {
        this._city = value;
        return this;
    }

    get city() {
        return this._city;
    }

    setState(value: string): CustomerBuilder {
        this._state = value;
        return this;
    }

    get state() {
        return this._state;
    }

    setZipCode(value: string): CustomerBuilder {
        this._zipCode = value;
        return this;
    }

    get zipCode() {
        return this._zipCode;
    }

    setBranch(value: string): CustomerBuilder {
        this._branch = value;
        return this;
    }

    get branch() {
        return this._branch;
    }

    build(): Customer {
        return new Customer(this);
    }
}
