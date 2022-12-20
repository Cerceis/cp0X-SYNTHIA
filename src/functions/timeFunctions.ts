export const hoursToReadable = (inputHour: number) => {
    let strResult: string = "";
    let tp = inputHour;
    const year = Math.floor(tp / 8640);
    tp -= 8640 * year;
    if(year && year > 0) strResult += `${year} Years `;
    //
    let month = Math.floor(tp / 720);
    tp -= 720 * month;
    if(month && month > 0) strResult += `${month} Months `;
    //
    let day = Math.floor(tp / 24);
    tp -= 24 * day;
    if(day && day > 0) strResult += `${day} Days `;
    //
    const hour = tp;
    if(hour && hour > 0) strResult += `${hour} Hours`;
    return strResult.trim();
}