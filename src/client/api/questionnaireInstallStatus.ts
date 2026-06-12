import axios from "axios";

export type QuestionnaireInstallStatus = {
  questionnaireName: string;
  totalNodes: number;
  activeNodes: number;
  activeOnAllNodes: boolean;
};

export async function getQuestionnaireInstallStatus(): Promise<
  QuestionnaireInstallStatus[]
> {
  const response = await axios.get("/api/questionnaires/install-status");
  return response.data;
}
