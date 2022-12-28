import { Game } from "./game";
import { VisualComponent } from "./visualComponent";
import { quickText } from "./components/quickText";
import {
	comGarden, genNewHelper, comTime,
    comShop, user
} from "./components";
import { save, load, saveOptions } from "./system";
import { PlantEntity } from "./components/plantEntity";
import { colorString } from "../functions/gene";

export const commandList = () => `
=== ${colorString("General", "Green")}  =============================================
?: Show list of commands.
save: Save game.
save set [name]: Set autosave and future save to specific filename (Currently "${saveOptions.filename}").
load: Load game.
weather report: Show weather report.

===   ${colorString("User", "Green")}   =============================================
bag: List your inventory.
    
===  ${colorString("Garden", "Green")}  =============================================
learn garden: Check this out if you want to learn more about the Garden.
learn plants: Check this out if you want to learn more about the Plants.
check: Check out all the plants in the garden. (Gives lesser info
: than specific check)
check [row] [col]: Check out the plant in the plot. (Gives more info)
pl [row] [col]: Plow your garden. Ex) plow 2 2
pl hire help: Spend ${colorString("10 G", "Yellow")} PER plot to hire a helper to plow
: your entire garden. (Current total ${colorString(`${comGarden.checkAutoPlowCost()}`, "Yellow")} G)
p [id] [row] [col]: Plant to a plowed plot.(id is the id in your bag).
w [row] [col]: Water your plant.
w hire help: Spend ${colorString("2 G", "Yellow")} PER plot to hire a helper to water
: your entire garden. (Current total ${colorString(`${comGarden.checkAutoWaterCost()}`, "Yellow")} G)
h [row] [col]: Harvest plant.
h hire help: Spend ${colorString("10 G", "Yellow")} PER plot to hire a helper to harvest
: your entire garden. (Current total ${colorString(`${comGarden.checkAutoHarvestCost()}`, "Yellow")} G)
destroy [row] [col]: Destory plant.

===   ${colorString("Shop", "Green")}   =============================================
learn shop: Check this out if you want to learn more about the Shop.
shop: Show list of items available to purchase.
shop verbose: Show list of items with more information.
buy [id] [amount]: Buy item (id is the id listed in shop).
sell [id] [amount]: Sell item (id is the id in your bag).

=== ${colorString("Genetics", "Green")} =============================================
learn genetic: Check this out if you want to learn more about Genetics.
gene: Show a quick reference of all genes.
`;

export const learnString: {[key: string]: string} = {
garden: `
Garden is where you plant your sutff, duh.

=== Plot ===
Plot are always specified by [row] [col];
Each plot must be plowed before planting anything.
There's 3 component in each plot
- Square brackets [] : Represent the Humidity of the plant with color.
- Brackets () : Represent the Growth Rate of the plant with color.
- Symbol : Represent what plants it is and its color represents its health.

Plants has humidity. Which will decrease overtime.
Low humidity = lower grow rate.

`
}

