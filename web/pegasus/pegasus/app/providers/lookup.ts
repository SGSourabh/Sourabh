import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {TranslateService} from "ng2-translate/ng2-translate";
import {Observable} from "rxjs/Observable";
import "rxjs/Rx";
import {LogProvider} from "./log";
import {AppProvider} from "./app";
import {UserProvider} from "./user";
@Injectable()
export class LookupProvider {
    private _productTypes: Observable<string[]>;
    private _statuses: Observable<string[]>;
    private _genders: Observable<string[]>;
    private _segments: Observable<string[]>;
    private _maritalStatuses: Observable<string[]>;
    private _sources: Observable<string[]>;
    private _educations: Observable<string[]>;
    private _backgroudEducations: Observable<string[]>;
    private _employments: Observable<string[]>;
    private _employmentType: Observable<string[]>;
    private _ownerships: Observable<string[]>;
    private _residentials: Observable<string[]>;
    private _insurances: Observable<string[]>;
    private _accumulativeAssets: Observable<string[]>;
    private _classifications: Observable<string[]>;
    private _businessStates: Observable<string[]>;
    private _businessType: Observable<string[]>;
    private _goals: Observable<string[]>;
    private _amlStatuses: Observable<string[]>;
    private _interests: Observable<string[]>;
    private _bankBranches: Observable<string[]>;
    private _productSalesGroups: Observable<string[]>;
    private _idTypes: Observable<string[]>;
    private _customerTypes: Observable<string[]>;
    private _relationships: Observable<string[]>;
    private _productSalesGroupsLendings: Observable<string[]>;
    private _loanPurposes: Observable<string[]>;
    private _documentTypes: Observable<string[]>;
    private _documentSubTypes: Observable<string[]>;
    private _occupations: Observable<string[]>;
    private _placesOfBirths: Observable<string[]>;
    private _listOfCity: Observable<string[]>;
    private _idTypesCurrent: Observable<string[]>;
    private _currentposition: Observable<string[]>;
    private _nationality: Observable<string[]>;

   

    constructor(private appProvider: AppProvider,
                private userProvider: UserProvider,
                private logProvider: LogProvider,
                private http: Http,
                private translateService: TranslateService) {
        logProvider.class(this);
    }

    private service(): Observable<Response> {
        return this.http.get('i18n/en.json')
            .catch(error => this.appProvider.observableThrow(error));
    }

    get productTypes(): Observable<string[]> {
        if (this._productTypes) {
            return this._productTypes;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'productTypes');
        return this._productTypes = this.service().map(response => {
            return (Object.keys(response.json().lookup.productType) || []);
        });
    }

    get statuses(): Observable<string[]> {
        if (this._statuses) {
            return this._statuses;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'statuses');
        return this._statuses = this.service().map(response => {
            return (Object.keys(response.json().lookup.status) || []);
        });
    }

    get genders(): Observable<string[]> {
        if (this._genders) {
            return this._genders;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'genders');
        return this._genders = this.service().map(response => {
            return (Object.keys(response.json().lookup.gender) || []);
        });
    }

    get sources(): Observable<string[]> {
        if (this._sources) {
            return this._sources;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'sources');
        return this._sources = this.service().map(response => {
            return (Object.keys(response.json().lookup.source) || []);
        });
    }

    get segments(): Observable<string[]> {
        if (this._segments) {
            return this._segments;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'segments');
        return this._segments = this.service().map(response => {
            return (Object.keys(response.json().lookup.segment) || []);
        });
    }

    get maritalStatuses(): Observable<string[]> {
        if (this._maritalStatuses) {
            return this._maritalStatuses;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'maritalStatuses');
        return this._maritalStatuses = this.service().map(response => {
            return (Object.keys(response.json().lookup.maritalStatus) || []);
        });
    }

    get educations(): Observable<string[]> {
        if (this._educations) {
            return this._educations;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'educations');
        return this._educations = this.service().map(response => {
            return (Object.keys(response.json().lookup.education) || []);
        });
    }

    get backgroudEducations(): Observable<string[]> {
        if (this._backgroudEducations) {
            return this._backgroudEducations;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'backgroudEducations');
        return this._backgroudEducations = this.service().map(response => {
            return (Object.keys(response.json().lookup.backgroudEducation) || []);
        });
    }


    get employments(): Observable<string[]> {
        if (this._employments) {
            return this._employments;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'employments');
        return this._employments = this.service().map(response => {
            return (Object.keys(response.json().lookup.employment) || []);
        });
    }

    get employmentType(): Observable<string[]> {
        if (this._employmentType) {
            return this._employmentType;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'employmentType');
        return this._employmentType = this.service().map(response => {
            return (Object.keys(response.json().lookup.employmentType) || []);
        });
    }

    get ownerships(): Observable<string[]> {
        if (this._ownerships) {
            return this._ownerships;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'ownerships');
        return this._ownerships = this.service().map(response => {
            return (Object.keys(response.json().lookup.ownership) || []);
        });
    }

    get residentials(): Observable<string[]> {
        if (this._residentials) {
            return this._residentials;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'residentials');
        return this._residentials = this.service().map(response => {
            return (Object.keys(response.json().lookup.residential) || []);
        });
    }

    get insurances(): Observable<string[]> {
        if (this._insurances) {
            return this._insurances;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'insurances');
        return this._insurances = this.service().map(response => {
            return (Object.keys(response.json().lookup.insurance) || []);
        });
    }

    get accumulativeAssets(): Observable<string[]> {
        if (this._accumulativeAssets) {
            return this._accumulativeAssets;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'accumulativeAssets');
        return this._accumulativeAssets = this.service().map(response => {
            return (Object.keys(response.json().lookup.accumulativeAssets) || []);
        });
    }

