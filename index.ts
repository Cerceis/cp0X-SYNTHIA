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
			[AT][AP][AP][AP][AP]
			[BG][AP][AP][AP][AP]
			[AP][AP][AP][AP][AP]
			[AP][AP][AP][AP][AP]
			[AP][AP][AP][AP][AP]
		`)
		await Delay(100);
	}	
})();