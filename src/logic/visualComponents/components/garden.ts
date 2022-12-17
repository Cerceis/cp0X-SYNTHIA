import { PlantEntitity } from "../../plantEntitity";
import { Generate } from "cerceis-lib";
import { VisualComponent, VisualComponentContructorOptions } from "../visualComponent";

interface GardenPlot {
    text: string,
    fertilizer: boolean, // No idea how to implement yet.
    entity: PlantEntitity | null
}

export interface GardenVisualComponentContructorOptions extends VisualComponentContructorOptions{
	name: string,
	size: number
}

export class Garden extends VisualComponent{
    private _grid: GardenPlot[][] = [];
    private _name: string;
    
    constructor(options: GardenVisualComponentContructorOptions){
		super(options);
        this._name = options.name;
        for(let row = 0; row < options.size; row++){
            const tmpRow: GardenPlot[] = [];
            for(let cell = 0; cell < options.size; cell++){
                tmpRow.push({
                    text: "[  ]",
                    fertilizer: false,
                    entity: null
                })
            }
            this._grid.push(tmpRow);
        }
		this.text = this._gardenTextFunction;
    }

    private _gardenTextFunction(){
        let textString = "    ";
        // Add top label;
        for(let i = 0; i < this._grid[0].length; i++) textString += ` ${i}  `;
        textString += "\n\n";
        for(let row = 0; row < this._grid.length; row++){
            textString += `${row}   `;
            for(let cell = 0; cell < this._grid[row].length; cell++){
                textString += this._grid[row][cell].text;
            }
            textString += `\n`;
        }
        return textString;
    }

    public plow(row: number, col: number): {msg: string, error:boolean}{
        if(!this._grid || !this._grid[row] || !this._grid[row][col]){
            return{
                msg: `Cannot find coordinates (${row}, ${col}).`,
                error: true
            }
        }
        this._grid[row][col].text = "[░░]";
        return {msg: `Plowed (${row}, ${col}).`, error: false};
    }
}