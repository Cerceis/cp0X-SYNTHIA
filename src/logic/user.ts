import { Generate } from "cerceis-lib";
import { PlantEntity } from "./components/plantEntity";
import { VisualComponent, VisualComponentContructorOptions } from "./visualComponent";
import { stringBoxer, stringAutoSpacer } from "../functions/stringFunctions";
import { hoursToReadable } from "../functions/timeFunctions";
import { strainCompare } from "../functions/gene";
import { quickText } from "./components/quickText";


export type UserRenderState = "bag" | "bagVerbose";
export interface UserConstructorOptions extends VisualComponentContructorOptions{
	name: string,
}
export interface UserBagItem{
    id: string
    count: number,
    entity: PlantEntity,
}
export class User extends VisualComponent{
	private _name: string;
	private _gold: number = 5000;
	get gold(): number { return this._gold; }
	set gold(v: number){this._gold = v};
    
    private _bag: UserBagItem[] = [];
    private _currentBagItemId: number = 1;
    private _usableBagItemId: string[] = [];

	constructor(options: UserConstructorOptions){
        super(options);
		this._name = options.name;
	}

    public setState(state: UserRenderState){
        if(state === "bag") this.text = this._bagTextFunction;
        //if(state === "menuVerbose") this.text = this._menuTextFunctionVerbose;
    };
    
    public addItemToBag(entity: PlantEntity, count: number){
        // Find for duplicate if available;
        for(let i = 0; i < this._bag.length; i++){
            if(
                this._bag[i].entity.name === entity.name &&
                this._bag[i].entity.matured === entity.matured &&
                strainCompare(this._bag[i].entity.genes, entity.genes)
            ){
                this._bag[i].count += count;
                return;   
            }
        }
        let itemId = "0001";
        if(this._usableBagItemId.length > 0 ){
            itemId = this._usableBagItemId[0];
            this._usableBagItemId.shift();
        }else{
            itemId = String(this._currentBagItemId).padStart(4, "0");
            this._currentBagItemId ++;
        }
        this._bag.push({
            id: itemId,
            count, entity,
        })
    }

    public getItemById(id: string){
        return this._bag.find(i => i.id === id);
    }

    private _bagTextFunction(){
        if(this._bag.length <= 0){
            return "Your bag is empty. Pathetic."
        }
        let list = `=== Seeds ===\n`;
        let matured: UserBagItem[] = [];
        for(let item of this._bag){
            if(item.entity.matured){
                matured.push(item);
                continue;
            }
            list += `${item.id}: ${item.entity.name}(${item.entity.symbol}) x${item.count}\n`;
            list += `: Growth temperature ${item.entity.tempLow}°C ~ ${item.entity.tempHigh}°C\n`;
            list += `: Cost ${item.entity.cost} G each. Sell value ${item.entity.value} G each. Profit ${item.entity.value - item.entity.cost} G each.\n`;
            list += `: Yield ${item.entity.yield} per harvest. Takes ${hoursToReadable(item.entity.growth)} to grow.\n`;
            list += `: Expected profit per harvest = ${ item.entity.yield * (item.entity.value - item.entity.cost)} G\n`
            list += `: Durability = ${item.entity.durability}pt. Immunity = ${item.entity.immunity}pt\n`;
            list += `: ${stringBoxer(item.entity.description)}\n`;
            list += `: STRAIN[ ${item.entity.genesColored} ]\n\n`;
        }
        list += "=== Sellable ===\n";
        if(matured.length > 0){
            for(let item of matured){
                list += `${item.id}: ${item.entity.name}(${item.entity.symbol}) x${item.count} sell price: ${item.entity.value} G each.\n`;
            }
        }else list += "Empty\n\n"
        
        return stringAutoSpacer(list, " ");
    }

    public removeItemByCount(id: string, count: number){
        for(let i = 0; i < this._bag.length; i++){
            if(this._bag[i].id === id){
                this._bag[i].count -= count;
                if(this._bag[i].count <= 0){
                    this._bag.splice(i,1);
                    return;
                }
            }
        }
    }

    public save(){
        return JSON.stringify(this);
    }

    private _loadBag(parsedData: any){
        const tmpBag: UserBagItem[] = []
        for(let i = 0; i < parsedData.length; i++){
            tmpBag.push({
                id: parsedData[i].id,
                count: parsedData[i].count,
                entity: PlantEntity.load(parsedData[i].entity),
            })
        }
        this._bag = tmpBag;
    }
    public load(stringData: string){
        const parsed: any = JSON.parse(stringData);
        // Load bag too
        Object.assign(this, parsed);
        this._bag = [];
        this._loadBag(parsed._bag)
    }

}	