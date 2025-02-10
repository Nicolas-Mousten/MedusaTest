import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChartBar, Plus } from "@medusajs/icons";
import DragAndDropPage from "./dragAndDropPage"; 
import { registerComponent } from "./componentStrategies";
import ChartComponent from "./chart"; 


const TableComponent = ({ id, startDate, stopDate, previousDatesCount }: { id: string; startDate?: string; previousDatesCount?: number; stopDate?: string }) => (
  <div>
    <h3>Table Component</h3>
    <p>ID: {id}</p>
    <p>Start: {startDate}</p>
    <p>Stop: {stopDate}</p>
    <p>previous dates count: {previousDatesCount}</p>
  </div>
);

registerComponent(1, "Line Chart", (chart_id:string, startDate?:string, stopDate?:string, previousDatesCount?:number) => (
  <ChartComponent id={chart_id} startDate={startDate} stopDate={stopDate} previousDatesCount={previousDatesCount} />
));

registerComponent(2, "Test Table", (chart_id, startDate, stopDate) => <TableComponent id={chart_id} startDate={startDate} stopDate={stopDate} />);

const data = [
  { id: "chart-1", componentType: 1 },
  { id: "chart-2", componentType: 2 },
  { id: "chart-3", componentType: 1 },
  { id: "chart-4", componentType: 2 },
];

const Page = () => {
  return <DragAndDropPage initial_data={data} />;
};

export const config = defineRouteConfig({
  label: "Charts",
  icon: ChartBar,
});

export default Page; 
