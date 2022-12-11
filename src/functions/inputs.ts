import { createInterface } from "readline";

const newInterface = () => createInterface({input: process.stdin, output: process.stdout});

export const askSelection = () => {
	const selection = newInterface();
	
	selection.question("Where do you live ? ", function(country) {
		console.log(`8is a citizen of ${country}`);
		selection.close();
	});
	 
	
	selection.on("close", function() {
		console.log("\nBYE BYE !!!");
		// return answer
	});
	
}