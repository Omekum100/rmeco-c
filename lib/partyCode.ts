function lettersOnly(value: string) {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

export function buildPartyCode(location: string, partyName: string) {
  const locationPart = lettersOnly(location).slice(0, 2).padEnd(2, "X");
  const words = partyName
    .trim()
    .split(/\s+/)
    .map((word) => lettersOnly(word))
    .filter(Boolean);
  const partyPart =
    words.length > 1
      ? words.map((word) => word[0]).join("")
      : lettersOnly(partyName).slice(0, 2);

  return `${locationPart}${partyPart || "XX"}`;
}
