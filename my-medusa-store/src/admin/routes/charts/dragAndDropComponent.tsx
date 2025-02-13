import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { Plus } from "@medusajs/icons";
import { getComponent } from "./ComponentStrategies";
import CreateDrawerStickyFooter from "./CreateComponent";
import { Container } from "@medusajs/ui";
import { Drawer } from "@medusajs/ui";

import { DroppableSlot } from "./DroppableSlotComponent";
import { DraggableItem } from "./DraggableItemComponent";

type dragAndDropInput = 
  {
    componentType: number;
    props: {
      [key: string] :any
    }
  }[]

const DragAndDropComponent = () => {
  const [isDraggableEnabled, setIsDraggableEnabled] = useState(false);
  const [charts, setCharts] = useState<dragAndDropInput>([]);
  const prevDraggableEnabledRef = useRef(isDraggableEnabled);

  useLayoutEffect(() => {
    const data = [//erstat med database kald
      { componentType: 1, props: {id: "chart-1", startDate:"2025-01-01T00:00:00.000Z", stopDate:"2025-01-20T00:00:00.000Z"} },
      { componentType: 2, props: {id: "chart-2", startDate:"2024-01-01", stopDate:"2024-02-01"} },
      { componentType: 1, props: {id: "chart-3", startDate:"2025-02-01T00:00:00.000Z", stopDate:"2025-02-20T00:00:00.000Z"} },
      { componentType: 2, props: {id: "chart-4", startDate:"2024-03-01", stopDate:"2024-04-01"} },
      { componentType: 1, props: {id: 'chart-5', startDate: '2024-12-24', stopDate: '2025-01-27', previousDatesCount: '0', labelSlider: '0'} },
    ];
    if (data) {
      setCharts(data);
    }
  }, []);

  const addChart = (componentId: number, props:{}) => {
    const newChart = {
      componentType: componentId,
      props: {id: `chart-${charts.length + 1}`, ...props}
    };
    setCharts([...charts, newChart]);
  };

  const handleDragEnd = (event: { active: any; over: any; }) => {
    const { active, over } = event;
  
    if (!over) {
      return;
    }
  
    const activeIndex = charts.findIndex((chart) => chart.props.id === active.id);
    const overIndex = charts.findIndex((chart) => chart.props.id === over.id);
  
    if (activeIndex !== overIndex) {
      const updatedCharts = [...charts];
      const temp = updatedCharts[activeIndex];
      updatedCharts[activeIndex] = updatedCharts[overIndex];
      updatedCharts[overIndex] = temp;
      setCharts(updatedCharts);
    }
  };

  const ComponentSelection = (component_Id: number = 0, props: {[key: string] :any }) => {
    return getComponent(component_Id, props)
  }

  useEffect(() => {
    if (prevDraggableEnabledRef.current && !isDraggableEnabled) {
      saveCharts();
    }
    prevDraggableEnabledRef.current = isDraggableEnabled;
  }, [isDraggableEnabled]);

  const saveCharts = () => {
    // Implement your save logic here, e.g., send charts to a server or save to local storage
    console.log("Saving charts:", charts);
  };

  return (
    <Container>
      <Container style={{ display: "flex", justifyContent: "flex-end" }}>
        {isDraggableEnabled && (
          <Drawer>
            <Drawer.Trigger asChild>
              <button style={{marginRight: "16px"}}>
                <Plus />
              </button>
            </Drawer.Trigger>
            <Drawer.Content>
              <CreateDrawerStickyFooter addChart={addChart} />
            </Drawer.Content>
          </Drawer>
        )}
        
        <button style={{ fontSize: "small" }} onClick={() => setIsDraggableEnabled(!isDraggableEnabled)}>
          {isDraggableEnabled ? "Disable Editing" : "Enable Editing"}
        </button>
      </Container>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Container style={{marginTop: "8px"}} className="flex flex-col gap-x-4 gap-y-3 xl:flex-row xl:items-start">
          <div className="flex w-full flex-col gap-y-3">
          {charts
              .filter((_componentItem, index) => index % 2 === 0)
              .map((componentItem) => (
                <div
                  key={componentItem.props.id}
                  style={{
                    position: "relative",
                    height: "38vh",
                    width: "38vw",
                  }}
                >
                  <DroppableSlot id={componentItem.props.id} isDraggableEnabled={isDraggableEnabled}>
                    {isDraggableEnabled ? (
                      <DraggableItem key={componentItem.props.id} id={componentItem.props.id}>
                        {ComponentSelection(componentItem.componentType, componentItem.props)}
                      </DraggableItem>
                    ) : (
                      ComponentSelection(componentItem.componentType, componentItem.props)
                    )}
                    {charts.filter((c) => c.props.id === componentItem.props.id).length === 0 &&
                    isDraggableEnabled
                      ? "Drop here"
                      : ""}
                  </DroppableSlot>
                </div>
              ))}
          </div>
          <div className="flex w-full max-w-[100%] flex-col gap-y-3 xl:mt-0 xl:max-w-[50%]">
          {charts
              .filter((_componentItem, index) => index % 2 !== 0)
              .map((componentItem) => (
                <div
                  key={componentItem.props.id}
                  style={{
                    position: "relative",
                    height: "38vh",
                    width: "38vw",
                  }}
                >
                  <DroppableSlot id={componentItem.props.id} isDraggableEnabled={isDraggableEnabled}>
                    {isDraggableEnabled ? (
                      <DraggableItem key={componentItem.props.id} id={componentItem.props.id}>
                        {ComponentSelection(componentItem.componentType, componentItem.props)}
                      </DraggableItem>
                    ) : (
                      ComponentSelection(componentItem.componentType, componentItem.props)
                    )}
                    {charts.filter((c) => c.props.id === componentItem.props.id).length === 0 &&
                    isDraggableEnabled
                      ? "Drop here"
                      : ""}
                  </DroppableSlot>
                </div>
              ))}
          </div>
        </Container>
      </DndContext>
    </Container>
  );
};

export default DragAndDropComponent;