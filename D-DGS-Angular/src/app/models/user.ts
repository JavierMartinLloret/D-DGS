export class User {

    /*  VALORES PROVISIONALES. NO HAY InyDp con BD  */
    id: number | undefined;
    nickname: string | undefined;
    email: string | undefined;
    password: string | undefined;
    is_active: boolean | undefined;
    type_user: boolean | undefined;
    
    constructor(id?: number, nickname?: string, email?: string,
        password?: string, is_active?: boolean, type_user?: boolean){
        if(id)
            this.id = id;
        if (nickname)
            this.nickname = nickname;
        if (email)
            this.email = email;
        if(password)
            this.password = password;
        if(is_active)
            this.is_active = is_active;
        if(type_user)
            this.type_user = type_user;
    }
}
