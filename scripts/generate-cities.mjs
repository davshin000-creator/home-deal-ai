import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const projectRoot = resolve(currentDirectory, "..");
const outputPath = resolve(projectRoot, "data", "cities.ts");

const cities = [
  {
    slug: "irvine",
    city: "Irvine",
    state: "California",
    stateCode: "CA",
    medianPrice: 1583000,
    averageRent: 4740,
    investmentScore: 82,
  },
  {
    slug: "los-angeles",
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    medianPrice: 975000,
    averageRent: 3650,
    investmentScore: 74,
  },
  {
    slug: "san-diego",
    city: "San Diego",
    state: "California",
    stateCode: "CA",
    medianPrice: 1015000,
    averageRent: 3400,
    investmentScore: 76,
  },
  {
    slug: "san-francisco",
    city: "San Francisco",
    state: "California",
    stateCode: "CA",
    medianPrice: 1290000,
    averageRent: 4100,
    investmentScore: 68,
  },
  {
    slug: "san-jose",
    city: "San Jose",
    state: "California",
    stateCode: "CA",
    medianPrice: 1420000,
    averageRent: 3900,
    investmentScore: 72,
  },
  {
    slug: "sacramento",
    city: "Sacramento",
    state: "California",
    stateCode: "CA",
    medianPrice: 525000,
    averageRent: 2350,
    investmentScore: 79,
  },
  {
    slug: "anaheim",
    city: "Anaheim",
    state: "California",
    stateCode: "CA",
    medianPrice: 905000,
    averageRent: 3250,
    investmentScore: 73,
  },
  {
    slug: "long-beach",
    city: "Long Beach",
    state: "California",
    stateCode: "CA",
    medianPrice: 820000,
    averageRent: 2950,
    investmentScore: 75,
  },
  {
    slug: "austin",
    city: "Austin",
    state: "Texas",
    stateCode: "TX",
    medianPrice: 560000,
    averageRent: 2250,
    investmentScore: 78,
  },
  {
    slug: "dallas",
    city: "Dallas",
    state: "Texas",
    stateCode: "TX",
    medianPrice: 410000,
    averageRent: 2100,
    investmentScore: 81,
  },
  {
    slug: "houston",
    city: "Houston",
    state: "Texas",
    stateCode: "TX",
    medianPrice: 340000,
    averageRent: 1900,
    investmentScore: 83,
  },
  {
    slug: "san-antonio",
    city: "San Antonio",
    state: "Texas",
    stateCode: "TX",
    medianPrice: 305000,
    averageRent: 1750,
    investmentScore: 80,
  },
  {
    slug: "miami",
    city: "Miami",
    state: "Florida",
    stateCode: "FL",
    medianPrice: 640000,
    averageRent: 3200,
    investmentScore: 77,
  },
  {
    slug: "orlando",
    city: "Orlando",
    state: "Florida",
    stateCode: "FL",
    medianPrice: 395000,
    averageRent: 2200,
    investmentScore: 84,
  },
  {
    slug: "tampa",
    city: "Tampa",
    state: "Florida",
    stateCode: "FL",
    medianPrice: 425000,
    averageRent: 2300,
    investmentScore: 82,
  },
  {
    slug: "phoenix",
    city: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    medianPrice: 470000,
    averageRent: 2100,
    investmentScore: 80,
  },
  {
    slug: "las-vegas",
    city: "Las Vegas",
    state: "Nevada",
    stateCode: "NV",
    medianPrice: 455000,
    averageRent: 2050,
    investmentScore: 79,
  },
  {
    slug: "denver",
    city: "Denver",
    state: "Colorado",
    stateCode: "CO",
    medianPrice: 610000,
    averageRent: 2550,
    investmentScore: 75,
  },
  {
    slug: "atlanta",
    city: "Atlanta",
    state: "Georgia",
    stateCode: "GA",
    medianPrice: 430000,
    averageRent: 2200,
    investmentScore: 83,
  },
  {
    slug: "charlotte",
    city: "Charlotte",
    state: "North Carolina",
    stateCode: "NC",
    medianPrice: 405000,
    averageRent: 2050,
    investmentScore: 84,
  },
];

const fileContents = `export type CityMarket = {
  slug: string;
  city: string;
  state: string;
  stateCode: string;
  medianPrice: number;
  averageRent: number;
  investmentScore: number;
};

export const cities: CityMarket[] = ${JSON.stringify(cities, null, 2)};
`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, fileContents, "utf8");

console.log(`Generated ${cities.length} cities at:`);
console.log(outputPath);