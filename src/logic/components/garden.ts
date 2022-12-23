import { PlantEntity } from "./plantEntity";
import { Generate } from "cerceis-lib";
import { VisualComponent, VisualComponentContructorOptions } from "../visualComponent";
import { quickText } from "./quickText";
import { colorString, Color } from "../../functions/gene";
import { stringAutoSpacer, stringBoxer } from "../../functions/stringFunctions";

interface GardenPlot {
    text: string,
    plowed: boolean,
    entity: PlantEntity | null
}

export interface GardenVisualComponentContructorOptions extends VisualComponentContructorOptions{
	name: string,
	size: number
}

export class Garden extends VisualComponent{
    private _grid: GardenPlot[][] = [];
    private _name: string;
	private _size: number;
	get size(): number { return this._size};
	get name(){return this._name};
    
    constructor(options: GardenVisualComponentContructorOptions){
		super(options);
        this._name = options.name;
        for(let row = 0; row < options.size; row++){
            const tmpRow: GardenPlot[] = [];
            for(let cell = 0; cell < options.size; cell++){
                tmpRow.push({
                    text: "[(  )]",
                    plowed: false,
                    entity: null
                })
            }
            this._grid.push(tmpRow);
        }
		this._size = options.size;
		this.text = this._gardenTextFunction;
    }

    private _gardenTextFunction(){
        let textString = "\n       ";
        // Add top label;
        for(let i = 0; i < this._grid[0].length; i++) textString += ` ${i}     `;
        textString += "\n\n";
        for(let row = 0; row < this._grid.length; row++){
            textString += `  ${row}   `;
            for(let cell = 0; cell < this._grid[row].length; cell++){
                const t = this._grid[row][cell].entity;
                if(t){
                    // Color the border [] depends on humidity
                    let humidityColor: Color = "Cyan";
                    if(t.humidity >= 63 && t.humidity <= 83) humidityColor = "Green";
                    if(t.humidity >= 42 && t.humidity <= 62) humidityColor = "Yellow";
                    if(t.humidity >= 21 && t.humidity <= 41) humidityColor = "Brown";
                    if(t.humidity >= 0 && t.humidity <= 20) humidityColor = "Red";
                    if(t.matured) humidityColor = "White";
                    // Color the border () depends on growth rate
                    let growthRateColor: Color = "Cyan";
                    const growthRatePercentage: number = t.growthRate * 100;
                    if(growthRatePercentage >= 63 && growthRatePercentage <= 83) growthRateColor = "Green";
                    if(growthRatePercentage >= 42 && growthRatePercentage <= 62) growthRateColor = "Yellow";
                    if(growthRatePercentage >= 21 && growthRatePercentage <= 41) growthRateColor = "Brown";
                    if(growthRatePercentage >= 0 && growthRatePercentage <= 20) growthRateColor = "Red";
                    if(t.matured) growthRateColor = "White";

                    textString += `${colorString("[", humidityColor)}`;
                    textString += `${colorString("(", growthRateColor)}`;
                    textString += `${this._grid[row][cell].entity?.symbolColored}`;
                    textString += `${colorString(")", growthRateColor)}`;
                    textString += `${colorString("]", humidityColor)} `;
                }else textString += `${this._grid[row][cell].text} `;
            }
            textString += `\n\n`;
        }
        return textString;
    }

