import { print } from "./src/functions/visuals";
import { askSelection } from "./src/functions/inputs";
import { Delay, Generate } from "cerceis-lib";

(async () => {
	while(true){
		print("WELCOME, I am SYNTHIA, your farm assistant.");
		console.log(Generate.currentDateTime());
		console.log("---------------------------------------");
		console.log("[1] Shop  [2] Info  [3] System")
		console.log("---------------------------------------");
		console.log(`
			 0   1   2   3   4 

		0	[AT][AP][AP][AP][AP]
		1	[BG][AP][AP][AP][AP]
		2	[░░][░░][AP][AP][AP]
		3	[░░][░░][AP][AP][AP]
		4	[AP][AP][AP][AP][AP]
		`)
		await Delay(100);
	}	
})();