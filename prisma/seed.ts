import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pirates = [
  "Ironbeard", "Stormfist", "Wavecutter", "Goldtooth", "Thunderjaw",
  "Sharpshot", "Blazecook", "Bonedoc", "Oakhand", "Seawhisper",
  "Nighteye", "Cannonblast", "Redmane", "Silveredge", "Tidereader",
  "Pepperflame", "Naildriver", "Drumtide", "Windbreaker", "Tombkeeper",
  "Crowsnest", "Brassbarrel", "Coinspin", "Bladefury", "Starpoint",
  "Deadaim", "Grillmaster", "Stitchbone", "Plankwalker", "Fiddle",
  "Ruddergrip", "Relicfinder", "Falconeye", "Powderkeg", "Silkpurse",
  "Scarjaw", "Cutlass", "Driftwood", "Longshot", "Sauceboss",
  "Salvehand", "Hammerdown", "Shantyking", "Keelhaul", "Bonedigger",
  "Skyscope", "Flintlock", "Pearltrader", "Blacktide", "GrandLineDrake",
];

const types = [
  "Captain", "Navigator", "Gunner", "Cook", "Doctor",
  "Shipwright", "Lookout", "Quartermaster", "Boatswain", "Musician",
];

const descriptions: Record<string, string> = {
  Captain: "A fearless leader who commands the crew with iron will and unwavering resolve on the Grand Line.",
  Navigator: "A master of the seas who reads the stars and currents to chart safe passage through treacherous waters.",
  Gunner: "A deadly marksman whose cannons roar like thunder, striking fear into enemy vessels from afar.",
  Cook: "A culinary genius who keeps the crew fed and fighting with legendary meals prepared in the galley.",
  Doctor: "A skilled healer who mends wounds and cures ailments, keeping the crew alive through every battle.",
  Shipwright: "A master craftsman who keeps the ship seaworthy through storms, battles, and the ravages of the sea.",
  Lookout: "A keen-eyed sentinel perched in the crow's nest, spotting danger and opportunity on the horizon.",
  Quartermaster: "A shrewd organizer who manages the ship's supplies, treasure, and distribution of plunder.",
  Boatswain: "A hardened sailor who maintains discipline and oversees the deck crew's daily duties.",
  Musician: "A spirited performer whose shanties boost morale and keep the crew rowing in unison.",
};

async function main() {
  await prisma.slot.deleteMany();

  for (let i = 0; i < pirates.length; i++) {
    const name = pirates[i];
    const type = types[i % types.length];
    const symbol = `$${name.toUpperCase().slice(0, 6)}`;
    await prisma.slot.create({
      data: {
        name,
        symbol,
        image: `/pirates/${name.toLowerCase()}.png`,
        type,
        description: descriptions[type],
        status: "available",
      },
    });
  }

  console.log("Seeded 50 pirate slots");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
