export class User {

    /*VALORES PROVISIONALES*/
    _id: string | undefined;
    nickname: string;
    email: string;
    password: string;
    domainIdentificator: string;
    is_admin: boolean;
    
    constructor(nickname: string, email: string, password: string, domainIdentificator: string,  is_admin: boolean, _id?: string){
        this.nickname = nickname;
        this.email = email;
        this.password = password;
        this.domainIdentificator = domainIdentificator;
        this.is_admin = is_admin;
        this._id = _id;
    }
}
