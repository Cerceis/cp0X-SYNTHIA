import { VisualComponent, VisualComponentContructorOptions } from "../visualComponent";
import { plantData } from "../../data/plantData";
import { stringAutoSpacer, stringBoxer } from "../../functions/stringFunctions";
import { hoursToReadable } from "../../functions/timeFunctions";
import { PlantEntity } from "./plantEntity";
import { Generate, FromArray } from "cerceis-lib";
import { comTime } from "../components";

export type ShopRenderState = "menu" | "menuVerbose";
export type ShopInventoryItem = {
    id: string,
    entity: PlantEntity,
    count: number,
}
export class Shop extends VisualComponent{

    // Shop inventory refresh every 15 game day (1 Hour).
    private _inventory: ShopInventoryItem[] = [];
    private _lastInventoryUpdate: string = "";
    // Player could upgrade this. This is not hard limit.
    public itemPerBatch: number = 20; 

    constructor(options: VisualComponentContructorOptions){
        super(options);
        this.setState("menu");
        this.generateInventory();
    }
    
    public generateInventory(){
        let itemsLeft: number = this.itemPerBatch;
        this._inventory = [];
        let inventoryId = 0;
        while(itemsLeft > 0){
            inventoryId ++;
            const count = Generate.int(1, 11);
            const item = new PlantEntity(FromArray.getRandom(plantData)[0]);
            this._inventory.push({
                id: String(inventoryId).padStart(4,"0"),
                entity: item,
                count,
            })
            itemsLeft -= count;
        }
        this._lastInventoryUpdate = comTime.time;
    }

    public setState(state: ShopRenderState){
        if(state === "menu") this.text = this._menuTextFunction;
        if(state === "menuVerbose") this.text = this._menuTextFunctionVerbose;
    };

    private _greetings(): string{
        let greetings = "Welcome to SYNTHIA's shop! Here is a list of available items\n";
        greetings += "Shop inventory refreshes every 15 days(1 Hour), so remember to check out regularly!\n";
        greetings += `Last update: ${this._lastInventoryUpdate}\n\n`;
        return greetings;
    }

    // Print list of items.
    private _menuTextFunction(){
        const greetings = this._greetings();
        let list = "ID: Info\n\n";
        
        for(let item of this._inventory){            
            list += `${item.id}: ${item.entity.name}(${item.entity.symbol}) x${item.count}\n`;
            list += `: Growth temperature ${item.entity.tempLow}°C ~ ${item.entity.tempHigh}°C\n`;
            list += `: Cost ${item.entity.cost} G. Sell ${item.entity.value} G each.\n`;
            list += `: Yield ${item.entity.yield}. Takes ${hoursToReadable(item.entity.growth)} to grow.\n`;
            list += `: Durability ${item.entity.durability}pt. Immunity ${item.entity.immunity}pt\n`;
            list += `: STRAIN[ ${item.entity.genesColored} ]\n\n`;
        }

        return `${greetings}${stringAutoSpacer(list, " ")}`;
    }
    private _menuTextFunctionVerbose(){
        const greetings = this._greetings();
        let list = "ID: Info\n\n";
        
        for(let item of this._inventory){            
            list += `${item.id}: ${item.entity.name}(${item.entity.symbol}) x${item.count}\n`;
            list += `: Growth temperature ${item.entity.tempLow}°C ~ ${item.entity.tempHigh}°C\n`;
            list += `: Cost ${item.entity.cost} G each. Sell value ${item.entity.value} G each. Profit ${item.entity.value - item.entity.cost} G each.\n`;
            list += `: Yield ${item.entity.yield} per harvest. Takes ${hoursToReadable(item.entity.growth)} to grow.\n`;
            list += `: Expected profit per harvest = ${ item.entity.yield * (item.entity.value - item.entity.cost)} G\n`
            list += `: Durability = ${item.entity.durability}pt. Immunity = ${item.entity.immunity}pt\n`;
            list += `: ${stringBoxer(item.entity.description)}\n`;
            list += `: STRAIN[ ${item.entity.genesColored} ]\n\n`;
        }

        return `${greetings}${stringAutoSpacer(list, " ")}`;
    }

    public getItemById(id: string){
        return this._inventory.find(i => i.id === id);
    }
    public removeItemByCount(id: string, count: number){
        for(let i = 0; i < this._inventory.length; i++){
            if(this._inventory[i].id === id){
                this._inventory[i].count -= count;
                if(this._inventory[i].count <= 0){
                    this._inventory.splice(i,1);
                    return;
                }
            }
        }
    }

    public save(){
        return JSON.stringify(this);
    }

    private _loadInventory(parsedData: any){
        const tmpBag: ShopInventoryItem[] = []
        for(let i = 0; i < parsedData.length; i++){
            tmpBag.push({
                id: parsedData[i].id,
                count: parsedData[i].count,
                entity: PlantEntity.load(parsedData[i].entity),
            })
            
        }
        this._inventory = tmpBag;
    }
    public load(stringData: string){
        const parsed: any = JSON.parse(stringData);
        // Load Inventory too
        Object.assign(this, parsed);
        this._inventory = [];
        this._loadInventory(parsed._inventory)
    }

}