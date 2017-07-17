export interface ContentBag {
    path?: string;
    version?: number;
}

export class Content implements ContentBag {
    path: string;
    version: number;

    constructor(bag?: ContentBag) {
        if (bag) {
            bag.path ? this.path = bag.path : bag;
            bag.version ? this.version = bag.version : bag;
        }
    }
}