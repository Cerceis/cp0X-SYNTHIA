import { Generate } from "cerceis-lib";

export class User{
	
	private _id: string;
	private _name: string;
	private _gold: number;

	constructor(){
		this._id = Generate.objectId();
	}
	
}	