export interface LendingCopayerBag {
    id?: number;
    lendingId?: number;
    relationship?: string;
    name?: string;
    surname?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    education?: string;
    idType?: string;
    idNumber?: string;
    idDateOfIssue?: string;
    idPlaceOfIssue?: string;
    permanentAddressLine1?: string;
    permanentAddressLine2?: string;
    permanentAddressLine3?: string;
    permanentAddressLine4?: string;
    permanentCity?: string;
    permanentState?: string;
    permanentZipCode?: string;
    country?: string;
    ownership?: string;
    businessRegistrationNumber?: string;
    creator?: string;
    created?: string;
    updator?: string;
    updated?: string;
}

export class LendingCopayer {
    id: number;
    lendingId: number;
    relationship: string;
    name: string;
    surname: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    education: string;
    idType: string;
    idNumber: string;
    idDateOfIssue: string;
    idPlaceOfIssue: string;
    permanentAddressLine1: string;
    permanentAddressLine2: string;
    permanentAddressLine3: string;
    permanentAddressLine4: string;
    permanentCity: string;
    permanentState: string;
    permanentZipCode: string;
    country: string;
    ownership: string;
    businessRegistrationNumber: string;
    creator: string;
    created: string;
    updator: string;
    updated: string;

    constructor(bag?: LendingCopayerBag) {
        if (bag) {
            bag.id ? this.id = bag.id : bag;
            bag.lendingId ? this.lendingId = bag.lendingId : bag;
            bag.relationship ? this.relationship = bag.relationship : bag;
            bag.name ? this.name = bag.name : bag;
            bag.surname ? this.surname = bag.surname : bag;
            bag.dateOfBirth ? this.dateOfBirth = new Date(bag.dateOfBirth).toISOString() : bag;
            bag.gender ? this.gender = bag.gender : bag;
            bag.maritalStatus ? this.maritalStatus = bag.maritalStatus : bag;
            bag.education ? this.education = bag.education : bag;
            bag.idType ? this.idType = bag.idType : bag;
            bag.idNumber ? this.idNumber = bag.idNumber : bag;
            bag.idDateOfIssue ? this.idDateOfIssue = new Date(bag.idDateOfIssue).toISOString() : bag;
            bag.idPlaceOfIssue ? this.idPlaceOfIssue = bag.idPlaceOfIssue : bag;
            bag.permanentAddressLine1 ? this.permanentAddressLine1 = bag.permanentAddressLine1 : bag;
            bag.permanentAddressLine2 ? this.permanentAddressLine2 = bag.permanentAddressLine2 : bag;
            bag.permanentAddressLine3 ? this.permanentAddressLine3 = bag.permanentAddressLine3 : bag;
            bag.permanentAddressLine4 ? this.permanentAddressLine4 = bag.permanentAddressLine4 : bag;
            bag.permanentCity ? this.permanentCity = bag.permanentCity : bag;
            bag.permanentState ? this.permanentState = bag.permanentState : bag;
            bag.permanentZipCode ? this.permanentZipCode = bag.permanentZipCode : bag;
            bag.country ? this.country = bag.country : bag;
            bag.ownership ? this.ownership = bag.ownership : bag;
            bag.businessRegistrationNumber ? this.businessRegistrationNumber = bag.businessRegistrationNumber : bag;
            bag.creator ? this.creator = bag.creator : bag;
            bag.created ? this.created = bag.created : bag;
            bag.updator ? this.updator = bag.updator : bag;
            bag.updated ? this.updated = bag.updated : bag;
        }
    }
}

export class LendingCopayers {
    list: LendingCopayer[];

    constructor(list: LendingCopayer[]) {
        this.list = list;
    }

    lendingCopayerExists(lendingCopayerId: number) {
        return !!this.list.find(f => f.id === lendingCopayerId);
    }

    findLendingCopayerByIdNumber(idNumber: string): LendingCopayer {
        return this.list.find(f => f.idNumber === idNumber);
    }

    addLendingCopayer(value: LendingCopayer): Promise<LendingCopayer> {
        return new Promise((resolve, reject) => {
            if ((value.id && this.lendingCopayerExists(value.id)) || (value.idNumber && this.findLendingCopayerByIdNumber(value.idNumber))) {
                return reject(new Error('exists'));
            }
            let lendingCopayer: LendingCopayer = new LendingCopayer(value);
            this.list.push(lendingCopayer);
            resolve(lendingCopayer);
        });
    }

    removeLendingCopayer(value: LendingCopayer): Promise<LendingCopayer> {
        this.list = this.list.filter((v) => v.id != value.id);
        return Promise.resolve(value);
    }

    removeLendingCopayerByIdNumber(value: LendingCopayer): Promise<LendingCopayer> {
        this.list = this.list.filter((v) => v.idNumber != value.idNumber);
        return Promise.resolve(value);
    }

    updateCopayer(value: LendingCopayer): Promise<LendingCopayer> {
        return new Promise((resolve, reject) => {
            let index = this.list.findIndex(f => f.id === value.id);
            if (index === -1) {
                return reject(new Error('Does not exist'));
            }
            this.list[index] = new LendingCopayer(value);
            resolve(this.list[index]);
        });
    }

    updateCopayerByIdNumber(value: LendingCopayer): Promise<LendingCopayer> {
        return new Promise((resolve, reject) => {
            let index = this.list.findIndex(f => f.idNumber === value.idNumber);
            if (index === -1) {
                return reject(new Error('Does not exist'));
            }
            this.list[index] = new LendingCopayer(value);
            resolve(this.list[index]);
        });
    }
}

// export class LendingCopayersBuilder {
//     private _list: LendingCopayer[];
//
//     constructor() {
//         this._list = [];
//     }
//
//     fromLendingCopayers(value: LendingCopayers): LendingCopayersBuilder {
//         return this.setList(value.list);
//     }
//
//     setList(values: LendingCopayer[]): LendingCopayersBuilder {
//         this._list = [];
//         values.forEach(value => this._list.push(new LendingCopayer(value)));
//         return this;
//     }
//
//     get list() {
//         return this._list;
//     }
//
//     addLendingCopayer(value: LendingCopayer): LendingCopayersBuilder {
//         this._list.push(new LendingCopayer(value));
//         return this;
//     }
//
//     build(): LendingCopayers {
//         return new LendingCopayers(this);
//     }
// }
