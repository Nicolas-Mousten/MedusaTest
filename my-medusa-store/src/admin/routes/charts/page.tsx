import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChartBar } from "@medusajs/icons";
import DragAndDropComponent from "./dragAndDropComponent"; 
import { registerComponent } from "./componentStrategies";
import ChartComponent from "./chartComponent"; 
import { chartRequiredFields } from "./chartComponent"; 


const tableRequiredFields = {
  id: "", 
  startDate: "", 
  previousDatesCount: "", 
  stopDate: ""
}

const TableComponent = ({ id, startDate, stopDate, previousDatesCount }: { id: string; startDate?: string; previousDatesCount?: number; stopDate?: string }) => (
  <div>
    <h3>Table Component</h3>
    <p>ID: {id}</p>
    <p>Start: {startDate}</p>
    <p>Stop: {stopDate}</p>
    <p>previous dates count: {previousDatesCount}</p>
  </div>
);

registerComponent(1, "Line Chart", chartRequiredFields, (props) => (
  <ChartComponent props={props} />//the code work got no idea what is happening with props, it should be fine not expecting an id.
));

registerComponent(2, "Test Table", tableRequiredFields, (props) => 
<TableComponent id={props.id} startDate={props.startDate} stopDate={props.stopDate} />
);

const Page = () => {
  return <DragAndDropComponent />;
};

export const config = defineRouteConfig({
  label: "Charts",
  icon: ChartBar,
});

export default Page; 
