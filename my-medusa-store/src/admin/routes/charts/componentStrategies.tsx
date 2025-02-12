

type ComponentStrategy = {
  name: string
  render: (chart_id: string, startDate?: string, stopDate?: string, previousDatesCount?: number) => JSX.Element | null;
}

const componentStrategies: Record<number, ComponentStrategy> = {};

//function for registering comnponents
export const registerComponent = (id: number, name: string, strategy: (chart_id: string, startDate?: string, stopDate?: string, previousDatesCount?: number) => JSX.Element | null) => {
  if (componentStrategies[id]) {
    console.warn(`Component ID ${id} (${componentStrategies[id].name}) is already registered. Overwriting.`);
  }
  componentStrategies[id] = { name, render: strategy };
};

//function for retrieving components based on ID
export const getComponent = (component_Id: number, chart_id: string, startDate?: string, stopDate?: string, previousDatesCount?: number) => {
  return componentStrategies[component_Id] ? componentStrategies[component_Id].render(chart_id, startDate, stopDate, previousDatesCount) : null;
};

// Function to export all registered components
export const getAllRegisteredComponents = () => {
  return Object.entries(componentStrategies).map(([key, value]) => ({
    id: Number(key),
    name: value.name,
    component: value.render,
  }));
};