export function toKebabLowerCase(stringValue) {
  if (!stringValue) {
    return null;
  }
  return stringValue
    .toLowerCase()
    .replace(/ \(the\)/g, "")
    .replace(/ /g, "-");
}

export function toFlagName(stringValue) {
  if (!stringValue) {
    return null;
  }
  if (stringValue.includes("LAO PEOPLE")) {
    return "laos";
  }
  if (stringValue === "CURAÇAO") {
    return "curacao";
  }

  return stringValue.split(/[(,]/g)[0].trim();
}
