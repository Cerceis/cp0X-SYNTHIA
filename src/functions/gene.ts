import { Gacha } from "cerceis-lib";
/**
 * I don't know why, but Color functions are in here as well
 * haha.
 */
/**
 * Genes are to determines the properties of a plant.
 * Genes are in length of 40.
 */
const geneGacha = new Gacha();
export type Color = 
"Red" | "Green" | "Yellow" | "Blue" | "Magenta" | "Cyan" | "White" | "Grey" |
"Orange" | "Brown" | "Pink";
export type Gene =
"M" | "Y" | "G" | "H" | "C" | "I" | "D" | "0";

const Colors: Record<Color, string | number> = {
    "Red": 196,
    "Green": 46,
    "Yellow": 190,
    "Blue": 21,
    "Magenta": 129,
    "Cyan": 81,
    "White": 15,
    "Grey": 240,
    "Orange": 208,
    "Brown": 136,
    "Pink": 212,
}

export interface GeneData{
    weight: number,
    color: Color,
}
export const colorString = (str: string, color: Color): string => `\x1b[38;5;${Colors[color]}m${str}\x1b[0m`;
const geneData: Record<Gene, GeneData> = {
    "M": { weight: 1, color: "Yellow" }, // Money/Gold: Affect sell price.
    "Y": { weight: 1, color: "Blue" }, // Yields: Affect yields.
    "G": { weight: 1, color: "Green" }, // Growth: The more the faster (Less time needed to fully grow).
    "H": { weight: 2, color: "Red" }, // Heat: Heat endurance.
    "C": { weight: 2, color: "Cyan" }, // Cold: Cold endurance.
    "I": { weight: 3, color: "Pink" }, // Immunity: Immunity from plant based deceases.
    "D": { weight: 3, color: "Brown" }, // Durability: Higher = Better protection from bug infectation, lesser loss during harvest.
    "0": { weight: 10, color: "Grey" }, // Empty: No effects.
}

for(let gene in geneData) geneGacha.addEntries(gene, geneData[gene as Gene].weight); 

export const generateNewGeneStrain = () => {
    let geneString: Gene[] = [];
    for(let i = 0; i < 40; i++){
        geneString.push(geneGacha.getRandom());
    }
    return geneString.sort().join("");
}

export const colorGeneStrain = (gene: string, simplified: boolean = false) => {
    let tmp: string = "";
    for(let i = 0; i < gene.length; i++){
        if(simplified)
            tmp += `\x1b[38;5;${Colors[geneData[gene[i] as Gene].color]}m█\x1b[0m`;
        else
            tmp += `\x1b[38;5;${Colors[geneData[gene[i] as Gene].color]}m${gene[i]}\x1b[0m`;
    }
    return tmp;
}

export const countGene = (strain: string): {[key: string]: number} => {
    let geneMap: {[key: string]: number} = {}
    for(let i = 0; i < strain.length; i++){
        if(geneMap[strain[i]]) geneMap[strain[i]]++;
        else geneMap[strain[i]] = 1;
    }
    return geneMap;
}

export const geneInfoHelperString = () => {

}

export const strainCompare = (s1: string, s2:string): boolean => {
    const s1Sorted = s1.split("").sort().join("");
    const s2Sorted = s2.split("").sort().join("");
    return s1Sorted === s2Sorted;
}