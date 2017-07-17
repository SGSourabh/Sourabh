export interface ApiReadDocumentResponseData {
    id: number;
    documentType: string;
    documentSubType: string;
    context: string;
    origin: string;
    cmStoreStatus: number;
    batchId: string;
    instruction: string;
    cmDocrefnumber: string;
    entityIdNumber: number;
    entityIdType: string;
    documentUrl: string;
    filename: string;
    content: string;
    contentType: string;
    creator: string;
    created: string;
    owner: string;
    updator: string;
    updated: string;
}

export interface ApiCreateDocumentRequestData {
    documentType: string;
    documentSubType: string;
    context: string;
    origin: string;
    cmStoreStatus: number;
    batchId: string;
    instruction: string;
    cmDocrefnumber: string;
    entityIdNumber: number;
    entityIdType: string;
    documentUrl: string;
    filename: string;
    content: string;
    contentType: string;
}

export interface ApiCreateDocumentResponseData {
    id: number;
    documentType: string;
    documentSubType: string;
    context: string;
    origin: string;
    cmStoreStatus: number;
    batchId: string;
    instruction: string;
    cmDocrefnumber: string;
    entityIdNumber: number;
    entityIdType: string;
    documentUrl: string;
    filename: string;
    content: string;
    contentType: string;
    creator: string;
    created: string;
    owner: string;
    updator: string;
    updated: string;
}

export interface ApiUpdateDocumentRequestData {
    documentType: string;
    documentSubType: string;
    context: string;
    origin: string;
    cmStoreStatus: number;
    batchId: string;
    instruction: string;
    cmDocrefnumber: string;
    entityIdNumber: number;
    entityIdType: string;
    documentUrl: string;
    filename: string;
    content: string;
    contentType: string;
}

export interface ApiUpdateDocumentResponseData {
    id: number;
    documentType: string;
    documentSubType: string;
    context: string;
    origin: string;
    cmStoreStatus: number;
    batchId: string;
    instruction: string;
    cmDocrefnumber: string;
    entityIdNumber: number;
    entityIdType: string;
    documentUrl: string;
    filename: string;
    content: string;
    contentType: string;
    creator: string;
    created: string;
    owner: string;
    updator: string;
    updated: string;
}

export class Document {
    id: number;
    documentType: string;
    documentSubType: string;
    context: string;
    origin: string;
    cmStoreStatus: number;
    batchId: string;
    instruction: string;
    cmDocrefnumber: string;
    entityIdNumber: number;
    entityIdType: string;
    documentUrl: string;
    filename: string;
    content: string;
    contentType: string;
    creator: string;
    created: string;
    owner: string;
    updator: string;
    updated: string;

    constructor(builder: DocumentBuilder) {
        this.id = builder.id;
        this.documentType = builder.documentType;
        this.documentSubType = builder.documentSubType;
        this.context = builder.context;
        this.origin = builder.origin;
        this.cmStoreStatus = builder.cmStoreStatus;
        this.batchId = builder.batchId;
        this.instruction = builder.instruction;
        this.cmDocrefnumber = builder.cmDocrefnumber;
        this.entityIdNumber = builder.entityIdNumber;
        this.entityIdType = builder.entityIdType;
        this.documentUrl = builder.documentUrl;
        this.filename = builder.filename;
        this.content = builder.content;
        this.contentType = builder.contentType;
        this.creator = builder.creator;
        this.created = builder.created;
        this.owner = builder.owner;
        this.updator = builder.updator;
        this.updated = builder.updated;
    }

    toApiCreateDocumentRequestData(): ApiCreateDocumentRequestData {
        return {
            documentType: this.documentType,
            documentSubType: this.documentSubType,
            context: this.context,
            origin: this.origin,
            cmStoreStatus: this.cmStoreStatus,
            batchId: this.batchId,
            instruction: this.instruction,
            cmDocrefnumber: this.cmDocrefnumber,
            entityIdNumber: this.entityIdNumber,
            entityIdType: this.entityIdType,
            documentUrl: this.documentUrl,
            filename: this.filename,
            content: this.content,
            contentType: this.contentType,
        }
    }

