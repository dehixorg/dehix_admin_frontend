import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateFilterProps {
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const DateFilter: React.FC<DateFilterProps> = ({ setSelectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedDate, setLocalSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date) => {
    setLocalSelectedDate(date);
    setSelectedDate(date); // Pass the selected date back to the parent
    setIsOpen(false);
  };

  return (
    <div>
      <div className="relative">
        <div
          className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>
            {localSelectedDate
              ? localSelectedDate.toLocaleDateString()
              : "Select Date"}
          </span>
          <CalendarIcon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-2 p-2 bg-white dark:bg-gray-900 border rounded-md shadow-md">
            <Calendar onDayClick={(date) => date && handleDateChange(date)} />
          </div>
        )}
      </div>
    </div>
  );
};
