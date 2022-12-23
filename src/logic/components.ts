import { VisualComponent } from "./visualComponent";
import { TimeController } from "./components/time";
import { Garden } from "./components/garden";
import { User } from "./user";
import { commandList } from "./commands";
import { stringAutoSpacer } from "../functions/stringFunctions";
import { Shop } from "./components/shop";
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
export const comCurrentMoney = new VisualComponent({
    label: "currentMoney",
    text: () => `Your wallet: ${user.gold} G`,
})
export const comTime = new TimeController({
	label: "time",
})
// Garden 
export const comGarden = new Garden({
	label: "playerGarden",
	name: "Eternal Garden",
	size: 5,
});
export const genNewHelper = () => {
    return new VisualComponent({
        label: "commandHelper",
        text: () => stringAutoSpacer(commandList(), " "),
        destoryOnNextCycle: true,
    });
}
export const comShop = new Shop({
    label: "shop",
    noRenderOnCreate: true,
    hideOnNextCycle: true,
})
export let user = new User({
    label: "user",
	name: "Unknown",
    noRenderOnCreate: true,
    hideOnNextCycle: true,
});