    toApiUpdateDocumentRequestData(): ApiUpdateDocumentRequestData {
        return {
            documentType: this.documentType,
            documentSubType: this.documentSubType,
            context: this.context,
            origin: this.origin,
            cmStoreStatus: this.cmStoreStatus,
            batchId: this.batchId,
            instruction: this.instruction,
            cmDocrefnumber: this.cmDocrefnumber,
            entityIdNumber: this.entityIdNumber,
            entityIdType: this.entityIdType,
            documentUrl: this.documentUrl,
            filename: this.filename,
            content: this.content,
            contentType: this.contentType,
        }
    }
}

export class DocumentBuilder {
    private _id: number;
    private _documentType: string;
    private _documentSubType: string;
    private _context: string;
    private _origin: string;
    private _cmStoreStatus: number;
    private _batchId: string;
    private _instruction: string;
    private _cmDocrefnumber: string;
    private _entityIdNumber: number;
    private _entityIdType: string;
    private _documentUrl: string;
    private _filename: string;
    private _content: string;
    private _contentType: string;
    private _creator: string;
    private _created: string;
    private _owner: string;
    private _updator: string;
    private _updated: string;

    fromDocument(value: Document): DocumentBuilder {
        return this
            .setId(value.id)
            .setDocumentType(value.documentType)
            .setDocumentSubType(value.documentSubType)
            .setContext(value.context)
            .setOrigin(value.origin)
            .setCmStoreStatus(value.cmStoreStatus)
            .setBatchId(value.batchId)
            .setInstruction(value.instruction)
            .setCmDocrefnumber(value.cmDocrefnumber)
            .setEntityIdNumber(value.entityIdNumber)
            .setEntityIdType(value.entityIdType)
            .setDocumentUrl(value.documentUrl)
            .setFilename(value.filename)
            .setContent(value.content)
            .setContentType(value.contentType)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setOwner(value.owner)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }


