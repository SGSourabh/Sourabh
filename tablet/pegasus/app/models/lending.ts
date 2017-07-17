export interface LendingBag {
    id?: number;
    suggestion?: number;
    selection?: number;
    primary?: number;
    customerType?: string;
    productName?: string;
    loanPurpose?: string;
    education?: string;
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
    creator?: string;
    created?: string;
    updator?: string;
    updated?: string;
    note ?:string;
    productType?:string;
}

export class Lending {
    id: number;
    suggestion: number;
    selection: number;
    primary: number;
    customerType: string;
    productName: string;
    loanPurpose: string;
    education: string;
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
    creator: string;
    created: string;
    updator: string;
    updated: string;
    note:string;
    productType:string;

    constructor(bag?: LendingBag) {
        if (bag) {
            bag.id ? this.id = bag.id : bag;
            bag.suggestion ? this.suggestion = bag.suggestion : bag;
            bag.selection ? this.selection = bag.selection : bag;
            bag.primary ? this.primary = bag.primary : bag;
            bag.customerType ? this.customerType = bag.customerType : bag;
            bag.productName ? this.productName = bag.productName : bag;
            bag.loanPurpose ? this.loanPurpose = bag.loanPurpose : bag;
            bag.education ? this.education = bag.education : bag;
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
            bag.creator ? this.creator = bag.creator : bag;
            bag.created ? this.created = bag.created : bag;
            bag.updator ? this.updator = bag.updator : bag;
            bag.updated ? this.updated = bag.updated : bag;
            bag.note ? this.note = bag.note:bag;
            bag.productType ? this.productType = bag.productType:bag;
        }
    }
}
