import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type * as schema from "@/db/schema";

type BrowseServicesProps = {
  services?: (typeof schema.services.$inferSelect)[];
};

const BrowseServices = ({ services }: BrowseServicesProps) => {
  if (!services || services.length === 0)
    return <>No Services Available. Create some?</>;

  return (
    <div className="flex flex-col justify-center w-full">
      <Accordion
        type="multiple"
        className="w-[500px] mx-auto gap-4 flex-col flex"
      >
        {services.map((service) => (
          <AccordionItem value={service.id} key={service.id}>
            <AccordionTrigger className="hover:bg-slate-300 bg-slate-200 rounded-lg transition-all p-4">
              <h1 className="text-2xl">{service.title}</h1>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-4 px-4">
                {/* Service description  */}
                <div>
                  <h2 className="text-lg">Description</h2>
                  <p>{service.description}</p>
                </div>

                {/* Service working hours */}
                <div>
                  <h2 className="text-lg">Working Hours</h2>
                  <p>{service.workingHours}</p>
                </div>

                {/* Service rating */}
                <div>
                  <h2 className="text-lg">Rating</h2>
                  <p>{service.rating} / 5</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BrowseServices;
