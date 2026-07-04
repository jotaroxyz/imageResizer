import { isDev } from "./util.js";

declare global {
  interface Console {
    dev: (...args: any[]) => void;
  }
}

const Console = { ...console };

Console.dev = (...args: any[]) => {
  if (!isDev()) return;
  //@todo add color logs
  console.log(args.join('\t'));
}

export default Console;