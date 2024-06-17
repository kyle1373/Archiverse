export function numberWithCommas(x: number) {
  if (!x) {
    return "";
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
