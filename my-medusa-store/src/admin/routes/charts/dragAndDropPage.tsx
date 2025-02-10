import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChartBar, Plus } from "@medusajs/icons";
import { faker } from "@faker-js/faker";
import { Container, Heading } from "@medusajs/ui";
import { Chart } from "chart.js/auto";
import ChartComponent from "./chart";
import { getComponent } from "./componentStrategies";
import EditDrawerStickyFooter from "./edit_component";

import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

type dragAndDropInput = 
  {
    id: string;
    componentType: number;
    previousDatesCount?: number;
    startDate?: string;
    stopDate?: string;
  }[]
type DragAndDropPageProps = {
  initial_data: dragAndDropInput;
};

const DragAndDropPage = ({ initial_data }: DragAndDropPageProps) => {
  const [isDraggableEnabled, setIsDraggableEnabled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [charts, setCharts] = useState<dragAndDropInput>([]);

  useLayoutEffect(() => {
    if (initial_data) {
      setCharts(initial_data);
    }
  }, [initial_data]);

  const addChart = (componentId, startDate, stopDate, previousDatesCount) => {
    const newChart = {
      id: `chart-${charts.length + 1}`,
      componentType: componentId,
      startDate,
      stopDate,
      previousDatesCount,
    };
    setCharts([...charts, newChart]);

    console.log(charts)
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over) {
      return;
    }
  
    const activeIndex = charts.findIndex((chart) => chart.id === active.id);
    const overIndex = charts.findIndex((chart) => chart.id === over.id);
  
    if (activeIndex !== overIndex) {
      const updatedCharts = [...charts];
      const temp = updatedCharts[activeIndex];
      updatedCharts[activeIndex] = updatedCharts[overIndex];
      updatedCharts[overIndex] = temp;
      setCharts(updatedCharts);
    }
  };

  const ComponentSelection = (component_Id: number = 0, chart_id: string = "", startDate: string = "", stopDate: string = "", previousDatesCount = undefined) => {
    return getComponent(component_Id, chart_id, startDate, stopDate, previousDatesCount)
  }

  return (
    <div style={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {isDraggableEnabled && (
          <button style={{marginRight: "16px"}} onClick={() => setIsDrawerOpen(true)}>
            <Plus />
            {/* ToDo create charts form */}
          </button>
        )}
        
        <button style={{ marginTop: "8px", marginBottom: "8px", marginRight: "8px", fontSize: "small" }} onClick={() => setIsDraggableEnabled(!isDraggableEnabled)}>
          {isDraggableEnabled ? "Disable Editing" : "Enable Editing"}
        </button>
      </div>
      <hr className="solid"/>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{margin: "8px"}} className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-y-3">
          {charts
              .filter((chart, index) => index % 2 === 0)
              .map((chart, index) => (
                <div
                  key={chart.id}
                  style={{
                    position: "relative",
                    height: "40vh",
                    width: "40vw",
                  }}
                >
                  <Droppable id={chart.id} isDraggableEnabled={isDraggableEnabled}>
                    {isDraggableEnabled ? (
                      <Draggable key={chart.id} id={chart.id}>
                        {ComponentSelection(chart.componentType, chart.id)}
                      </Draggable>
                    ) : (
                      ComponentSelection(chart.componentType, chart.id)
                    )}
                    {charts.filter((c) => c.id === chart.id).length === 0 &&
                    isDraggableEnabled
                      ? "Drop here"
                      : ""}
                  </Droppable>
                </div>
              ))}
          </div>
          <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[50%]">
          {charts
              .filter((chart, index) => index % 2 !== 0)
              .map((chart, index) => (
                <div
                  key={chart.id}
                  style={{
                    position: "relative",
                    height: "40vh",
                    width: "40vw",
                  }}
                >
                  <Droppable id={chart.id} isDraggableEnabled={isDraggableEnabled}>
                    {isDraggableEnabled ? (
                      <Draggable key={chart.id} id={chart.id}>
                        {ComponentSelection(chart.componentType, chart.id)}
                      </Draggable>
                    ) : (
                      ComponentSelection(chart.componentType, chart.id)
                    )}
                    {charts.filter((c) => c.id === chart.id).length === 0 &&
                    isDraggableEnabled
                      ? "Drop here"
                      : ""}
                  </Droppable>
                </div>
              ))}
          </div>
        </div>
      </DndContext>

      {/* Drawer Component for editing*/}
      <EditDrawerStickyFooter isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} addChart={addChart} />

    </div>
  );
};

export const config = defineRouteConfig({
  label: "Charts",
  icon: ChartBar,
});

export default DragAndDropPage;