export interface UserProfileBag {
    login?: string;
    title?: string;
    name?: string;
    email?: string;
    phone?: string;
    branch?: string;
    introduction?: string;
}

export class UserProfile implements UserProfileBag {
    login: string;
    title: string;
    name: string;
    email: string;
    phone: string;
    branch: string;
    introduction: string;

    constructor(bag?: UserProfileBag) {
        if (bag) {
            bag.login ? this.login = bag.login : bag;
            bag.title ? this.title = bag.title : bag;
            bag.name ? this.name = bag.name : bag;
            bag.email ? this.email = bag.email : bag;
            bag.phone ? this.phone = bag.phone : bag;
            bag.branch ? this.branch = bag.branch : bag;
            bag.introduction ? this.introduction = bag.introduction : bag;
        }
    }
}

export class User {
    token: string;
    handle: string;
    name: string;

    constructor(builder: UserBuilder) {
        this.name = builder.name;
        this.token = builder.token;
        this.handle = builder.handle;
        this.name = builder.name;
    }
}

export class UserBuilder {
    private _token: string;
    private _handle: string;
    private _name: string;

    setToken(value: string): UserBuilder {
        this._token = value;
        return this;
    }

    get token() {
        return this._token;
    }

    setHandle(value: string): UserBuilder {
        this._handle = value;
        return this;
    }

    get handle() {
        return this._handle;
    }

    setName(value: string): UserBuilder {
        this._name = value;
        return this;
    }

    get name() {
        return this._name;
    }

    build(): User {
        return new User(this);
    }
}
