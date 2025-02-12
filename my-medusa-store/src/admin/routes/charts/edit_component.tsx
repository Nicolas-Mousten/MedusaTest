import {useState, useEffect} from "react";
import { getAllRegisteredComponents } from "./componentStrategies";


type EditDrawerInput = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addChart: (componentId: number, startDate: string, stopDate: string, previousDatesCount: number | undefined) => void
}


const editDrawerStickyFooter = ({ isOpen, setIsOpen, addChart }:EditDrawerInput) => {
  const [componentsList, setComponentsList] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string>("");
  const [stopDate, setStopDate] = useState<string>("");
  const [previousDatesCount, setPreviousDatesCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    const registeredComponents = getAllRegisteredComponents();
    setComponentsList(registeredComponents);
  }, []);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleStopDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStopDate(event.target.value);
  };

  const handlePreviousDatesCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreviousDatesCount(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log("Selected Option:", selectedOption);
    console.log("Start Date:", startDate);
    console.log("Stop Date:", stopDate);
    console.log("Previous Dates Count:", previousDatesCount);

    if (selectedOption) {
      addChart(Number(selectedOption), startDate, stopDate, previousDatesCount);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Add tools</h2>
        </div>
        
        {/* Scrollable Content */}
        <form onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto p-4">
            {componentsList.map((component) => (
              <div key={component.id} className="mb-2">
                <label>
                  <input
                    type="radio"
                    value={component.id.toString()}
                    checked={selectedOption === component.id.toString()}
                    onChange={handleRadioChange}
                  />
                  {component.name}
                </label>
              </div>
            ))}
            <br />

            <div>
              <p>Start Date: <input type="date" value={startDate} onChange={handleStartDateChange} /></p>
              <p>Stop Date: <input type="date" value={stopDate} onChange={handleStopDateChange} /></p>
              <p>Previous Dates: <input type="number" value={previousDatesCount} onChange={handlePreviousDatesCountChange} /></p>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );



}

export default editDrawerStickyFooter;