    get classifications(): Observable<string[]> {
        if (this._classifications) {
            return this._classifications;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'classifications');
        return this._classifications = this.service().map(response => {
            return (Object.keys(response.json().lookup.classification) || []);
        });
    }

    get businessStates(): Observable<string[]> {
        if (this._businessStates) {
            return this._businessStates;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'businessStates');
        return this._businessStates = this.service().map(response => {
            return (Object.keys(response.json().lookup.businessState) || []);
        });
    }

    get businessType(): Observable<string[]> {
        if (this._businessType) {
            return this._businessType;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'businessType');
        return this._businessType = this.service().map(response => {
            return (Object.keys(response.json().lookup.businessType) || []);
        });
    }

    get goals(): Observable<string[]> {
        if (this._goals) {
            return this._goals;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'goals');
        return this._goals = this.service().map(response => {
            return (Object.keys(response.json().lookup.goals) || []);
        });
    }

    get amlStatuses(): Observable<string[]> {
        if (this._amlStatuses) {
            return this._amlStatuses;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'amlStatuses');
        return this._amlStatuses = this.service().map(response => {
            return (Object.keys(response.json().lookup.amlStatus) || []);
        });
    }

    get interests(): Observable<string[]> {
        if (this._interests) {
            return this._interests;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'interests');
        return this._interests = this.service().map(response => {
            return (Object.keys(response.json().lookup.interest) || []);
        });
    }


    get bankBranches(): Observable<string[]> {
        if (this._bankBranches) {
            return this._bankBranches;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'bankBranches');
        return this._bankBranches = this.service().map(response => {
            return (Object.keys(response.json().lookup.bankBranches) || []);
        });
    }


    get productSalesGroups(): Observable<string[]> {
        if (this._productSalesGroups) {
            return this._productSalesGroups;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'productSalesGroups');
        return this._productSalesGroups = this.service().map(response => {
            return (Object.keys(response.json().lookup.productSalesGroup) || []);
        });
    }

    get idTypes(): Observable<string[]> {
        if (this._idTypes) {
            return this._idTypes;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'idTypes');
        return this._idTypes = this.service().map(response => {
            return (Object.keys(response.json().lookup.idType) || []);
        });
    }

    get customerTypes(): Observable<string[]> {
        if (this._customerTypes) {
            return this._customerTypes;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'customerTypes');
        return this._customerTypes = this.service().map(response => {
            return (Object.keys(response.json().lookup.customerType) || []);
        });
    }

    get relationships(): Observable<string[]> {
        if (this._relationships) {
            return this._relationships;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'relationships');
        return this._relationships = this.service().map(response => {
            return (Object.keys(response.json().lookup.relationship) || []);
        });
    }

    get productSalesGroupsLendings(): Observable<string[]> {
        if (this._productSalesGroupsLendings) {
            return this._productSalesGroupsLendings;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'productSalesGroupsLendings');
        return this._productSalesGroupsLendings = this.service().map(response => {
            return (Object.keys(response.json().lookup.productSalesGroupsLending) || []);
        });
    }

    get loanPurposes(): Observable<string[]> {
        if (this._loanPurposes) {
            return this._loanPurposes;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'loanPurposes');
        return this._loanPurposes = this.service().map(response => {
            return (Object.keys(response.json().lookup.loanPurpose) || []);
        });
    }

    get documentTypes(): Observable<string[]> {
        if (this._documentTypes) {
            return this._documentTypes;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'documentTypes');
        return this._documentTypes = this.service().map(response => {
            return (Object.keys(response.json().lookup.documentType) || []);
        });
    }

    get documentSubTypes(): Observable<string[]> {
        if (this._documentSubTypes) {
            return this._documentSubTypes;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'documentSubTypes');
        return this._documentSubTypes = this.service().map(response => {
            return (Object.keys(response.json().lookup.documentSubType) || []);
        });
    }

    get occupations(): Observable<string[]> {
        if (this._occupations) {
            return this._occupations;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'occupations');
        return this._occupations = this.service().map(response => {
            return (Object.keys(response.json().lookup.occupation) || []);
        });
    }

    get placesOfBirths(): Observable<string[]> {
        if (this._placesOfBirths) {
            return this._placesOfBirths;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'placesOfBirths');
        return this._placesOfBirths = this.service().map(response => {
            return (Object.keys(response.json().lookup.placesOfBirth) || []);
        });
    }

    get currentposition(): Observable<string[]> {
        if (this._currentposition) {
            return this._currentposition;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'currentposition');
        return this._currentposition = this.service().map(response => {
            return (Object.keys(response.json().lookup.currentposition) || []);
        });
    }

     get listOfCity(): Observable<string[]> {
        if (this._listOfCity) {
            return this._listOfCity;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'listOfCity');
        return this._listOfCity = this.service().map(response => {
            return (Object.keys(response.json().lookup.listOfCity) || []);
        });
    }

     get idTypesCurrent(): Observable<string[]> {
        if (this._idTypesCurrent) {
            return this._idTypesCurrent;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'idTypesCurrent');
        return this._idTypesCurrent = this.service().map(response => {
            return (Object.keys(response.json().lookup.idTypesCurrent) || []);
        });
    }

     get nationality(): Observable<string[]> {
        if (this._nationality) {
            return this._nationality;
        }
        this.logProvider.info('provider', 'lookup', 'get', 'nationality');
        return this._nationality = this.service().map(response => {
            return (Object.keys(response.json().lookup.nationality) || []);
        });
    }

    translations(key: string): Observable<string> {
        this.logProvider.info('provider', 'lookup', key);
        return this.service()
            .map(response => response.json())
            .map(obj => key.split('.').map(m => obj = obj[m]).reduce((a, b) => b))
            .flatMap(fm => Observable.from(Object.keys(fm)));
    }
}
