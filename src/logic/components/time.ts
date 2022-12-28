import { VisualComponent, VisualComponentContructorOptions } from "../visualComponent"
import { Generate } from "cerceis-lib";
import { comShop, comGarden } from "../components";
import { save } from "../system";
/**
 * How time pass
 * 1 year is squished into a day.
 * But
 * 1 day real time = 360 day in game (no leap year, and so we can split evenly into 4 Season.)
 * 30 Days per month.
 * There's 90 Days per season (Total of 4 season).
 * 6 Hours real time  = 1 Season in game = 90 Days in game.
 * 1 Hour real time = 15 Days in game.
 * 4 Minutes real time = 1 Day in game.
 * 1 Minutes real time = 6 Hours in game. <= This should be the smallest unit in game.
 */

export interface TimeVisualComponentContructorOptions extends VisualComponentContructorOptions{
    timePassed?: number
}
export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
// Starts at 0000-00-00 00H (Spring);
// TimePassed: number = Integer as hour.
const monthToSeasonMap: {[key: number]: Season} = {
    3: "Spring", 4: "Spring", 5: "Spring",
    6: "Summer", 7: "Summer", 8: "Summer",
    9: "Autumn", 10: "Autumn", 11: "Autumn",
    12: "Winter", 1: "Winter", 2: "Winter",
}
export class TimeController extends VisualComponent{
    
    private _timePassed: number;
    private _parsedTimeString: string = "0000-00-00 00H (Spring)";
    // Time separated
    private _years: number = 1;
    private _months: number = 1;
    private _days: number = 1;
    private _hours: number = 1;
    private _season: Season = "Spring";
    private _temperature: number = 24;
    private _interval: any;
    private _yearlyOffSet: number = Generate.int(-10, 11);
    private _temperatureScalesOffset: Record<Season, {high: number, low: number}> = {
        "Spring":{high: 20, low: 10}, 
        "Summer":{high: 35, low: 18},
        "Autumn":{high: 25, low: 14},
        "Winter":{high: 4, low: -10},
    }
    private _counters:{[key: string]: number}={
        "updateTemperature": 1,
        "shopInventoryUpdateDay": 15,
        "autoSave": 1,
    }
    get time(){return this._parsedTimeString};
    get temperature(){return this._temperature};
    
    constructor(options: TimeVisualComponentContructorOptions){
        super(options);
        // Default starts at year 1 Spring ();
        this._timePassed = options.timePassed ? options.timePassed : 10800;
        this._startTime();
        this._updateData();
        this.text = this._timeTextFunction;
    }

    private _timeTextFunction(){
        return `${this._parsedTimeString}   ${this._temperature}°C`;
    }

    // Time update every real minutes
    private _startTime() {
        this._interval = setInterval(() => {
            this._timePassed += 6;
            this._updateData();
        }, 1000 * 60);
    }

    /**
     * All time written as in game scale.
     * 6 Hours * 4 = 24 Hours = 1 Day;
     * 24 Hours * 90 = 2160 Hours = 90 days = 1 Season;
     * 30 Days per Season. = 720 Hours
     * 8640 Hours = 4 Season = 1 Year;
     */
    private _updateData(){
        // Parse time
        let tp = this._timePassed;
        const year = Math.floor(tp / 8640);
        tp -= 8640 * year;
        // Things to update yearly
        if(this._years !== year) {
            this._yearlyOffSet = Generate.int(-10, 11);
        }
        this._years = year;
        //
        let month = Math.floor(tp / 720);
        tp -= 720 * month;
        month += 1;
        this._months = month;
        //
        let day = Math.floor(tp / 24);
        tp -= 24 * day;
        day += 1;
        // Things to update daily
        if(this._days !== day) {
            this._counters.updateTemperature --;
            this._counters.shopInventoryUpdateDay --;
            this._counters.autoSave --;
        }
        this._days = day;
        //
        const hour = tp;
        this._hours = hour;
        //
        let parsed = `${String(year).padStart(4, '0')}`;
        parsed += `-${String(month).padStart(2, '0')}`;
        parsed += `-${String(day).padStart(2, '0')}`;
        parsed += ` ${String(hour).padStart(2, '0')}H`;
        // Parse season
        this._season = monthToSeasonMap[month];
        parsed += ` (${this._season})`;
        this._parsedTimeString = parsed;
        
        // Process counters
        if(this._counters.updateTemperature === 0){
            this.generateTemperature();
            this._counters.updateTemperature = 1;
        }
        if(this._counters.shopInventoryUpdateDay === 0){
            comShop.generateInventory();
            this._counters.shopInventoryUpdateDay = 15;
        }
        if(comGarden) comGarden.updateGrowthCycle();



        // Auto save should be last
        if(this._counters.autoSave === 0){
            this._counters.autoSave = 1;
            save(true);
        }
    }

    // Apple new scale for random generation
    // Used by generating new lowest tem/highest tem, etc.
    private generateTemperature(){
        /**
            "Spring":{high: 0, low: 0}, // Base high: 20, Base low: 1
            "Summer":{high: 0, low: 0}, // Base high: 30, Base low: 15
            "Autumn":{high: 0, low: 0}, // Base high: 25, Base low: 18
            "Winter":{high: 0, low: 0}, // Base high: 4, Base low: -10
        */
        this._temperature = Generate.int(
            this._temperatureScalesOffset[this._season].low + this._yearlyOffSet,
            this._temperatureScalesOffset[this._season].high + this._yearlyOffSet
        );
    }

    public generateWeatherReport(): string{
        const offset = this._yearlyOffSet;
        // -10 ~ -5, -4 ~ 0, 1 ~ 5, 6 ~ 10.
        let str: string = "";
        if(offset <= -5){
            str += "Temperature this year is fairly low. Maybe another ice age is coming soon?\n";
            str += "Make sure you prepare for the cold weather!\n"
        }
        if(offset >= -4 && offset <= 0){
            str += "Temperature this year is on the low side. But should not be a problem.\n";
            str += "It's recommended to plant more cold resistant crops!\n"
        }
        if(offset >= 1 && offset <= 5){
            str += "Temperature this year is on the warmer side. But should not be a problem?\n";
            str += "Just keep an eye on the temperature everyday!\n"
        }
        if(offset >= 6 && offset <= 10){
            str += "Temperature this year is extremely high. Global warming is no joke!\n";
            str += "Prepare for unexpectedly high temperature throughout all season!\n"
        }
        return str;
    }

    public save(){
        this._interval = null;
		const result = JSON.stringify(this);
		this._startTime();
        return result;
    }

    public load(stringData: string){
        const parsed: any = JSON.parse(stringData);
        Object.assign(this, parsed);
    }
} 