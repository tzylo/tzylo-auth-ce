import type ms from "ms";

/**
 * Convert arbitrary duration string to a valid ms.StringValue type.
 * If parsing fails or input is empty → return fallback.
 */
export function toMsStringValue(input: string, fallback: string): ms.StringValue {
  try {
    const trimmed = input.trim();

    if (!trimmed) {
      return fallback as ms.StringValue;
    }

    // Extract number + unit
    const match = trimmed.match(/^(\d+)\s*([a-zA-Z]*)$/);
    if (!match) {
      return fallback as ms.StringValue;
    }

    const [, numberStr, unitRaw] = match;
    const unitUpper = unitRaw.toUpperCase();

    const unitMap: Record<string, ms.Unit> = {
      YEARS: "Years",
      YEAR: "Year",
      YRS: "Yrs",
      YR: "Yr",
      Y: "Y",
      WEEKS: "Weeks",
      WEEK: "Week",
      W: "W",
      DAYS: "Days",
      DAY: "Day",
      D: "D",
      HOURS: "Hours",
      HOUR: "Hour",
      HRS: "Hrs",
      HR: "Hr",
      H: "H",
      MINUTES: "Minutes",
      MINUTE: "Minute",
      MINS: "Mins",
      MIN: "Min",
      M: "M",
      SECONDS: "Seconds",
      SECOND: "Second",
      SECS: "Secs",
      SEC: "Sec",
      S: "s",
      MILLISECONDS: "Milliseconds",
      MILLISECOND: "Millisecond",
      MSECS: "Msecs",
      MSEC: "Msec",
      MS: "Ms",
    };

    const canonicalUnit =
      unitMap[unitUpper] ??
      (unitRaw.length > 0
        ? (unitRaw as ms.UnitAnyCase)
        : ("Ms" as ms.Unit)); // default unit

    return `${numberStr} ${canonicalUnit}` as ms.StringValue;
  } catch {
    return fallback as ms.StringValue;
  }
}
