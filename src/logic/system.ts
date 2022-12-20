import { writeFileSync, readFileSync, existsSync } from "fs";
import { user, comShop, comGarden, comTime } from "./components";
import { quickText } from "./components/quickText";

const savePath: string = "./.savedFile";

interface SavedFile{
    user: string,
    shop: string,
    garden: string,
    time: string,
}
/**
 * Things to save
 * User -> Bag -> PlantEntity
 * Shop -> Inventory -> PlantEntity
 * Garden
 * Time
 */
export const save = (isAuto: boolean = false) => {
    const saveObj: SavedFile = {
        user: user.save(),
        shop: comShop.save(),
        garden: comGarden.save(),
        time: comTime.save(),
    }
    writeFileSync(savePath, JSON.stringify(saveObj));
    if(isAuto)
        quickText(`Auto saved! ${comTime.time}`);
    else
        quickText(`File saved! ${comTime.time}`);
}


export const load = () => {
    if(!existsSync(savePath)){
        quickText("No save file found!");
        return;
    }
    const savedData = JSON.parse(readFileSync("./.savedFile").toString());
    user.load(savedData.user);
    comShop.load(savedData.shop);
    comGarden.load(savedData.garden);
    comTime.load(savedData.time);
    quickText("Load successful!");
}
