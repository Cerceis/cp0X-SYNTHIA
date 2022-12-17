import { VisualComponent } from "../visualComponent";

/**
 * To print something fast.
 * quickText will always destroy on next cycle.
 * @param str 
 * @returns 
 */
export const quickText = (str: string) => {
	return new VisualComponent({
		label: "quickText",
		text:() => str,
		destoryOnNextCycle: true
	})
}