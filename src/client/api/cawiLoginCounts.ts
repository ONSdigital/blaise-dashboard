import axios from "axios";

export type CawiLoginCount = {
    timestamp: string;
    count: number;
};

export async function getCawiLoginSuccessCounts(): Promise<CawiLoginCount[]> {
    const response = await axios.get("/api/logs/cawi-logins/success-counts");
    return response.data;
}
