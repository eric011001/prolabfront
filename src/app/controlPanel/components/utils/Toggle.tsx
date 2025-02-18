import React from "react";

interface ToggleOption {
  value: string;
  label: string;
  checked: boolean;
}

interface Props {
  options: Array<ToggleOption>;
  value: string;
  onChange: (value: string) => void;
}

const Toggle = ({ options, value, onChange }: Props) => {

  return (
    <div>
      <label
        htmlFor="title"
        className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
      >
        Respuesta: 
      </label>
      <div
        key={value}
        className={`w-full flex border border-gray-300 overflow-hidden rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 `}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={` py-2 w-full flex justify-center items-center cursor-pointer font-bold text-white ${option.checked ? 'bg-yellow-500' : 'bg-yellow-400'}`}
          >
            {option.label}
            {option.checked}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toggle;
