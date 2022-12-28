import { FromArray } from "cerceis-lib";
/**
	M: Money/Gold: Affect sell price.
	Y: Yields: Affect yields.
	G: Growth: The more the faster (Less time needed to fully grow).
	H: Heat: Heat endurance.
	C: Cold: Cold endurance.
	I: Immunity: Immunity from plant based deceases.
	D: Durability: Higher = Better protection from bug infectation, lesser loss during harvest.
	0: Empty: No effects.
	00000000000000000CCDDDDDGGHHHHHIIIIIIMMY
	"M": { weight: 1, color: "Yellow" }, // Money/Gold: Affect sell price.
    "Y": { weight: 1, color: "Blue" }, // Yields: Affect yields.
    "G": { weight: 1, color: "Green" }, // Growth: The more the faster (Less time needed to fully grow).
    "H": { weight: 2, color: "Red" }, // Heat: Heat endurance.
    "C": { weight: 2, color: "Cyan" }, // Cold: Cold endurance.
    "I": { weight: 3, color: "Pink" }, // Immunity: Immunity from plant based deceases.
    "D": { weight: 3, color: "Brown" }, // Durability: Higher = Better protection from bug infectation, lesser loss during harvest.
    "0": { weight: 10, 
		
 */
class Extractor{
	private _ms: number;
	private _msNeeded: number;
	private _interval: any = null;
	private _status: "extracting" | "done" = "extracting";
	private _strain: string;
	private _result: string = "";
	get time(){ return this._ms };
	get status(){ return this._status; };
	get strain(){ return this._strain; };
	get result(){ return this._result; };
	get percentage(){return Number(((1-this._ms/this._msNeeded)*100).toFixed(2))};
	get percentageText(){
		const progressLength = Math.round(this.percentage/2.5);
		const progressBlock = new Array(progressLength).fill("■").join("");
		return `${progressBlock}${new Array(40 - progressLength).fill("▢").join("")} ${this.percentage}%\n`;
	}
	constructor(strain: string){
		const time = Extractor.calTimeNeeded(strain);
		this._ms = time;
		this._msNeeded = time;
		this._strain = strain;
		this._start();
	}
	private _start(){
		this._interval = setInterval(()=>{
			this._ms -= 1000;
			if (this._ms <= 0){
				clearInterval(this._interval);
				this._result = FromArray.getRandom(this._strain.split(""))[0];
				this._status = "done";
			}
		}, 1000);
	}
	/** Return number in ms */
	static calTimeNeeded(strain: string): number{
		let _ms: number = 0;
		const arr = strain.split("");
		const geneTimeMap: {[key: string]: number} = {
			"0": 1000,
			"D": 10000, "I": 10000,
			"C": 30000, "H": 30000,
			"G": 1000*60, "Y": 1000*60, "M": 1000*60, 
		}
		arr.forEach(g => _ms+=geneTimeMap[g]);
		return _ms;
	}
	public save(){
		this._interval = null;
		return this;
	}
	static load(parsedData: any){
        const tmp = new Extractor(parsedData.strain)
        return Object.assign(tmp, parsedData);
    }
}

export const Genetics = {
	// Should be gene record
	geneBank: {
		"0": 0, "D": 0, "I": 0, "C": 0,
		"H": 0, "G": 0, "Y": 0, "M": 0, 
	} as {[key: string]: number},
	extractorList: [] as Extractor[],
	extract(strain: string){
		this.extractorList.push(new Extractor(strain));
	},
	collectExtraction(){

	},
	geneInsert(gene: string, strain: string){
		const arr = strain.split("");
		const randomIndex = FromArray.getRandom(arr, 1, true)[0];
		const arr2 = [...arr];
		arr2[randomIndex] = gene;
		let text: string = `Replaced a ${arr[randomIndex]} with ${gene}\n`;
		text += arr2.sort().join("");
		console.log(text)
	},
	strainsMixer(strainA: string, strainB: string){
		const tmpBank = FromArray.shuffle([...strainA.split(""), ...strainB.split("")]);
		let newStrain: string[] = [];
		while(newStrain.length < 40){
			newStrain.push(FromArray.getRandom(tmpBank)[0]);
		}
		return newStrain.sort().join("");
	},
	save(){
        return JSON.stringify(this);
    },
	loadExtractor(parsedData: any){
        const tmpList: Extractor[] = []
        for(let i = 0; i < parsedData.length; i++){
            tmpList.push()
        }
        this.extractorList = tmpList;
    },
    load(stringData: string){
        const parsed: any = JSON.parse(stringData);
        Object.assign(this, parsed);
        this.extractorList = [];
        this.loadExtractor(parsed.extractorList)
    }
}

/*
Genetics.extract("00000000000000000CCDDDDDGGHHHHHIIIIIIMMY")
Genetics.extract("000000000000CCDDDDDGGGGHHHHHIIIIIIMMMMYY")
Genetics.extract("00000000000000000CCCCDDDDDGGHHHHHIIIIMMY")
Genetics.extract("00000000000000CCCCDDDDDGGHHHHHIIIIIIMMYY")
*/
/*
setInterval(()=>{
	console.clear();
	console.log(Genetics.geneBank)
}, 1000);
*/
Genetics.geneInsert("Y", "00000000000000000CCDDDDDGGHHHHHIIIIIIMMY");
//const newStrain = Genetics.strainsMixer("000000000000CCDDDDDGGGGHHHHHIIIIIIMMMMYY", "00000000000000000CCDDDDDGGHHHHHIIIIIIMMY");
//console.log(newStrain);