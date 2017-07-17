export interface ApiSearchAppointmentRequestData {
    lead?: number;
    from?: string;
    to?: string;
    creator?: string;
    limit?: number;
    fields?: string;
    sort?: string;
}

export interface ApiSearchAppointmentResponseData {
    id: number;
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiSearchAppointmentEnrichedResponseData {
    id: number;
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
    creator: string;
    created: string;
    updator: string;
    updated: string;
    name: string;
    surname: string;
}

export interface ApiReadAppointmentResponseData {
    id: number;
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiCreateAppointmentRequestData {
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
}

export interface ApiCreateAppointmentResponseData {
    id: number;
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateAppointmentRequestData {
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
}

export interface ApiUpdateAppointmentResponseData {
    id: number;
    lead: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
    creator: string;
    created: string;
    updator: string;
    updated: string;
}

export class Appointment {
    id: number;
    leadId: number;
    subject: string;
    start: string;
    end: string;
    location: string;
    exchangeId: string;
    exchangeKey:string
    creator: string;
    created: string;
    updator: string;
    updated: string;
    name: string;
    surname: string;

    constructor(builder: AppointmentBuilder) {
        this.id = builder.id;
        this.leadId = builder.leadId;
        this.subject = builder.subject;
        this.start = builder.start;
        this.end = builder.end;
        this.location = builder.location;
        this.exchangeId = builder.exchangeId;
        this.exchangeKey= builder.exchangeKey;
        this.creator = builder.creator;
        this.created = builder.created;
        this.updator = builder.updator;
        this.updated = builder.updated;
        this.name = builder.name;
        this.surname = builder.surname;
    }

    toApiCreateAppointmentRequestData(): ApiCreateAppointmentRequestData {
         if(this.start){
          var sub="Z";
         var start 
                if(this.start.indexOf(sub) !== -1){
                    var urgentpost = this.start.split("Z");
                 this.start =urgentpost[0]; 
                }
        }else{
            this.start=null;
        }
        if(this.end){
          var sub="Z";
         var start 
                if(this.end.indexOf(sub) !== -1){
                    var urgentpost = this.end.split("Z");
                 this.end =urgentpost[0]; 
                }
        }else{
            this.end=null;
        }
        return {
            lead: this.leadId ? parseInt(this.leadId.toString()) : null,
            subject: this.subject,
            start: this.start,
            end: this.end,
            location: this.location,
            exchangeId: this.exchangeId,
            exchangeKey:this.exchangeKey,
        }
    }

    toApiUpdateAppointmentRequestData(): ApiUpdateAppointmentRequestData {
       if(this.start){
          var sub="Z";
         var start 
                if(this.start.indexOf(sub) !== -1){
                    var urgentpost = this.start.split("Z");
                 this.start =urgentpost[0]; 
                }
        }else{
            this.start=null;
        }
        if(this.end){
          var sub="Z";
         var start 
                if(this.end.indexOf(sub) !== -1){
                    var urgentpost = this.end.split("Z");
                 this.end =urgentpost[0]; 
                }
        }else{
            this.end=null;
        }
        return {
            lead: this.leadId ? parseInt(this.leadId.toString()) : null,
            subject: this.subject,
            start: this.start,
            end: this.end ,
            location: this.location,
            exchangeId: this.exchangeId,
            exchangeKey:this.exchangeKey,
        }
    }
}

export class AppointmentBuilder {
    private _id: number;
    private _leadId: number;
    private _subject: string;
    private _start: string;
    private _end: string;
    private _location: string;
    private _exchangeId: string;
    private _exchangeKey: string;
    private _creator: string;
    private _created: string;
    private _updator: string;
    private _updated: string;
    private _name: string;
    private _surname: string;

    fromAppointment(value: Appointment): AppointmentBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.leadId)
            .setSubject(value.subject)
            .setStart(value.start)
            .setEnd(value.end)
            .setLocation(value.location)
            .setExchangeId(value.exchangeId)
            .setexchangeKey(value.exchangeKey)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated);
    }

    fromApiReadAppointmentResponseData(value: ApiReadAppointmentResponseData): AppointmentBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setSubject(value.subject)
            .setStart(value.start)
            .setEnd(value.end)
            .setLocation(value.location)
            .setExchangeId(value.exchangeId)
             .setexchangeKey(value.exchangeKey)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiCreateAppointmentResponseData(value: ApiCreateAppointmentResponseData): AppointmentBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setSubject(value.subject)
            .setStart(value.start)
            .setEnd(value.end)
            .setLocation(value.location)
            .setExchangeId(value.exchangeId)
            .setexchangeKey(value.exchangeKey)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiUpdateAppointmentResponseData(value: ApiCreateAppointmentResponseData): AppointmentBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setSubject(value.subject)
            .setStart(value.start)
            .setEnd(value.end)
            .setLocation(value.location)
            .setExchangeId(value.exchangeId)
            .setexchangeKey(value.exchangeKey)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiSearchAppointmentEnrichedResponseData(value: ApiSearchAppointmentEnrichedResponseData): AppointmentBuilder {
        return this
            .setId(value.id)
            .setLeadId(value.lead)
            .setSubject(value.subject)
            .setStart(value.start)
            .setEnd(value.end)
            .setLocation(value.location)
            .setExchangeId(value.exchangeId)
            .setexchangeKey(value.exchangeKey)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
            .setName(value.name)
            .setSurname(value.surname);
    }

    setId(value: number): AppointmentBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }

    setLeadId(value: number): AppointmentBuilder {
        this._leadId = value;
        return this;
    }

    get leadId() {
        return this._leadId;
    }

    setSubject(value: string): AppointmentBuilder {
        this._subject = value;
        return this;
    }

    get subject() {
        return this._subject;
    }

    setStart(value: string): AppointmentBuilder {
         // var sub="Z";
         // var start 
         //        if(value.indexOf(sub) !== -1){
         //            var urgentpost = value.split("Z");
         //         start =urgentpost[0]; 
         //        }
        this._start = value;
        return this;
    }

    get start() {
        return this._start;
    }

    setEnd(value: string): AppointmentBuilder {
        this._end = value;
        return this;
    }

    get end() {
        return this._end;
    }

    setLocation(value: string): AppointmentBuilder {
        this._location = value;
        return this;
    }

    get location() {
        return this._location;
    }

    setExchangeId(value: string): AppointmentBuilder {
        this._exchangeId = value;
        return this;
    }


   get exchangeId() {
        return this._exchangeId;
    }

    setexchangeKey(value: string): AppointmentBuilder {
        this._exchangeKey = value;
        return this;
    }
    get exchangeKey() {
        return this._exchangeKey;
    }

   

    setCreator(value: string): AppointmentBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }

    setCreated(value: string): AppointmentBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }

    setUpdator(value: string): AppointmentBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }

    setUpdated(value: string): AppointmentBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }

    setName(value: string): AppointmentBuilder {
        this._name = value;
        return this;
    }

    get name() {
        return this._name;
    }

    setSurname(value: string): AppointmentBuilder {
        this._surname = value;
        return this;
    }

    get surname() {
        return this._surname;
    }

    build(): Appointment {
        return new Appointment(this);
    }
}
