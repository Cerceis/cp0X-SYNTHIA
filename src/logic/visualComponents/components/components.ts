import { VisualComponent } from "../visualComponent";
import { Garden } from "../../visualComponents/components/garden";
/**
 * All components are added here so that we
 * can just refer to this single file.
 */
// Create and add some basic components
// Header
export const comHeader = new VisualComponent({
	label: "header",
	text:() => {
		return `Welcome to your garden - ${comGarden.name}`;
	}
})
export const comDivider1 = new VisualComponent({
	label: "divider1",
	text: () => "---------------------------------------------",
})
// Garden 
export const comGarden = new Garden({
	label: "playerGarden",
	name: "Eternal Garden",
	size: 5,
});
export const comDivider2 = new VisualComponent({
	label: "divider1",
	text: () => "---------------------------------------------",
})
export const comHelper = new VisualComponent({
	label: "commandHelper",
	text: () => `
=== General ===
?               : Show help.
money           : Show your current money.
 
=== Garden ===
plow [row][col] : Plow your garden. Ex) plow 2 2
plow hire help  : Spend 100 G PER plot to hire a helper to plow
                  your entire garden. (Current total ${comGarden.size * comGarden.size * 100} G)

	`,
	destoryOnNextCycle: true,
	noRenderOnCreate: true,
});