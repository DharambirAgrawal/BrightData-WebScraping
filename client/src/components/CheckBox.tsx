"use client";

import { useState } from "react";

const CheckBox = () => {
  const [value, setValue] = useState("");
  const handleSelect = () => {};
  return (
    <div className="py-5 space-x-1">
      <button
        className={`border border-black rounded p-4 ${
          value == "SkyScanner" ? " bg-blue-300" : "hover:bg-blue-100"
        }`}
        type="button"
        onClick={() => setValue("SkyScanner")}
      >
        <p>Sky Scanner</p>

        <input
          type="radio"
          name="area"
          value="SkyScanner"
          defaultChecked={false}
          className="hidden sr-only"
          checked={value == "SkyScanner" ? true : false}
        />
      </button>
      <button
        className={`border border-black rounded p-4 ${
          value == "Amazon" ? " bg-blue-300" : "hover:bg-blue-100"
        }`}
        type="button"
        onClick={() => setValue("Amazon")}
      >
        <p>Amazon</p>

        <input
          type="radio"
          name="area"
          value="Amazon"
          className="hidden sr-only"
          defaultChecked={false}
          checked={value == "Amazon" ? true : false}
        />
      </button>
      <button
        className={`border border-black rounded p-4 ${
          value == "Google" ? " bg-blue-300" : "hover:bg-blue-100"
        }`}
        type="button"
        onClick={() => setValue("Google")}
      >
        <p>Google</p>

        <input
          type="radio"
          name="area"
          value="Google"
          defaultChecked={false}
          className="hidden sr-only"
          checked={value == "Google" ? true : false}
        />
      </button>
    </div>
  );
};

export default CheckBox;
