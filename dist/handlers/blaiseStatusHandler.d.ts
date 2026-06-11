import { Request, Response, Router } from "express";
import { BlaiseApiClient } from "blaise-api-node-client";
export default function BlaiseStatusHandler(blaiseApiClient: BlaiseApiClient): Router;
export declare function getBlaiseStatus(_req: Request, res: Response, blaiseApiClient: BlaiseApiClient): Promise<Response>;
//# sourceMappingURL=blaiseStatusHandler.d.ts.map