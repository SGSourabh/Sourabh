import {Lead, LeadBuilder} from "./lead";
import {SelectionData, SuggestionData} from "../pages/lead/customer/recommendation/recommendation";
import {SalesGroupData} from "./product";

export class Current {
    private _lead: Lead;
    introduction: boolean;
    selections: SelectionData[];
    suggestionData: SuggestionData;
    salesGroupData: SalesGroupData;
    selectionData: SelectionData;
    applicationId: number;
    manualsuggestionData:any;
    allsuggestionData:any;
    applicationSuggestion:number;
    applicationSelection:number;
    user:any;
    constructor(public leadsFilter?: string) {
    }

    buildLead(value: Lead): Current {
        this._lead = new LeadBuilder().fromLead(value).build();
        return this;
    }

    get lead() {
        return this._lead;
    }
}
