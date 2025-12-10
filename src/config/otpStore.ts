import NodeCache from "node-cache";

export const otpStore = new NodeCache({
  stdTTL: 300,       // 5 minutes default
  checkperiod: 60,   // cleanup every minute
  useClones: false,  // better performance
});
