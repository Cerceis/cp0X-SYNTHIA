import { PlantEntitity } from "./plant_entitity";
import { Generate } from "cerceis-lib";

interface GardenPlot {
    text: string,
    fertilizer: boolean, // No idea how to implement yet.
    entity: PlantEntitity | null
}

export class Garden{
    private _id: string;
    private _grid: GardenPlot[][] = [];
    private _name: string;
    
    constructor(name: string, size: number){
        this._id = Generate.objectId();
        this._name = name;
        for(let row = 0; row < size; row++){
            const tmpRow: GardenPlot[] = [];
            for(let cell = 0; cell < size; cell++){
                tmpRow.push({
                    text: "[  ]",
                    fertilizer: false,
                    entity: null
                })
            }
            this._grid.push(tmpRow);
        }
    }

    get text(){
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