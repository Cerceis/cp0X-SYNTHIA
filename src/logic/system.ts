import { writeFileSync, readFileSync, existsSync } from "fs";
import { user, comShop, comGarden, comTime } from "./components";
import { Genetics } from "./genetics";
import { quickText } from "./components/quickText";
import { Obfuscator } from "cerceis-lib";

export interface SaveOptions{
    filename: string,
    autoSave: boolean,
    baseDir: string,
}
export const saveOptions: SaveOptions = {
    filename: "autoSave",
    autoSave: true,
    baseDir: "./saves/"
};
const WHATYOULOOKINAT = "WHATYOULOOKINAT"
const obsMachine = new Obfuscator();

interface SavedFile{
    user: string,
    shop: string,
    garden: string,
    time: string,
	genetic: string
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
		genetic: Genetics.save(),
    }
    const savePath: string = `${saveOptions.baseDir}${saveOptions.filename}.synthia`;
    writeFileSync(savePath, obsMachine.obfuscatev3(JSON.stringify(saveObj), WHATYOULOOKINAT));
    if(isAuto)
        quickText(`Auto saved! ${comTime.time}`);
    else
        quickText(`File saved! ${comTime.time}`);
}

export const load = (filename: string = "autoSave") => {
    const loadPath: string = `${saveOptions.baseDir}${filename}.synthia`;
    if(!existsSync(loadPath)){
        quickText("No save file found!");
        return;
    }
    const savedData = JSON.parse(obsMachine.deobfuscatev3(readFileSync(loadPath).toString(), WHATYOULOOKINAT));
    user.load(savedData.user);
    comShop.load(savedData.shop);
    comGarden.load(savedData.garden);
    comTime.load(savedData.time);
	Genetics.load(savedData.genetic);
    quickText("Load successful!");
}
