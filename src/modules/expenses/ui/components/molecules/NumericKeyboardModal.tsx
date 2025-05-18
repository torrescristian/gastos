import React from "react";

interface NumericKeyboardModalProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
}

const NumericKeyboardModal: React.FC<NumericKeyboardModalProps> = ({
  value,
  onChange,
  onConfirm,
}) => {
  const handleKeyPress = (key: string) => {
    if (key === "C") {
      // Clear all
      onChange("");
    } else if (key === "←") {
      // Backspace - remove last character
      onChange(value.slice(0, -1));
    } else if (key === ".") {
      // Only add decimal point if it doesn't exist already
      if (!value.includes(".")) {
        onChange(value + ".");
      }
    } else {
      // Add digit
      onChange(value + key);
    }
  };

  const keypadButtons = [
    "7",
    "8",
    "9",
    "4",
    "5",
    "6",
    "1",
    "2",
    "3",
    "C",
    "0",
    "←",
  ];

  return (
    <div>
      <div className="bg-gray-700 text-white text-right text-3xl p-4 rounded-lg mb-4">
        {value || "0"}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {keypadButtons.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            className="bg-gray-700 hover:bg-gray-600 text-white text-2xl p-4 rounded-lg"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleKeyPress(".")}
          className="bg-gray-700 hover:bg-gray-600 text-white text-2xl p-4 rounded-lg"
        >
          .
        </button>
        <button
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700 text-white text-xl p-4 rounded-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default NumericKeyboardModal;
