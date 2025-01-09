import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const CategoryFilter: React.FC<{ setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>> }> = ({
  setSelectedCategory,
}) => {
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <Select onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="frontend">Frontend Development</SelectItem>
        <SelectItem value="backend">Backend Development</SelectItem>
      </SelectContent>
    </Select>
  );
};
