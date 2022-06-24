export class Linker {
    _id: string | undefined;
    name: string;
    category: string;

    constructor(name: string, category: string, _id?: string)
    {
        this.name = name;
        this.category = category;
        this._id = _id;
    }
}