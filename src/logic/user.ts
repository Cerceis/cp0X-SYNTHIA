import { Generate } from "cerceis-lib";

export interface UserConstructorOptions{
	name: string,
}
export class User{
	
	private _id: string;
	private _name: string;
	private _gold: number = 5000;
	get gold(): number { return this._gold; }
	set gold(v: number){this._gold = v};

	constructor(options: UserConstructorOptions){
		this._id = Generate.objectId();
		this._name = options.name;
	}
	
}	

export const user = new User({
	name: "Kira"
});
