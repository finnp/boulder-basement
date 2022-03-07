import axios from "axios";
import groupBy from "lodash/groupBy.js";

const client = axios.create({
  baseURL: "https://backend.dr-plano.com",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36",
  },
});

export async function getSpotsByDay() {
  const { data } = await client.get(
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

function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
