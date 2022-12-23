import { VisualComponent } from "../visualComponent";
import { Generate } from "cerceis-lib";
/**
 * To print something fast.
 * quickText will always destroy on next cycle.
 * @param str 
 * @returns 
 */
export const quickText = (str: string) => {
	return new VisualComponent({
		label: Generate.objectId(),
		text:() => `${str}`,
		destoryOnNextCycle: true
	})
}
