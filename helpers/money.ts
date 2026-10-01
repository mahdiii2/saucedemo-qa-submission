/** Parse a USD value into integer cents; reject missing or malformed prices. */
export function parseMoneyCents(text: string): number {
  const match = /^(?:Item total: |Tax: |Total: )?\$(\d+)\.(\d{2})$/.exec(text.trim());
  if (!match || match[1] === undefined || match[2] === undefined) {
    throw new Error(`Expected a USD amount with two decimals, received: ${JSON.stringify(text)}`);
  }
  const cents = Number(match[1]) * 100 + Number(match[2]);
  if (!Number.isSafeInteger(cents)) {
    throw new Error(`USD amount exceeds safe integer precision: ${JSON.stringify(text)}`);
  }
  return cents;
}