    fromApiReadDocumentResponseData(value: ApiReadDocumentResponseData): DocumentBuilder {
        return this
            .setId(value.id)
            .setDocumentType(value.documentType)
            .setDocumentSubType(value.documentSubType)
            .setContext(value.context)
            .setOrigin(value.origin)
            .setCmStoreStatus(value.cmStoreStatus)
            .setBatchId(value.batchId)
            .setInstruction(value.instruction)
            .setCmDocrefnumber(value.cmDocrefnumber)
            .setEntityIdNumber(value.entityIdNumber)
            .setEntityIdType(value.entityIdType)
            .setDocumentUrl(value.documentUrl)
            .setFilename(value.filename)
            .setContent(value.content)
            .setContentType(value.contentType)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setOwner(value.owner)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiCreateDocumentResponseData(value: ApiCreateDocumentResponseData): DocumentBuilder {
        return this
            .setId(value.id)
            .setDocumentType(value.documentType)
            .setDocumentSubType(value.documentSubType)
            .setContext(value.context)
            .setOrigin(value.origin)
            .setCmStoreStatus(value.cmStoreStatus)
            .setBatchId(value.batchId)
            .setInstruction(value.instruction)
            .setCmDocrefnumber(value.cmDocrefnumber)
            .setEntityIdNumber(value.entityIdNumber)
            .setEntityIdType(value.entityIdType)
            .setDocumentUrl(value.documentUrl)
            .setFilename(value.filename)
            .setContent(value.content)
            .setContentType(value.contentType)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setOwner(value.owner)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }

    fromApiUpdateDocumentResponseData(value: ApiCreateDocumentResponseData): DocumentBuilder {
        return this
            .setId(value.id)
            .setDocumentType(value.documentType)
            .setDocumentSubType(value.documentSubType)
            .setContext(value.context)
            .setOrigin(value.origin)
            .setCmStoreStatus(value.cmStoreStatus)
            .setBatchId(value.batchId)
            .setInstruction(value.instruction)
            .setCmDocrefnumber(value.cmDocrefnumber)
            .setEntityIdNumber(value.entityIdNumber)
            .setEntityIdType(value.entityIdType)
            .setDocumentUrl(value.documentUrl)
            .setFilename(value.filename)
            .setContent(value.content)
            .setContentType(value.contentType)
            .setCreator(value.creator)
            .setCreated(value.created)
            .setOwner(value.owner)
            .setUpdator(value.updator)
            .setUpdated(value.updated)
    }


    setId(value: number): DocumentBuilder {
        this._id = value;
        return this;
    }

    get id() {
        return this._id;
    }


    setDocumentType(value: string): DocumentBuilder {
        this._documentType = value;
        return this;
    }

    get documentType() {
        return this._documentType;
    }


    setDocumentSubType(value: string): DocumentBuilder {
        this._documentSubType = value;
        return this;
    }

    get documentSubType() {
        return this._documentSubType;
    }


    setContext(value: string): DocumentBuilder {
        this._context = value;
        return this;
    }

    get context() {
        return this._context;
    }


    setOrigin(value: string): DocumentBuilder {
        this._origin = value;
        return this;
    }

    get origin() {
        return this._origin;
    }


    setCmStoreStatus(value: number): DocumentBuilder {
        this._cmStoreStatus = value;
        return this;
    }

    get cmStoreStatus() {
        return this._cmStoreStatus;
    }


    setBatchId(value: string): DocumentBuilder {
        this._batchId = value;
        return this;
    }

    get batchId() {
        return this._batchId;
    }


    setInstruction(value: string): DocumentBuilder {
        this._instruction = value;
        return this;
    }

    get instruction() {
        return this._instruction;
    }


    setCmDocrefnumber(value: string): DocumentBuilder {
        this._cmDocrefnumber = value;
        return this;
    }

    get cmDocrefnumber() {
        return this._cmDocrefnumber;
    }


    setEntityIdNumber(value: number): DocumentBuilder {
        this._entityIdNumber = value;
        return this;
    }

    get entityIdNumber() {
        return this._entityIdNumber;
    }


    setEntityIdType(value: string): DocumentBuilder {
        this._entityIdType = value;
        return this;
    }

    get entityIdType() {
        return this._entityIdType;
    }


    setDocumentUrl(value: string): DocumentBuilder {
        this._documentUrl = value;
        return this;
    }

    get documentUrl() {
        return this._documentUrl;
    }


    setFilename(value: string): DocumentBuilder {
        this._filename = value;
        return this;
    }

    get filename() {
        return this._filename;
    }


    setContent(value: string): DocumentBuilder {
        this._content = value;
        return this;
    }

    get content() {
        return this._content;
    }


    setContentType(value: string): DocumentBuilder {
        this._contentType = value;
        return this;
    }

    get contentType() {
        return this._contentType;
    }


    setCreator(value: string): DocumentBuilder {
        this._creator = value;
        return this;
    }

    get creator() {
        return this._creator;
    }


    setCreated(value: string): DocumentBuilder {
        this._created = value;
        return this;
    }

    get created() {
        return this._created;
    }


    setOwner(value: string): DocumentBuilder {
        this._owner = value;
        return this;
    }

    get owner() {
        return this._owner;
    }


    setUpdator(value: string): DocumentBuilder {
        this._updator = value;
        return this;
    }

    get updator() {
        return this._updator;
    }


    setUpdated(value: string): DocumentBuilder {
        this._updated = value;
        return this;
    }

    get updated() {
        return this._updated;
    }


    build(): Document {
        return new Document(this);
    }
}
