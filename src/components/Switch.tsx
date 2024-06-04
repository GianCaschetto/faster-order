import { useState } from "react";

type SwitchProps = {
  onChange: () => void;
  value?: boolean;
};

function Switch({ onChange, value }: SwitchProps) {
  const [enabled, setEnabled] = useState(value);

  const toggleSwitch = () => {
    onChange();
    setEnabled(!enabled);
  };

  return (
    <div
      className={`${
        enabled ? "bg-green-500" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer`}
      onClick={toggleSwitch}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </div>
  );
}

export default Switch;
