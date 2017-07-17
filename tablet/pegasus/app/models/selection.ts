export interface SelectionBag {
    id?: number;
    suggestion?: number;
    productType?: string;
    productSalesGroup?: string;
    recipient?: string;
    status?: string;
    created?: string;
    creator?: string;
    updated?: string;
    updator?: string;
}

export class Selection implements SelectionBag {
    id: number;
    suggestion: number;
    productType: string;
    productSalesGroup: string;
    recipient: string;
    status: string;
    created: string;
    creator: string;
    updated: string;
    updator: string;

    constructor(bag?: SelectionBag) {
        if (bag) {
            bag.id ? this.id = bag.id : bag;
            bag.suggestion ? this.suggestion = bag.suggestion : bag;
            bag.productType ? this.productType = bag.productType : bag;
            bag.productSalesGroup ? this.productSalesGroup = bag.productSalesGroup : bag;
            bag.recipient ? this.recipient = bag.recipient : bag;
            bag.status ? this.status = bag.status : bag;
            bag.created ? this.created = bag.created : bag;
            bag.creator ? this.creator = bag.creator : bag;
            bag.updated ? this.updated = bag.updated : bag;
            bag.updator ? this.updator = bag.updator : bag;
        }
    }

    toCreate(): SelectionBag {
        let request: SelectionBag = {productType: this.productType};
        if (this.productSalesGroup) {
            request.productSalesGroup = this.productSalesGroup;
        }
        return request;
    }

    toUpdate(): SelectionBag {
        return {
            recipient: this.recipient,
            status: this.status
        };
    }
}