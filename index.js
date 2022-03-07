import prompts from "prompts";
import { getSpotsByDay } from "./drplano.js";

const spotsByDay = await getSpotsByDay();
const { day } = await prompts({
  type: "select",
  name: "day",
  message: "Pick a day",
  choices: Object.keys(spotsByDay)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((d) => ({
      title: d.toString().slice(0, "Thu Mar 10 2022".length),
      value: d,
    })),
});

const { slot } = await prompts({
  type: "select",
  name: "slot",
  message: "Pick a slot",
  choices: spotsByDay[day].map((slot) => ({
    title: `${slot.from.toString().slice(16, 21)} - ${slot.spotsFree} spots`,
    value: slot,
  })),
});

console.log(slot);
