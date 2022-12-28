export const stringAutoSpacer = (str: string, extra: string = "") => {
    const line = str.split("\n");
    let maxSpacing = 0;
    for(let i = 0; i < line.length; i++){
        const lineSection = line[i].split(":");
        if(lineSection.length !== 2) continue;
        if(lineSection[0].length > maxSpacing)
            maxSpacing = lineSection[0].length;
    }
    
    for(let i = 0; i < line.length; i++){
        const lineSection = line[i].split(":");
        if(lineSection.length !== 2) continue;
        const spaces = (new Array(maxSpacing - lineSection[0].length + 1)).join(" ");
        lineSection[0].trim();
        line[i] = lineSection[0] + spaces + extra + ":" + lineSection[1];
    }
    return line.join("\n");
}

export const stringBoxer = (str: string, maxWidth: number = 50) => {
    const input = str.replace(/\n/g, "");
    const linePadding = new Array(maxWidth+2).fill("-").join("");
    let line = `┌${linePadding}┐\n: │ `;
    let currentX = 0;
    for(let i = 0; i < input.length; i++) {
        if(currentX === maxWidth){
            currentX = 0;
            line += " │\n: │ ";
        }
        if(currentX === 0 && input[i] === " "){
            continue;
        }
        line += `${input[i]}`
        currentX ++;
    }
    if(maxWidth > currentX)
        line += `${new Array(maxWidth - currentX).fill(" ").join("")} │`;

    line += `\n: └${linePadding}┘\n`
    //┘	┐	┌	└ -
    return line;
}

