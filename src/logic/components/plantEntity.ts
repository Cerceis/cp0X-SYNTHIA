import { Generate } from "cerceis-lib";
import { PlantData } from "../../data/plantData";
import { generateNewGeneStrain, colorGeneStrain, countGene, colorString, Color } from "../../functions/gene";
import { comTime } from "../components";

export class PlantEntity{
    private _id: string;
    private _baseYield: number;
    private _baseGrowth: number;
    private _genes: string = "";
    private _geneMap: {[key: string]: number} = {};
    private _baseTempHigh: number;
    private _baseTempLow: number;
    //  
    private _health: number = 100;
    get health(): number { return this._health; }
    private _currentGrowth: number = 0;
    get growthInfo(){
        return{
            current: this._currentGrowth,
            max: this.growth,
            percentage: Number((this._currentGrowth/this.growth*100).toFixed(2)) > 100 ?
            100 : Number((this._currentGrowth/this.growth*100).toFixed(2)),
        }
    }
    private _planted: boolean = false;
    get planted(){return this._planted};
    set planted(v: boolean){this._planted = v};
    private _matured: boolean = false;
    get matured(){return this._matured};
    private _harvestedYield: number = 0;
    get harvestedYield(): number{return this._harvestedYield};
    private _humidity: number = 100; // 0 ~ 100, Scale to growthRate
    get humidity(): number { return this._humidity };
    set humidity(v: number){ this._humidity = v };
    get growthRate(){
        const currentTemp = comTime.temperature;
        let temperaturePenalty = 0;
        if(currentTemp > this.tempHigh){
            const tempDiff = currentTemp - this.tempHigh;
            temperaturePenalty = 0.2 * tempDiff;
        }
        if(currentTemp < this.tempLow){
            const tempDiff = this.tempLow - currentTemp;
            temperaturePenalty = 0.2 * tempDiff;
        }
        const finalValue = Number((this._humidity/100 - temperaturePenalty).toFixed(2));
        return  finalValue > 0 ? finalValue : 0;
    };
    // 0 ~ 20, 21 ~ 41, 42 ~ 62, 63 ~ 83, 84 ~ 100 
    get symbolColored(){ 
        let color: Color = "Cyan";
        if(this.health >= 63 && this.health <= 83) color = "Green";
        if(this.health >= 42 && this.health <= 62) color = "Yellow";
        if(this.health >= 21 && this.health <= 41) color = "Brown";
        if(this.health >= 0 && this.health <= 20) color = "Red";
        if(this.matured) color = "White";
        return colorString(this.symbol, color);
    };
    //

    public name: string;
    public description: string;
    public symbol: string;

    get genes(): string{return this._genes};
    get genesColored(): string{return colorGeneStrain(this._genes)};
    get genesSimplified(): string{return colorGeneStrain(this._genes, true)};
    get yield(): number{
        if(!this._geneMap["Y"]) return this._baseYield;
        const scale = Math.ceil(this._baseYield/10);
        return this._baseYield + ( scale * this._geneMap["Y"] );
    }
    get durability(): number {
        return 100 + ( 10 * this._geneMap["D"] );
    }
    get immunity(): number {
        return 0 + ( 10 * this._geneMap["I"] );
    }
    get cost(): number {
        const scale = this._geneMap["M"] ? this._geneMap["M"] : 0;
        return Math.floor(10 + (1.1 * scale));
    }
    // Every 5 yield decrease value by 1%;
    // The longer the growth, the more value it yield (+1% everyday needed to grow);
    get value(): number {
        const scale = this._geneMap["M"] ? this._geneMap["M"] : 0;
        const yieldFactor = (0.01 * Math.round(this.yield/5));
        const growthFactor = (0.01 * Math.round(this.growth/24));
        const cleanResult = Math.ceil( (15 + (2 * scale)) ) ;
        return Math.round(cleanResult + ( cleanResult * growthFactor ) - ( cleanResult * yieldFactor));
    }
    /**
     * value in hours. Lower the faster
     * Takes 2% of baseGrowth and multiply for each Growth gene.
     */
    get growth(): number{
        if(!this._geneMap["G"]) return this._baseGrowth;
        const scale = Math.ceil(this._baseGrowth * .02);
        return this._baseGrowth - ( scale * this._geneMap["G"] );
    }
    get tempHigh(){
        if(!this._geneMap["H"]) return this._baseTempHigh;
        return this._baseTempHigh + this._geneMap["H"]
    }
    get tempLow(){
        if(!this._geneMap["C"]) return this._baseTempLow;
        return this._baseTempLow - this._geneMap["C"]
    }
    
    constructor(bluePrint: PlantData){
        this._id = Generate.objectId();
        this.name = bluePrint.name;
        this.description = bluePrint.description;
        this.symbol = bluePrint.symbol;
        this._baseYield = bluePrint.baseYield;
        this._baseGrowth = bluePrint.baseGrowth;
        this._baseTempHigh = bluePrint.baseTempHigh;
        this._baseTempLow = bluePrint.baseTempLow;
        this._generateGenes();
        this._geneMap = countGene(this._genes);
    }
    
    private _generateGenes(){
        this._genes = generateNewGeneStrain();
    }

    public copy(){
        const tmp = new PlantEntity({
            id: this._id,
            name: this.name,
            description: this.description,
            symbol: this.symbol,
            baseYield: this._baseYield,
            baseGrowth: this._baseGrowth,
            baseTempHigh: this._baseTempHigh,
            baseTempLow: this._baseTempLow,
        });
        return Object.assign(tmp, this);
    }

    /**
     * Every cycle.
     * - Decrease humidity,
     * - Increase growth by growth rate
     * - If suitable temperature diff are more than 10 degree, health -5 per cycle.
     */       
    public triggerGrowCycle(){
        if(this._matured) return;
        this._humidity --;
        if(this._humidity < 0) this._humidity = 0;
        // Since every cycle is 1 minutes, and 1 minutes is 6 hours in game.
        // Each cycle increase base growth progress by 6 hours.
        const baseGrowth = 6;
        // Scale with humidity
        const fixedGrowth = Math.round(baseGrowth * this.growthRate);
        this._currentGrowth += fixedGrowth;

        // Health calculation
        const currentTemp = comTime.temperature;
        let tempDiff = 0;
        if(currentTemp > this.tempHigh) tempDiff = currentTemp - this.tempHigh;
        if(currentTemp < this.tempLow) tempDiff = this.tempLow - currentTemp;
        if(tempDiff > 5){
            this._health -= 5 ;
        }
        // Destory is handled on Garden Class.

        // TODO: Blight, recover / damage by blight scale by Immunity + Durability. 
        // TODO: Health damage scale by Durability
        
        if(this.growthInfo.percentage >= 100){
            this._harvestedYield = this.yield;
            this._matured = true;
        }
    }

    static load(parsedData: any){
        const tmp = new PlantEntity({
            id: parsedData._id,
            name: parsedData.name,
            description: parsedData.description,
            symbol: parsedData.symbol,
            baseYield: parsedData._baseYield,
            baseGrowth: parsedData._baseGrowth,
            baseTempHigh: parsedData._baseTempHigh,
            baseTempLow: parsedData._baseTempLow,
        })
        return Object.assign(tmp, parsedData);
    }

}