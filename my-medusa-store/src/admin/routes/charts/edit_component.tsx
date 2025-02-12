import { useState, useEffect } from "react";
import { getAllRegisteredComponents } from "./componentStrategies";
import { Button, Drawer, Text, Label, RadioGroup, Input } from "@medusajs/ui";

type EditDrawerInput = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addChart: (componentId: number, props: { [key: string]: any }) => void;
};

const EditDrawerStickyFooter = ({ isOpen, setIsOpen, addChart }: EditDrawerInput) => {
  const [componentsList, setComponentsList] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [selectedData, setSelectedData] = useState<any>();

  useEffect(() => {
    const registeredComponents = getAllRegisteredComponents();
    setComponentsList(registeredComponents);
  }, []);

  const handleRadioChange = (value: string, data: any) => {
    if (selectedOption !== value) {
      setSelectedOption(value);
      setSelectedData(data);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedOption && selectedData) {
      const updatedProps: { [key: string]: any } = {};

      Object.keys(selectedData).forEach((key) => {
        const inputElement = document.getElementById(`input_${key}`) as HTMLInputElement;
        if (inputElement) {
          updatedProps[key] = inputElement.value;
        }
      });

      addChart(Number(selectedOption), updatedProps);
      setSelectedOption(undefined);
      setSelectedData(undefined);
    }

    setIsOpen(false);
  };

  const renderInput = (value: any, key: string) => {
    if (typeof value === "number") {
      return <Input id={`input_${key}`} type="number" defaultValue={value} />;
    } else if (value instanceof Date) {
      return <Input id={`input_${key}`} type="date" defaultValue={value.toISOString().split("T")[0]} />;
    } else {
      return <Input id={`input_${key}`} type="text" defaultValue={value} />;
    }
  };

  return (
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Add tools</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body className="p-4">
        <Text>Types of reporting tools:</Text>
        <form onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto p-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={(value) => {
                const selectedComponent = componentsList.find((c) => c.id.toString() === value);
                if (selectedComponent) {
                  handleRadioChange(value, selectedComponent.constructor);
                }
              }}
            >
              {componentsList.map((component) => (
                <div key={component.id} className="flex items-center gap-x-3 mb-2">
                  <RadioGroup.Item value={component.id.toString()} id={`radio_${component.id}`} />
                  <Label htmlFor={`radio_${component.id}`} weight="plus">
                    {component.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <br />
            {selectedData && (
              <div>
                {Object.keys(selectedData).map((key) => (
                  <div key={key}>
                    {key}: {renderInput(selectedData[key], key)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Drawer.Close>
            <Drawer.Close asChild>
              <Button type="submit">Save</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </form>
      </Drawer.Body>
    </Drawer.Content>
  );
};

export default EditDrawerStickyFooter;
