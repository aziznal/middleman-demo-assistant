import dbClient from "@/db/client";
import BrowseServices from "./BrowseServices";

import * as schema from "@/db/schema";

const Page = async () => {
  const services = await dbClient.select().from(schema.services);

  return <BrowseServices services={services} />;
};

export default Page;
