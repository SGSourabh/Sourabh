export interface ApiRegisterIn {
    username: string;
    password: string;
    osversion: string;
    ostype: string;
    udid: string;
    clientId: string;
}

export interface ApiRegisterOut {
    token: string;
}

export class Register {
    handle: string;

    constructor(builder: RegisterBuilder) {
        this.handle = 'UIDPASSWORD cred="' + btoa('PegasusMobileApp:' + builder.token) + '"';
    }
}

export class RegisterBuilder {
    private _token: string;

    fromApiRegisterOut(value: ApiRegisterOut): RegisterBuilder {
        return this
            .setToken(value.token);
    }

    setToken(value: string): RegisterBuilder {
        this._token = value;
        return this;
    }

    get token() {
        return this._token;
    }

    build(): Register {
        return new Register(this);
    }
}

export class Registered {
    handle: string;

    constructor(value: string) {
        this.handle = value;
    }
}

export interface ApiAuthenticateIn {
    username: string;
    password: string;
}

export interface ApiAuthenticateOut {
    principal: string;
    token: string;
}

export class Authenticate {
    token: string;
    principal: string;

    constructor(builder: AuthenticateBuilder) {
        this.token = builder.token;
        this.principal = builder.principal;
    }
}

export class AuthenticateBuilder {
    private _principal: string;
    private _token: string;

    fromApiAuthenticateOut(value: ApiAuthenticateOut): AuthenticateBuilder {
        return this
            .setPrincipal(value.principal)
            .setToken(value.token);
    }

    setPrincipal(value: string): AuthenticateBuilder {
        this._principal = value;
        return this;
    }

    get principal() {
        return this._principal;
    }

    setToken(value: string): AuthenticateBuilder {
        this._token = value;
        return this;
    }

    get token() {
        return this._token;
    }

    build(): Authenticate {
        return new Authenticate(this);
    }
}
