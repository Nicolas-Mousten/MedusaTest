type ComponentStrategy = {
  name: string
  render: (props: { [key: string]: any }) => JSX.Element | null;
  constructor: any;
}

const componentStrategies: Record<number, ComponentStrategy> = {};

//function for registering comnponents
export const registerComponent = (id: number, name: string, constructor:any, strategy: (props: { [key: string]: any }) => JSX.Element | null) => {
  if (componentStrategies[id]) {
    console.warn(`Component ID ${id} (${componentStrategies[id].name}) is already registered. Overwriting.`);
  }
  componentStrategies[id] = { name, render: strategy, constructor: constructor };
};

//function for retrieving components based on ID
export const getComponent = (component_Id: number, props: { [key: string]: any }) => {
  return componentStrategies[component_Id] ? componentStrategies[component_Id].render(props) : null;
};

// Function to export all registered components
export const getAllRegisteredComponents = () => {
  return Object.entries(componentStrategies).map(([key, value]) => ({
    id: Number(key),
    name: value.name,
    component: value.render,
    constructor: value.constructor,
  }));
};