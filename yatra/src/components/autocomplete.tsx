import { useState, useRef, useEffect, ChangeEvent } from "react";

interface AutocompleteInputProps {
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  items: string[];
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSuggestionSelect: (value: string) => void;
}

export const AutocompleteInput = ({
  id,
  name,
  value,
  placeholder,
  items,
  onValueChange,
  onSuggestionSelect,
}: AutocompleteInputProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onValueChange(e);

    if (inputValue) {
      const filteredItems = items.filter((item) =>
        item.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setSuggestions(filteredItems);
      setIsVisible(true);
    } else {
      setSuggestions(items);
      setIsVisible(false);
    }
  };

  const handleFocus = () => {
    const filteredItems = value
      ? items.filter((item) => item.toLowerCase().startsWith(value.toLowerCase()))
      : items;
    setSuggestions(filteredItems);
    setIsVisible(true);
  };
  
  const handleSuggestionClick = (item: string) => {
    onSuggestionSelect(item);
    setIsVisible(false);
  };

  return (
    <div className="relative" ref={autocompleteRef}>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        autoComplete="off"
      />
      {isVisible && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 overflow-auto border border-gray-300 rounded-md shadow-lg bg-background max-h-60">
          {suggestions.map((item) => (
            <li
              key={item}
              onClick={() => handleSuggestionClick(item)}
              role="option"
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};