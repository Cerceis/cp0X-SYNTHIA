import { Generate, Delay } from "cerceis-lib";
import { Garden } from "./garden";
import { createInterface } from "readline";
import { commandListString } from "../data/commands";

const stdin = process.stdin;
// without this, we would only get streams once enter is pressed
stdin.setRawMode(true);
// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume()
// i don't want binary, do you?
stdin.setEncoding('utf8');
// on any data into stdin
stdin.on('data', function (key) {
	// ctrl-c ( end of text )
	Game._input += key;
	// write the key to stdout all normal like
	process.stdout.write(key);
});

const myGarden = new Garden("Eternal Garden", 5);

const rl = createInterface({input: process.stdin, output: process.stdout});

type GameComponent = Garden;

export class Game{
    static _awaitingCmd: boolean = false;
    static _input: string = "";

    private _id: string;
    // Every component must have a .text getter;
    private _components: GameComponent[] = []
    private _refreshRate: number;
    
    constructor(refreshRate: number = 10){
        this._id = Generate.objectId();
        this._refreshRate = refreshRate;
    }

    private _parseInput = (str: string) => (str.replace(/\s\s+/g, ' ')).trim().split(" ");

	public addComponent(component: GameComponent){
		this._components.push(component);
	}

    public async startRenderingCycle(){
		this.addComponent(myGarden);
        const _renderFunc = async() => {
			console.clear()
            console.log("WELCOME, I am SYNTHIA, your farm assistant.");
            console.log("---------------------------------------");
            this._components.forEach(c => console.log(c.text));
            console.log("---------------------------------------");
			console.log(`Cmd[help:?]: ${Game._input}`)
			/*
            Game._awaitingCmd = true;
            if(Game._awaitingCmd){
                rl.question(`Cmd[help:?]: `, (c) => {
                    Game._input = this._parseInput(c);
                    Game._awaitingCmd = false;
                })
            }
			*/
        }
		
        while(true){
			// Inputs
            if(Game._input && Game._input.length > 0){
				if(Game._input[0] === "?"){
					console.log(commandListString)
				}
                if(Game._input[0] === "plow" && !isNaN(Number(Game._input[1])) && !isNaN(Number(Game._input[2]))){
                    myGarden.plow(Number(Game._input[1]), Number(Game._input[2]));
                }
            }
            if(Game._awaitingCmd){
                await Delay(this._refreshRate);
                //continue;
            }
            _renderFunc();
            await Delay(this._refreshRate);
        }	
    }
}