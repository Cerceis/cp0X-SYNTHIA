import { Game } from "./game";
import { VisualComponent } from "./visualComponent";
import { quickText } from "./components/quickText";
import {
	comGarden, genNewHelper, comTime,
    comShop, user
} from "./components";
import { save, load } from "./system";
import { PlantEntity } from "./components/plantEntity";


export const commandList: string = `
=== General ===
?: Show list of commands.
save: Save game.
load: Load game.
weather report: Show weather report.

=== User ===
bag: List your inventory.
    
=== Garden ===
learn garden: Check this out if you want to learn more about the Garden.
check: Check out all the plants in the garden. (Gives lesser info
: than specific check)
check [row] [col]: Check out the plant in the plot. (Gives more info)
plow [row] [col]: Plow your garden. Ex) plow 2 2
plow hire help: Spend 100 G PER plot to hire a helper to plow
: your entire garden. (Current total ${comGarden.size * comGarden.size * 100} G)
plant [id] [row] [col]: Plant to a plowed plot.(id is the id in your bag).
water [row] [col]: Water your plant.
harvest [row] [col]: Harvest plant.
destroy [row] [col]: Destory plant.

=== Shop ===
learn shop: Check this out if you want to learn more about the Shop.
shop: Show list of items available to purchase.
shop verbose: Show list of items with more information.
buy [id] [amount]: Buy item (id is the id listed in shop).
sell [id] [amount]: Sell item (id is the id in your bag).

=== Genetics ===
learn genetic: Check this out if you want to learn more about Genetics.
gene: Show a quick reference of all genes.
`;

export const applyCommands = (input: string[]) => {
    try{
        // General
        if(input.length === 1 && input[0] === "?") genNewHelper();
        if(input.length === 1 && input[0] === "save") save();
        if(input.length === 1 && input[0] === "load") load();
        if(input[0] === "weather" && input[1] === "report"){
            quickText(comTime.generateWeatherReport());
        }

        // User
        if(
            input.length === 1 && input[0] === "bag"){
            user.setState("bag");
            VisualComponent.show(["user"]);
        }

        // Garden
        if(
            input.length === 1 &&
            input[0] === "check"
        ){
            comGarden.checkoutAll();
        }
        if(
            input.length === 3 &&
            input[0] === "check" &&
            !isNaN(Number(input[1])) && 
            !isNaN(Number(input[2]))
        ){
            comGarden.checkout(Number(input[1]), Number(input[2]));
        }
        if(
            input[0] === "plow" &&
            !isNaN(Number(input[1])) && 
            !isNaN(Number(input[2]))
        ){
            comGarden.plow(Number(input[1]), Number(input[2]));
        }

        if(
            input[0] === "plow" && 
            input[1] === "hire" &&
            input[2] === "help"
        ){
            const cost: number = comGarden.size * comGarden.size * 100;
            if(user.gold < cost)
                quickText(`You have not enough gold. ( ${user.gold} G )`);
            else{
                user.gold -= cost;
                for(let row = 0; row < comGarden.size; row++)
                    for(let cell = 0; cell < comGarden.size; cell++)
                        comGarden.plow(row, cell, true);
                quickText(`All done! That cost you ${cost} G (Remaining: ${user.gold} G)`);
            }
        }
        if(
            input.length === 4 &&
            input[0] === "plant" && 
            input[1] && // id
            !isNaN(Number(input[2])) && // row
            !isNaN(Number(input[3])) // col
        ){
            const targetItem = user.getItemById(input[1]);
            if(!targetItem){
                quickText(`Item with id: ${input[1]} not found.`);
                throw new Error();
            }
            const done = comGarden.plant(targetItem.entity, Number(input[2]), Number(input[3]));
            if(done) user.removeItemByCount(input[1], 1);
        }
        if(
            input.length === 3 &&
            input[0] === "water" &&
            !isNaN(Number(input[1])) && 
            !isNaN(Number(input[2]))
        ){
            comGarden.water(Number(input[1]), Number(input[2]));
        }
        if(
            input.length === 3 &&
            input[0] === "harvest" &&
            !isNaN(Number(input[1])) && 
            !isNaN(Number(input[2]))
        ){
            const target = comGarden.harvest(Number(input[1]), Number(input[2]));
            if(!target && target === false) quickText(`Unexpected error occured[123]`);
            if(target && (target as PlantEntity).harvestedYield) user.addItemToBag(target as PlantEntity, (target as PlantEntity).harvestedYield);
        }
        if(
            input.length === 3 &&
            input[0] === "destory" &&
            !isNaN(Number(input[1])) && 
            !isNaN(Number(input[2]))
        ){
            comGarden.destory(Number(input[1]), Number(input[2]));
        }

        // Shop
        if( input.length === 1 && input[0] === "shop"){
            comShop.setState("menu");
            VisualComponent.show(["shop"])
        }
        if( input.length === 2 && input[0] === "shop" && input[1] === "verbose"){
            comShop.setState("menuVerbose");
            VisualComponent.show(["shop"])
        }
        if( 
            input.length === 3 &&
            input[0] === "buy" &&
            input[1] && !isNaN(Number(input[2]))
        ){
            const targetItemId: string = input[1];
            const targetCount: number = Number(input[2]);
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
            user.addItemToBag(targetItem.entity, targetCount);
            comShop.removeItemByCount(targetItemId, targetCount);
            user.gold -= cost;
            quickText(`Bought ${targetCount} ${targetItem.entity.name} for ${cost} G!`)
        }
        if( 
            input.length === 3 &&
            input[0] === "sell" &&
            input[1] && !isNaN(Number(input[2]))
        ){
            const targetItemId: string = input[1];
            const targetCount: number = Number(input[2]);
            const targetItem = user.getItemById(targetItemId);
            if(!targetItem){
                quickText(`Item not found, ID:${targetItemId}`)
                throw new Error();
            }
            const profit: number = targetItem.entity.value * targetCount;
            user.gold += profit;
            user.removeItemByCount(targetItemId, targetCount);
            quickText(`Sold ${targetCount} ${targetItem.entity.name} for ${profit} G!`)
        }

        if(input[0] === "debug"){
            const targetItemId: string = "0001";
            const targetCount: number = 1;
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
            user.addItemToBag(targetItem.entity, targetCount);
            comShop.removeItemByCount(targetItemId, targetCount);
            user.gold -= cost;
            comGarden.plow(2, 2);
            const targetItem2 = user.getItemById("0000");
            if(!targetItem2){
                quickText(`Item with id: ${"0000"} not found.`);
                throw new Error();
            }
            const done = comGarden.plant(targetItem2.entity, 2, 2);
            if(done) user.removeItemByCount("0000", 1);
        }

        Game._previousInput = Game._input;
        Game.clearGameInput();
    }catch(err: any){
        quickText(err); // Only used in development
        Game._previousInput = Game._input;
        Game.clearGameInput();
    }
    
}