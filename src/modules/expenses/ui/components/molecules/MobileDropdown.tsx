import React, { useState } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

interface MobileDropdownProps<T extends { id: string | number }> {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: T[];
  renderOption: (option: T, isSelected: boolean) => React.ReactNode;
  renderSelected: (option: T) => React.ReactNode;
}

const MobileDropdown = <T extends { id: string | number }>({
  value,
  onChange,
  placeholder,
  options,
  renderOption,
  renderSelected,
}: MobileDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id.toString() === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full cursor-pointer rounded-lg bg-gray-700 py-3 pl-4 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
      >
        <span className="flex items-center">
          {selectedOption ? (
            renderSelected(selectedOption)
          ) : (
            <span className="block truncate text-gray-400">{placeholder}</span>
          )}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Options Container */}
          <div className="absolute z-20 mt-1 w-full rounded-md bg-gray-700 shadow-lg ring-1 ring-black/5">
            <div className="max-h-60 overflow-auto py-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {options.map((option) => {
                const isSelected = option.id.toString() === value;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id.toString())}
                    className={`relative w-full cursor-pointer select-none py-3 pl-4 pr-10 text-left hover:bg-gray-600 touch-manipulation ${
                      isSelected ? "bg-gray-600 text-white" : "text-gray-200"
                    }`}
                  >
                    {renderOption(option, isSelected)}
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileDropdown;