    public plow(row: number, col: number, noMessage: boolean = false): boolean{
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            if(!noMessage) quickText(`Cannot find coordinates (${row}, ${col}).`)
            return false;
        }
        this._grid[row][col].text = "[(░░)]";
        this._grid[row][col].plowed = true;
        if(!noMessage) quickText(`Plowed (${row}, ${col}).`)
        return true;
    }

    /**
     * 10 G per plot needed to plow;
     * @returns 
     */
    public checkAutoPlowCost(): number{
        let cost = 0;
        for(let row = 0; row < this._grid.length; row++){
            for(let cell = 0; cell < this._grid[row].length; cell++){
                if(this._grid[row][cell].entity || this._grid[row][cell].plowed) continue;
                cost += 10;
            }
        }   
        return cost;
    }
    
    /**
     * 2 G per plot needed to water;
     * @returns 
     */
    public checkAutoWaterCost(): number{
        let cost = 0;
        for(let row = 0; row < this._grid.length; row++){
            for(let cell = 0; cell < this._grid[row].length; cell++){
                if(!this._grid[row][cell].entity) continue;
                if(this._grid[row][cell].entity && this._grid[row][cell].entity?.humidity === 100) continue;
                cost += 2;
            }
        }   
        return cost;
    }

    /**
     * 10 G per plot needed to harvest;
     * @returns 
     */
    public checkAutoHarvestCost(): number{
        let cost = 0;
        for(let row = 0; row < this._grid.length; row++){
            for(let cell = 0; cell < this._grid[row].length; cell++){
                if(!this._grid[row][cell].entity) continue;
                if(!this._grid[row][cell].entity?.matured) continue;
                cost += 10;
            }
        }   
        return cost;
    }

    public auto(job: "plow" | "water" | "harvest"){
        for(let row = 0; row < this._grid.length; row++){
            for(let cell = 0; cell < this._grid[row].length; cell++){
                if(job === "plow") this.plow(row, cell, true);
                if(job === "water") this.water(row, cell, true);
                if(job === "harvest") this.harvest(row, cell, true);
            }
        }   
    }

    public plant(entity: PlantEntity, row: number, col: number): boolean{
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            quickText(`Cannot find coordinates (${row}, ${col}).`)
            return false;
        }
        if(entity.matured){
            quickText(`Please pick a seed instead.`);
            return false;
        }
        if(!this._grid[row][col].plowed){
            quickText(`Plot (${row}, ${col}) is not plowed yet. Plow it by typing "plow ${row} ${col}"`);
            return false;
        }
        
        const copiedEntity = entity.copy();
        copiedEntity.planted = true;
        this._grid[row][col].entity = copiedEntity;
        return true;
    }

    public updateGrowthCycle(){
        for(let row = 0; row < this._grid.length; row++){
            for(let cell = 0; cell < this._grid[row].length; cell++){
                const target = this._grid[row][cell].entity;
                if(!target || !target.planted) continue;
                target.triggerGrowCycle();
                if(target.health <= 0) this.destory(row, cell);
            }
        }
    }

    // Gives more info
    public checkout(row: number, col: number){
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            quickText(`Cannot find coordinates (${row}, ${col}).`)
            return false;
        }
        const target = this._grid[row][col].entity;
        if(!target){
            quickText(`Unknown entity (${row}, ${col}).`)
            return false;
        }
        let text = "";
        const progressLength = Math.round(target.growthInfo.percentage/2.5);
        const progressBlock = new Array(progressLength).fill("■").join("");
        text += `Coordinate: (${row},${col})\n`;
        text += `Growth: ${progressBlock}${new Array(40 - progressLength).fill("▢").join("")} ${target.growthInfo.percentage}%\n`;
        text += `Growth Rate(GR): ${target.growthRate}\n`;
        text += `Ready to harvest: ${target.matured?"✓":"⨯"}\n`;
        text += `Name: ${target.name}\n`;
        text += `Health: ${target.health}/100\n`
        text += `Suitable Temp: ${target.tempLow}°C ~ ${target.tempHigh}°C\n`;
        text += `Humidity(H): ${target.humidity}\n`
        text += `Description: ${stringBoxer(target.description)}`
        text += `Strain: ${target.genesColored}\n`;
        quickText(stringAutoSpacer(text, " "));
    }

    /**
     * Gives basic info.
     */
    public checkoutAll(){
        let text = "";
        for(let row = 0; row < this._grid.length; row++){
            for(let cell = 0; cell < this._grid[row].length; cell++){
                const target = this._grid[row][cell].entity;
                if(!target || !target.planted) continue;
                // 40 length, 2.5 per block
                const progressLength = Math.round(target.growthInfo.percentage/2.5);
                const progressBlock = new Array(progressLength).fill("■").join("");
                text += `(${row},${cell}) ${progressBlock}${new Array(40 - progressLength).fill("▢").join("")} ${target.growthInfo.percentage}%\n`;
                text += `Strain ${target.genesSimplified}\n`;
                text += `${target.name} | Harvest ${target.matured?"✓":"⨯"} | Health[${target.health}] | ${target.tempLow}°C ~ ${target.tempHigh}°C | GR ${target.growthRate} | H ${target.humidity}\n\n`;
            }
        }
        quickText(text);
    }

    public harvest(row: number, col: number, noMessage: boolean = false): boolean | PlantEntity{
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            if(!noMessage) quickText(`Cannot find coordinates (${row}, ${col}).`);
            return false;
        }
        const target = this._grid[row][col].entity;
        if(!target){
            if(!noMessage) quickText(`No plant found in coordinates (${row}, ${col}).`);
            return false;
        }
        if(!target.matured){
            if(!noMessage) quickText(`The plant is not ready to be harvest (${row}, ${col}).`);
            return false;
        }
        this._grid[row][col].text = "([  ])";
        this._grid[row][col].plowed = false;
        this._grid[row][col].entity = null;
        return target;
    }

    public water(row: number, col: number, noMessage: boolean = false){
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            if(!noMessage) quickText(`Cannot find coordinates (${row}, ${col}).`);
            return false;
        }
        const target = this._grid[row][col].entity;
        if(!target){
            if(!noMessage) quickText(`No plant found in coordinates (${row}, ${col}).`);
            return false;
        }
        if(!noMessage) quickText(`Watered (${row}, ${col}).`);
        target.humidity = 100;
    }

    public destory(row: number, col: number){
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            quickText(`Cannot find coordinates (${row}, ${col}).`);
            return false;
        }
        const target = this._grid[row][col].entity;
        if(!target){
            quickText(`No plant found in coordinates (${row}, ${col}).`);
            return false;
        }
        this._grid[row][col].text = "([  ])";
        this._grid[row][col].plowed = false;
        this._grid[row][col].entity = null;
        quickText(`Plant destroyed (${row}, ${col}).`);
    }

    public save(){
        return JSON.stringify(this);
    }

    private _loadGrid(parsedData: any){
        const tmpGrid: GardenPlot[][] = [];
        for(let row = 0; row < parsedData.length; row++){
            const tmpRow: GardenPlot[] = [];
            for(let cell = 0; cell < parsedData.length; cell++){
                tmpRow.push({
                    text: parsedData[row][cell].text,
                    plowed: parsedData[row][cell].text === "[(░░)]" ? true : false,
                    entity: parsedData[row][cell].entity ? PlantEntity.load(parsedData[row][cell].entity) : null,
                })
            }
            tmpGrid.push(tmpRow);
        }
        this._grid = tmpGrid;
    }
    public load(stringData: string){
        const parsed: any = JSON.parse(stringData);
        Object.assign(this, parsed);
        this._grid = [];
        this._loadGrid(parsed._grid)
    }
}