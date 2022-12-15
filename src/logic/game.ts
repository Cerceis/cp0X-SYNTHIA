import { Generate, Delay } from "cerceis-lib";
import { Garden } from "./garden";
import { createInterface } from "readline";

const myGarden = new Garden("Eternal Garden", 5);

const rl = createInterface({input: process.stdin, output: process.stdout});

type GameComponent = Garden;



export class Game{
    static _awaitingCmd: boolean = false;
    static _input: string[] = [];

    private _id: string;
    // Every component must have a .text getter;
    private _components: GameComponent[] = []
    private _refreshRate: number;
    
    constructor(refreshRate: number = 100){
        this._id = Generate.objectId();
        this._refreshRate = refreshRate;
    }

    private _parseInput = (str: string) => (str.replace(/\s\s+/g, ' ')).trim().split(" ");

    private _checkInputStartsWith = (str: string) => {
        console.log(str)
    }

    public async startRenderingCycle(){
        const _renderFunc = async() => {
            console.clear();
            //console.log("\f\u001bc\x1b[3J");
            console.log("WELCOME, I am SYNTHIA, your farm assistant.");

            console.log(Generate.currentDateTime());
            console.log("---------------------------------------");
            console.log("[1] Plow  [2] Shop  [3] Info  [4] System")
            console.log("---------------------------------------");
            console.log(myGarden.text)

            console.log("---------------------------------------");
            if(Game._input) console.log(Game._input);
            Game._awaitingCmd = true;
            if(Game._awaitingCmd){
                rl.question(`Cmd: `, (c) => {
                    Game._input = this._parseInput(c);
                    Game._awaitingCmd = false;
                })
            }
        }
        while(true){
            if(Game._input && Game._input.length > 0){
                if(Game._input[0] === "plow" && !isNaN(Number(Game._input[1])) && !isNaN(Number(Game._input[2]))){
                    myGarden.plow(Number(Game._input[1]), Number(Game._input[2]))
                }
            }
            if(Game._awaitingCmd){
                await Delay(this._refreshRate);
                continue;
            }
            _renderFunc();
            await Delay(this._refreshRate);
        }	
    }
}