// External Imports
import { Geist, Instrument_Serif } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const instrument = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});
