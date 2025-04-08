import JSObject from "./Object";

export default class DBConnection {

    constructor() {
        //TODO: connect to DB
        console.log("DBConnection");
    }

    saveObject(object: JSObject) {
        //TODO: save object to DB
        console.log("DBConnection.save", object);
    }

    getObject(id: number): JSObject | null {
        //TODO: get object from DB
        console.log("DBConnection.get", id);
        return null;
    }

    deleteObject(id: number) {
        //TODO: delete object from DB
        console.log("DBConnection.delete", id);
    }
}