export class Activity_Property {
    _id: String | undefined;
    activityID: String;
    name: String;
    

    constructor(activtyID: String, name: String, _id?: String)
    {
        this.activityID = activtyID;
        this.name = name;
        this._id = _id;
    }
}
/*
export class Activity_Property_Numerical extends Activity_Property {
    value: Number;
    
    constructor(activtyID: String, name: String, value: Number, _id?: String) {
        super(activtyID, name, _id);
        this.value = value;
    }
}

export class Activity_Property_Stringy extends Activity_Property {
    value: String;

    constructor(activtyID: String, name: String, value: String, _id?: String) {
        super(activtyID, name, _id);
        this.value = value;
    }
}

export class Activity_Property_Date extends Activity_Property {
    value: Date;

    constructor(activtyID: String, name: String, value: Date, _id?: String) {
        super(activtyID, name, _id);
        this.value = value;
    }
} */