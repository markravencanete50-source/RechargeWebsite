import { ArrowUpDown, Baby, Bath, Car, Check, Coffee, CookingPot, Cross, Dumbbell, Fence, Flame, KeyRound, Laptop, Microwave, PawPrint, Refrigerator, ShieldCheck, Shirt, Snowflake, Sun, Thermometer, Trees, Tv, Utensils, WashingMachine, Waves, Wifi, Wind, type LucideIcon } from "lucide-react";

// An icon for a Hostaway amenity, matched on its wording.
const MATCH: [RegExp, LucideIcon][] = [
  [/wi-?fi|internet/i, Wifi],
  [/parking|garage|ev charg/i, Car],
  [/kitchen|stove|oven|cooking/i, CookingPot],
  [/washer|washing machine|laundry/i, WashingMachine],
  [/dryer/i, Wind],
  [/tv|television|netflix|streaming/i, Tv],
  [/heating|radiator/i, Thermometer],
  [/air con|cooling|fan/i, Snowflake],
  [/workspace|desk|laptop/i, Laptop],
  [/towel|bath|shower|shampoo|toiletr/i, Bath],
  [/iron|hanger|wardrobe/i, Shirt],
  [/coffee|kettle|tea/i, Coffee],
  [/dishwasher|dishes|cutlery|utensil/i, Utensils],
  [/microwave/i, Microwave],
  [/fridge|refrigerator|freezer/i, Refrigerator],
  [/garden|patio|yard|bbq|barbecue/i, Trees],
  [/pet|dog/i, PawPrint],
  [/smoke|carbon|fire extinguisher|safety/i, ShieldCheck],
  [/first aid/i, Cross],
  [/self check|keypad|lockbox|smart lock|key/i, KeyRound],
  [/elevator|lift/i, ArrowUpDown],
  [/crib|cot|high chair|baby|child/i, Baby],
  [/balcony|terrace|view/i, Sun],
  [/fireplace|log burner/i, Flame],
  [/gym/i, Dumbbell],
  [/pool|hot tub|sauna/i, Waves],
  [/fence|gated/i, Fence],
];

export function AmenityIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = MATCH.find(([re]) => re.test(name))?.[1] ?? Check;
  return <Icon size={size} />;
}
