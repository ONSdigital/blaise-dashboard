import axios from "axios";

export type BlaiseStatus = {
    "health check type": string;
    status: string;
};

export async function getBlaiseStatus(): Promise<BlaiseStatus[]> {
    const response = await axios.get("/api/health");
    return response.data;
}