import { Generate } from "cerceis-lib";

export interface VisualComponentContructorOptions{
	label: string,
	text?: Function,
	destoryOnNextCycle?: boolean,
	noRenderOnCreate?: boolean,
}

/**
 * New visual components are automatically added
 * into the render list.
 */
export class VisualComponent{

	static components: VisualComponent[] = [];

	private _id: string;
	public allowRender: boolean = true;
	
	public destoryOnNextCycle: boolean = false;
	public text: Function;
	public label: string;

	constructor(options: VisualComponentContructorOptions){	
		this._id = Generate.objectId();
		this.label = options.label;
		this.text= options.text ?? (() => "");
		if(options.destoryOnNextCycle !== undefined)
			this.destoryOnNextCycle = options.destoryOnNextCycle;
		if(options.noRenderOnCreate !== undefined && options.noRenderOnCreate)
			this.allowRender = false;
		VisualComponent.components.push(this);
	}
	
	static render(){
		for(let i = 0; i < VisualComponent.components.length; i++){
			if(VisualComponent.components[i].allowRender === false) continue;
			console.log(VisualComponent.components[i].text())
			if(VisualComponent.components[i].destoryOnNextCycle){
				VisualComponent.components.splice(i,1);
				return;
			}
		}
	}
	/**
	 * Allow the sorted components component to be render by default.
	 * Disable render for all other component to be render by default.
	 * @param labels 
	 */
	static sortComponent(labels:string[]){
		const inputLabels: (string | VisualComponent)[] = [...labels];
		for(let i = 0; i < VisualComponent.components.length; i++){
			let found: boolean = false;
			VisualComponent.components[i].allowRender = false;
			for(let j = 0; j<inputLabels.length; j++){
				if(VisualComponent.components[i].label === inputLabels[j]){
					VisualComponent.components[i].allowRender = true;
					inputLabels[j] = VisualComponent.components[i];
					found = true;
					break;
				}
			}
			if(found) continue;
			inputLabels.push(VisualComponent.components[i]);
		}
		VisualComponent.components = inputLabels as VisualComponent[];
	}
	
	/**
	 * Show all selected components
	 * Can pass options to auto hide all others
	 * @param labels 
	 */
	static show(labels:string[], hideOther: boolean = false){
		for(let i = 0; i < VisualComponent.components.length; i++){
			if(labels.includes(VisualComponent.components[i].label)){
				VisualComponent.components[i].allowRender = true;
			}
			else if(hideOther){
				VisualComponent.components[i].allowRender = false;
			}
		}
	}
}
