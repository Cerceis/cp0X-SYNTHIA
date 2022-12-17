import { user } from "./user";
import { Game } from "./game";
import { VisualComponent } from "./visualComponents/visualComponent";
import { quickText } from "./visualComponents/components/quickText";
import {
	comGarden
} from "./visualComponents/components/components";

export const applyCommands = (input: string[]) => {
	if(!input || input.length <= 0) return;

	if(input[0] === "?"){
		VisualComponent.show(["commandHelper"]);
	}

	if(
		input[0] === "plow" &&
		!isNaN(Number(input[1])) && 
		!isNaN(Number(input[2]))
	){
		comGarden.plow(Number(input[1]), Number(input[2]));
	}

	if(input[0] === "money"){
		new VisualComponent({
			label: "currentMoney",
			text: () => `Your wallet: ${user.gold} G`,
			destoryOnNextCycle: true,
		})
	}

	if(
		input[0] === "plow" && 
		input[1] === "hire" &&
		input[2] === "help"
	){
		const cost: number = 1000;
		if(user.gold < cost)
			quickText(`You have not enough gold. ( ${user.gold} G )`);
		else{
			user.gold -= cost;
			for(let row = 0; row < comGarden.size; row++)
				for(let cell = 0; cell < comGarden.size; cell++)
					comGarden.plow(row, cell);
			quickText(`All done! That cost you ${cost} G (Remaining: ${user.gold} G)`);
		}
	}

	if(input[0] === "debug3"){
		VisualComponent.sortComponent(["playerGarden", "commandHelper"]);
	}

	Game.clearGameInput();
}