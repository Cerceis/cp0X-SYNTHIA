import { Generate } from "cerceis-lib";

export interface VisualComponentContructorOptions{
	label: string,
	text?: Function,
	destoryOnNextCycle?: boolean,
	noRenderOnCreate?: boolean,
}

export class VisualComponent{

	static components: VisualComponent[] = [];

	private _id: string;
	private _allowRender: boolean = true;
	
	public destoryOnNextCycle: boolean = false;
	public text: Function;
	public label: string;

	constructor(options: VisualComponentContructorOptions){	
		this._id = Generate.objectId();
		this.label = options.label;
		this.text= options.text ?? (() => "");
		this.destoryOnNextCycle = options.destoryOnNextCycle ?? false;
		VisualComponent.components.push(this);
	}
	
	static renderAll(){
		for(let i = 0; i < VisualComponent.components.length; i++){
			console.log(VisualComponent.components[i].text())
			if(VisualComponent.components[i].destoryOnNextCycle){
				VisualComponent.components.splice(i,1);
				return;
			}
		}
	}

	static rearrangeComponents(labels:string[]){
		const tmp = new Array(labels.length);
		for(let i = 0; i < VisualComponent.components.length; i++){
			//if(includes(VisualComponent.components[i].label))
		}
	}
}