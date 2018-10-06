"use strict";

const { Stats } = require("../Stat");

const Races = {
  Aasimar: {
    Fallen: { name: "Aasimar", sub: "Fallen" },
    Protector: { name: "Aasimar", sub: "Protector" },
    Scourge: { name: "Aasimar", sub: "Scourge" }
  },
  Bugbear: { name: "Bugbear" },
  Dragonborn: {
    Black: { name: "Dragonborn", sub: "Black" },
    Blue: { name: "Dragonborn", sub: "Blue" },
    Brass: { name: "Dragonborn", sub: "Brass" },
    Bronze: { name: "Dragonborn", sub: "Bronze" },
    Copper: { name: "Dragonborn", sub: "Copper" },
    Gold: { name: "Dragonborn", sub: "Gold" },
    Green: { name: "Dragonborn", sub: "Green" },
    Red: { name: "Dragonborn", sub: "Red" },
    Silver: { name: "Dragonborn", sub: "Silver" },
    White: { name: "Dragonborn", sub: "White" }
  },
  Dwarf: {
    Duergar: { name: "Dwarf", sub: "Duergar" },
    Hill: { name: "Dwarf", sub: "Hill" },
    Mountain: { name: "Dwarf", sub: "Mountain" }
  },
  Elf: {
    Eladrin: { name: "Elf", sub: "Eladrin" },
    Drow: { name: "Elf", sub: "Drow" },
    High: { name: "Elf", sub: "High" },
    Sea: { name: "Elf", sub: "Sea" },
    "Shadar-Kai": { name: "Elf", sub: "Shadar-Kai" },
    Wood: { name: "Elf", sub: "Wood" }
  },
  Firbolg: { name: "Firbolg" },
  Genasi: {
    Air: { name: "Genasi", sub: "Air" },
    Earth: { name: "Genasi", sub: "Earth" },
    Fire: { name: "Genasi", sub: "Fire" },
    Water: { name: "Genasi", sub: "Water" }
  },
  Gith: {
    Githyanki: { name: "Gith", sub: "Githyanki" },
    Githzerai: { name: "Gith", sub: "Githzerai" }
  },
  Gnome: {
    Deep: { name: "Gnome", sub: "Deep" },
    Forest: { name: "Gnome", sub: "Forest" },
    Rock: { name: "Gnome", sub: "Rock" }
  },
  Goblin: { name: "Goblin" },
  Goliath: { name: "Goliath" },
  Hobgoblin: { name: "Hobgoblin" },
  "Half-Elf": { name: "Half-Elf" },
  Halfling: {
    Ghostwise: { name: "Halfling", sub: "Ghostwise" },
    Lightfoot: { name: "Halfling", sub: "Lightfoot" },
    Stout: { name: "Halfling", sub: "Stout" }
  },
  "Half-Orc": { name: "Half-Orc" },
  Human: { name: "Human" },
  Kenku: { name: "Kenku" },
  Kobold: { name: "Kobold" },
  Lizardfolk: { name: "Lizardfolk" },
  Orc: { name: "Orc" },
  Tabaxi: { name: "Tabaxi" },
  Tiefling: {
    Baalzebub: { name: "Tiefling", sub: "Baalzebub" },
    Dispater: { name: "Tiefling", sub: "Dispater" },
    Feral: { name: "Tiefling", sub: "Feral" },
    Fierna: { name: "Tiefling", sub: "Fierna" },
    Glasya: { name: "Tiefling", sub: "Glasya" },
    Hellfire: { name: "Tiefling", sub: "Hellfire" },
    Levistus: { name: "Tiefling", sub: "Levistus" },
    Mammon: { name: "Tiefling", sub: "Mammon" },
    Mephistopheles: { name: "Tiefling", sub: "Mephistopheles" },
    Zariel: { name: "Tiefling", sub: "Zariel" }
  },
  Tortle: { name: "Tortle" },
  Triton: { name: "Triton" },
  "Yuan-Ti Pureblood": { name: "Yuan-Ti Pureblood" }
};

/**
 * Represent a characters race.
 */
class Race {
  constructor(ref = {}) {
    this.name = ref.name;
    this.sub = ref.sub;
  }

  toString() {
    return `${this.sub ? this.sub + " " : ""}${this.name}`;
  }

  static from(obj) {
    return new Race(obj.sub ? Races[obj.name][obj.sub] : Races[obj.name]);
  }
}

module.exports = {
  Race,
  Races
};
