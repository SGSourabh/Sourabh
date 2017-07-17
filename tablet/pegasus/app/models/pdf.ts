export interface LineItem {
    label: string;
    value?: string | number;
}

export interface Row {
    header?: boolean;
    cells?: string[];
}

export interface Section {
    title?: string;
    header?: string;
    subHeader?: string;
    items?: LineItem[];
    grid?: Row[];
}

export interface Document {
    headerTitle?: string;
    headerSubTitle?: string;
    subHeaderItems?: LineItem[];
    sections?: Section[];
}
