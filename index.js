import prompts from "prompts";
import { bookSlot, getSpotsByDay } from "./drplano.js";
import config from 'first-provide-some-config'

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

const firstName = await config('firstName', 'What is your first name?')
const lastName = await config('lastName', 'What is your last name?')
const dateOfBirth = await config('dateOfBirthString', 'What is your birthday in the format YYYY-MM-DD?')
const streetAndHouseNumber = await config('streetAndHouseNumber', 'What is your street and house number?')
const postalCode = await config('postalCode', 'What is your postal code?')
const city = 'Berlin'
const phoneMobile = await config('phoneMobile', 'What is your mobile phone number?')
const uscMemberId = await config('uscMemberId', 'What is your Urban Sports Club member ID?')
const email = await config('email', 'What is your email?')

await bookSlot({
  firstName,
  lastName,
  dateOfBirth,
  streetAndHouseNumber,
  postalCode,
  city,
  phoneMobile,
  email,
  slot,
  uscMemberId
})


