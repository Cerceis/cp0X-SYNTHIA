import { Delay } from "cerceis-lib";
import { createInterface } from "readline";
import { VisualComponent } from "./visualComponents/visualComponent";
import { applyCommands } from "./commands";

const rl = createInterface({input: process.stdin, output: process.stdout});

export class Game{
    static _awaitingCmd: boolean = false;
    static _input: string[] = [];

    private _refreshRate: number;
    
    constructor(refreshRate: number = 100){
        this._refreshRate = refreshRate;
    }

	static clearGameInput(){Game._input = []};

    private _parseInput = (str: string) => (str.replace(/\s\s+/g, ' ')).trim().split(" ");

    public async startRenderingCycle(){
        const _renderFunc = async() => {
			console.clear()
			VisualComponent.render();	
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

