export interface SuggestionBag {
    id?: number;
    lead?: number;
    productType?: string;
    productSalesGroup?: string;
    creator?: string;
    created?: string;
}

export class Suggestion implements SuggestionBag {
    id: number;
    lead: number;
    productType: string;
    productSalesGroup: string;
    creator: string;
    created: string;

    constructor(bag?: SuggestionBag) {
        if (bag) {
            bag.id ? this.id = bag.id : bag;
            bag.lead ? this.lead = bag.lead : bag;
            bag.productType ? this.productType = bag.productType : bag;
            bag.productSalesGroup ? this.productSalesGroup = bag.productSalesGroup : bag;
            bag.creator ? this.creator = bag.creator : bag;
            bag.created ? this.created = bag.created : bag;
        }
    }

    toCreate(): SuggestionBag {
        return {
            productType: this.productType,
            productSalesGroup: this.productSalesGroup
        }
    }
}