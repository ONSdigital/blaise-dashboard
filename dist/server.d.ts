import { Express } from "express";
import { Config } from "./config";
import { BlaiseApiClient } from "blaise-api-node-client";
import NodeCache from "node-cache";
declare function NewServer(blaiseApiClient: BlaiseApiClient, cache: NodeCache, config: Config): Express;
export default NewServer;
//# sourceMappingURL=server.d.ts.map