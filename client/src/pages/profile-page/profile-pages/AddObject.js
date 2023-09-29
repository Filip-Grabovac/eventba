import React, { useState } from "react";
import { Hall } from "./object-types/Hall";
import { HallMedium } from "./object-types/HallMedium";
import { Stadium } from "./object-types/Stadium";
import { Theater } from "./object-types/Theater";
import { BigHall } from "./object-types/BigHall";

export const AddObject = () => {
  // State to manage the selected object
  const [selectedObject, setSelectedObject] = useState("");

  return (
    <div
      className="add-hall-container smaller-profile"
      style={{ padding: "2%" }}
    >
      <h6>Tip objekta</h6>
      <select
        style={{ width: "200px" }}
        className="select-object"
        placeholder="Izaberi vrstu objekta"
        type="text"
        name="object"
        onChange={(e) => setSelectedObject(e.target.value)}
      >
        <option value="">Izaberi vrstu objekta</option>
        <option value="hall">Mala Dvorana</option>
        <option value="medium-hall">Dvorana</option>
        <option value="theater">Kazalište</option>
        <option value="big-hall">Velika Dvorana</option>
        <option value="stadium">Stadion</option>
      </select>
      {/* Conditionally render the Hall component based on the selected value */}
      {selectedObject === "hall" && <Hall />}
      {selectedObject === "medium-hall" && <HallMedium />}
      {selectedObject === "theater" && <Theater />}
      {selectedObject === "big-hall" && <BigHall />}
      {selectedObject === "stadium" && <Stadium />}
    </div>
  );
};