const isNumber = (x: any) => Object.prototype.toString.call(x) === "[object Number]";
// To check if its a number use -1,
// To check if its a specific number use any number than -1;
const cmdCheck = (cmd: string[], arr: (string|number)[]): boolean => {
    if(cmd.length !== arr.length) return false;
    for(let i = 0; i < arr.length; i++) {
        let targetCmd: string | number = cmd[i];
        if(arr[i] ===  "any") continue;
        if(arr[i] === -1 && !isNaN(Number(targetCmd))) continue;
        if(isNumber(arr[i])) targetCmd = Number(targetCmd);
        if(targetCmd !== arr[i]) return false;
    }
    return true;
}
export const applyCommands = (cmd: string[], noRecord: boolean = false): any => {
    try{
        const preCmd = noRecord ? Game._input : Game._previousInput;
        let repeatPrevious: boolean = false;
        // General
        if(cmdCheck(cmd, ["?"])) genNewHelper();
        if(cmdCheck(cmd, ["save"])) save();
        if(cmdCheck(cmd, ["load"])) load();
        if(cmdCheck(cmd, ["weather","report"])){
            quickText(comTime.generateWeatherReport());
        }
        // General END

        // User
        if(cmdCheck(cmd, ["bag"])){
            user.setState("bag");
            VisualComponent.show(["user"]);
        }
        // User END

        // Garden
        
        if(cmdCheck(cmd, ["learn", "garden"])) quickText(learnString.garden);
        if(cmdCheck(cmd, ["check"])) comGarden.checkoutAll();
        if(cmdCheck(cmd, ["check", -1, -1])){
            comGarden.checkout(Number(cmd[1]), Number(cmd[2]));
        }
        if(cmdCheck(cmd, ["pl", -1, -1])){
            comGarden.plow(Number(cmd[1]), Number(cmd[2]));
        }
        if(cmdCheck(cmd, ["pl", "hire", "help"])){
            const cost: number = comGarden.checkAutoPlowCost();
            if(user.gold < cost) quickText(`You have not enough gold. ( ${user.gold} G )`);
            else{
                user.gold -= cost;
                comGarden.auto("plow");
                quickText(`All done! That cost you ${cost} G (Remaining: ${user.gold} G)`);
            }
        }
        if(cmdCheck(cmd, ["p", "any", -1, -1])){
            const targetItem = user.getItemById(cmd[1]);
            if(!targetItem){
                quickText(`Item with id: ${cmd[1]} not found.`);
                throw new Error();
            }
            const done = comGarden.plant(targetItem.entity, Number(cmd[2]), Number(cmd[3]));
            if(done) user.removeItemByCount(cmd[1], 1);
            if(cmdCheck(preCmd, ["bag"])) repeatPrevious = true;
        }
        if(cmdCheck(cmd, ["w", -1, -1]))
            comGarden.water(Number(cmd[1]), Number(cmd[2]));
        if(cmdCheck(cmd, ["w", "hire", "help"])){
            const cost: number = comGarden.checkAutoWaterCost();
            if(user.gold < cost) quickText(`You have not enough gold. ( ${user.gold} G )`);
            else{
                user.gold -= cost;
                comGarden.auto("water");
                quickText(`All done! That cost you ${cost} G (Remaining: ${user.gold} G)`);
            }
        }
        if(cmdCheck(cmd, ["h", -1, -1])){
            const target = comGarden.harvest(Number(cmd[1]), Number(cmd[2]));
            if(!target && target === false) quickText(`Unexpected error occured[123]`);
            if(target && (target as PlantEntity).harvestedYield) user.addItemToBag(target as PlantEntity, (target as PlantEntity).harvestedYield);
        }
        if(cmdCheck(cmd, ["h", "hire", "help"])){
            const cost: number = comGarden.checkAutoHarvestCost();
            if(user.gold < cost) quickText(`You have not enough gold. ( ${user.gold} G )`);
            else{
                user.gold -= cost;
                comGarden.auto("harvest");
                quickText(`All done! That cost you ${cost} G (Remaining: ${user.gold} G)`);
            }
        }
        if(cmdCheck(cmd, ["destroy", -1, -1])){
            comGarden.destory(Number(cmd[1]), Number(cmd[2]));
        }
        // Garden END

        // Shop
        if(cmdCheck(cmd, ["shop"])){
            comShop.setState("menu");
            VisualComponent.show(["shop"])
        }
        if(cmdCheck(cmd, ["shop", "verbose"])){
            comShop.setState("menuVerbose");
            VisualComponent.show(["shop"])
        }
        if(cmdCheck(cmd, ["buy", "any", -1])){
            const targetItemId: string = cmd[1];
            const targetCount: number = Number(cmd[2]);
            const targetItem = comShop.getItemById(targetItemId);
            if(!targetItem){
                quickText(`Item not found, ID:${targetItemId}`)
                throw new Error();
            }
            const cost = targetItem.entity.cost * targetCount;
            if(user.gold < cost){
                quickText(`You don't have enough gold. Need ${cost} G, currently have ${user.gold} G.`)
                throw new Error();
            }
            if(targetItem.count < targetCount){
                quickText(`Please specify amount between 1 ~ ${targetItem.count}.`)
                throw new Error();
            }
            user.addItemToBag(targetItem.entity, targetCount);
            comShop.removeItemByCount(targetItemId, targetCount);
            user.gold -= cost;
            quickText(`Bought ${targetCount} ${targetItem.entity.name} for ${cost} G!`)
            if(cmdCheck(preCmd, ["shop"]) || cmdCheck(preCmd, ["shop", "verbose"]))
                repeatPrevious = true;
        }
        if(cmdCheck(cmd, ["sell", "any", -1])){
            const targetItemId: string = cmd[1];
            const targetCount: number = Number(cmd[2]);
            const targetItem = user.getItemById(targetItemId);
            if(!targetItem){
                quickText(`Item not found, ID:${targetItemId}`)
                throw new Error();
            }
            const profit: number = targetItem.entity.value * targetCount;
            user.gold += profit;
            user.removeItemByCount(targetItemId, targetCount);
            quickText(`Sold ${targetCount} ${targetItem.entity.name} for ${profit} G!`)
            if(cmdCheck(preCmd, ["bag"])) repeatPrevious = true;
        }
        // Shop END

        // Genetics
        if(cmdCheck(cmd, ["extract", "any"])){
            const targetItemId: string = cmd[1];
            const targetCount: number = Number(1);
            const targetItem = user.getItemById(targetItemId);
            if(!targetItem){
                quickText(`Item not found, ID:${targetItemId}`)
                throw new Error();
            }
        
        }
        // Genetics END

        if(cmdCheck(cmd, ["debug"])){
            quickText("0w0")
            quickText("0w02")
        }

        if(Game._input && Game._input.length > 0)
            Game._previousInput = Game._input;
        if(repeatPrevious){
            return applyCommands(preCmd, true);
        }
 
        Game.clearGameInput();
    
    }catch(err: any){
        quickText(err); // Only used in development
        Game._previousInput = Game._input;
        Game.clearGameInput();
    }
}