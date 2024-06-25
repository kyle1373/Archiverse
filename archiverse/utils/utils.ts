export function numberWithCommas(x: number) {
  if (!x) {
    return 0;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
