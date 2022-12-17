import { Generate, Delay } from "cerceis-lib";
import { Garden } from "./visualComponents/components/garden";
import { createInterface } from "readline";
import { commandListString } from "../data/commands";
import { VisualComponent } from "./visualComponents/visualComponent";

const myGarden = new Garden({
	label: "garden",
	name: "Eternal Garden",
	size: 5,
});

const rl = createInterface({input: process.stdin, output: process.stdout});

export class Game{
    static _awaitingCmd: boolean = false;
    static _input: string[] = [];

    private _id: string;
    private _refreshRate: number;
    
    constructor(refreshRate: number = 100){
        this._id = Generate.objectId();
        this._refreshRate = refreshRate;
    }

	static clearGameInput(){Game._input = []};

    private _parseInput = (str: string) => (str.replace(/\s\s+/g, ' ')).trim().split(" ");

    public async startRenderingCycle(){
        const _renderFunc = async() => {
			console.clear()
            console.log("WELCOME, I am SYNTHIA, your farm assistant.");
            console.log("---------------------------------------");
			VisualComponent.renderAll();
            console.log("---------------------------------------");
			
            Game._awaitingCmd = true;
            if(Game._awaitingCmd){
                rl.question(`[help:?]: `, (c) => {
                    Game._input = this._parseInput(c);
                    Game._awaitingCmd = false;
                })
            }
        }
        while(true){
			applyCommands(Game._input);
			if(Game._awaitingCmd){
				await Delay(this._refreshRate);
				continue;
			}
            _renderFunc();
            await Delay(this._refreshRate);
        }	
    }
}


const applyCommands = (input: string[]) => {
	if(input && input.length > 0){
		if(input[0] === "?"){
			new VisualComponent({
				label: "commandHelper",
				text: () => commandListString,
				destoryOnNextCycle: true,
			});
			Game.clearGameInput();
		}
		if(input[0] === "plow" && !isNaN(Number(input[1])) && !isNaN(Number(input[2]))){
			myGarden.plow(Number(input[1]), Number(input[2]));
			Game.clearGameInput();
		}
	}
	
}