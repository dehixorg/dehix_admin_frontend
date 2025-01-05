import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export const SkillsFilter: React.FC<{
  setSelectedSkills: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ setSelectedSkills }) => {
  const handleSkillChange = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="flex flex-col">
      {["React", "Node.js", "TypeScript"].map((skill) => (
        <div key={skill} className="flex items-center mb-2">
          <Checkbox
            id={`skill-${skill}`}
            onCheckedChange={() => handleSkillChange(skill)}
          />
          <label
            htmlFor={`skill-${skill}`}
            className="ml-2 text-sm text-gray-800 dark:text-gray-200"
          >
            {skill}
          </label>
        </div>
      ))}
    </div>
  );
};
