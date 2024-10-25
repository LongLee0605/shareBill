import { useState } from "react";
import BillGrab from "./components/BillGrab";
import CustomBill from "./components/CustomBill";
import "./App.css";

function App({ data }) {
  const [selectedComponent, setSelectedComponent] = useState("A");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "A":
        return <BillGrab data={data} />;
      case "B":
        return <CustomBill data={data} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="px-16">
        <h3>Chọn loại bill cần tính</h3>
        <div className="flex gap-16">
          <label>
            <input
              type="radio"
              value="A"
              checked={selectedComponent === "A"}
              onChange={() => setSelectedComponent("A")}
            />
            Bill Grab
          </label>
          <label>
            <input
              type="radio"
              value="B"
              checked={selectedComponent === "B"}
              onChange={() => setSelectedComponent("B")}
            />
            Bill Tự chọn
          </label>
        </div>
      </div>
      <div>{renderComponent()}</div>
    </>
  );
}

export default App;
