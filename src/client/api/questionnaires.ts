import { Questionnaire } from "blaise-api-node-client";
import axios from "axios";

export async function getQuestionnaires(): Promise<Questionnaire[]> {
  const response = await axios.get("/api/questionnaires");

  return response.data;
}
