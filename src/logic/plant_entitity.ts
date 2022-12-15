import { Generate } from "cerceis-lib";

export class PlantEntitity{
    private _id: string;
    
    constructor(){
        this._id = Generate.objectId();
    }
}