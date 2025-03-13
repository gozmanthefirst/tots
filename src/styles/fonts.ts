import { Geist, Instrument_Sans, Instrument_Serif } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});
