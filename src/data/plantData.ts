/**
 * General rule, base sell value is always 2x the cost.
 */
export interface PlantData{
    id: string,
    name: string,
    description: string,
    symbol: string,
    baseYield: number, // count.
    baseGrowth: number, // in Hours.
    baseTempLow: number, // Celsius
    baseTempHigh: number, // Celsius
}
export const plantData: PlantData[] = [
    {
        id: "001",
        name: "Apple",
        description: "An apple tree, takes quite some time to grow.",
        symbol: "AT",
        baseYield: 200,
        baseGrowth: 8640 * 4, // 4 years
        baseTempLow: 6,
        baseTempHigh: 14,
    },
    {
        id: "002",
        name: "Orange",
        description: "An orange tree, takes quite some time to grow. But worth it.",
        symbol: "OT",
        baseYield: 150,
        baseGrowth: 8640 * 3, // 3 years
        baseTempLow: 10,
        baseTempHigh: 18,
    },
    {
        id: "002",
        name: "Strawberry",
        description: "Red. Sweet. Juicy.",
        symbol: "SB",
        baseYield: 30,
        baseGrowth: 720 * 3, // 3 months
        baseTempLow: 15,
        baseTempHigh: 26,
    },
    {
        id: "003",
        name: "Blueberry",
        description: "Small round berries. Takes quite some time to mature.",
        symbol: "BB",
        baseYield: 7,
        baseGrowth: 8640 * 2, // 2 years
        baseTempLow: 20,
        baseTempHigh: 26,
    },
    {
        id: "004",
        name: "TestPlant",
        description: "0w0.",
        symbol: "DE",
        baseYield: 7,
        baseGrowth: 12, // 2 years
        baseTempLow: 10,
        baseTempHigh: 26,
    },
]