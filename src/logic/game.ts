import { Delay } from "cerceis-lib";
import { createInterface } from "readline";
import { VisualComponent } from "./visualComponent";
import { applyCommands } from "./commands";

export class Game{
    static _awaitingCmd: boolean = false;
    static _input: string[] = [];
    static _previousInput: string[] = [];

    private _refreshRate: number;
    
    constructor(refreshRate: number = 100){
        this._refreshRate = refreshRate;
    }

	static clearGameInput(){Game._input = []};

    private _parseInput = (str: string) => (str.replace(/\s\s+/g, ' ')).trim().split(" ");

    public async startRenderingCycle(){
        const _renderFunc = async() => {
            process.stdout.write('\u001b[3J\u001b[1J');
            console.clear()
			VisualComponent.render();	
            Game._awaitingCmd = true;
            if(Game._awaitingCmd){
                const rl = createInterface({input: process.stdin, output: process.stdout});
                // Game cycle is 1 minutes.
                // But timeout to force rerender is
                const renderTimeOut = setTimeout(() => {
                    Game._awaitingCmd = false;
                    rl.close();
                }, 1000 * 60 * 4) // 4 minutes 
                rl.question(`[help:?]: `, (c) => {
                    Game._input = this._parseInput(c);
                    Game._awaitingCmd = false;
                    clearTimeout(renderTimeOut);
                    rl.close();
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

