export function numberWithCommas(x: number) {
  if (!x) {
    return 0;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function extractEnglishCharacters(input: string): string {
  // Use a regular expression to replace all non-alphanumeric characters with an empty string
  return input.replace(/[^a-zA-Z0-9 ]/g, '');
}