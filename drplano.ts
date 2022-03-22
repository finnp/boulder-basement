import axios from "axios";
import groupBy from "lodash/groupBy.js";

const client = axios.create({
  baseURL: "https://backend.dr-plano.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36",
  },
});

interface BookSlotParameters {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  streetAndHouseNumber: string;
  postalCode: string;
  city: string;
  phoneMobile: string;
  uscMemberId: string;
  email: string;
  slot: {
    raw: {
      selector: number;
    };
  };
}

export async function bookSlot({
  firstName,
  lastName,
  dateOfBirth,
  streetAndHouseNumber,
  postalCode,
  city,
  phoneMobile,
  uscMemberId,
  email,
  slot,
}: BookSlotParameters) {
  const body = {
    clientId: 122632017,
    shiftModelId: 155581628,
    shiftSelector: slot.raw.selector,
    desiredDate: null,
    dateOfBirthString: dateOfBirth,
    streetAndHouseNumber,
    postalCode,
    city,
    phoneMobile,
    type: "booking",
    participants: [
      {
        isBookingPerson: true,
        tariffId: 155589630,
        dateOfBirthString: dateOfBirth,
        firstName,
        lastName,
        additionalFieldValue: uscMemberId,
        email,
        dateOfBirth,
      },
    ],
    firstName,
    lastName,
    email,
    dateOfBirth,
  };

  const { data } = await client.post("/bookable", body);

  return data;
}

interface DrPlanySpotsData {
  state: "BOOKABLE";
  dateList: {
    start: string;
    end: string;
  }[];
  maxCourseParticipantCount: number;
  currentCourseParticipantCount: number;
}

export async function getSpotsByDay() {
  const { data } = await client.get<DrPlanySpotsData[]>(
    "courses_dates?id=155581628&advanceToFirstMonthWithDates&start=1646089200000&end=1648764000000"
  );
  const differentSpots = data
    .filter((d) => d.state === "BOOKABLE")
    .map((raw) => ({
      from: new Date(raw.dateList[0].start),
      to: new Date(raw.dateList[0].end),
      day: getStartOfDay(new Date(raw.dateList[0].start)),
      spotsFree:
        raw.maxCourseParticipantCount - raw.currentCourseParticipantCount,
      raw,
    }))
    .filter((d) => d.from.getTime() > Date.now());

  return groupBy(differentSpots, "day");
}

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
