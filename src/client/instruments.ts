import { Instrument } from "blaise-api-node-client";
import axios from "axios";

export async function getInstruments(): Promise<Instrument[]> {
  const response = await axios.get("/api/instruments");

  return response.data;
}
