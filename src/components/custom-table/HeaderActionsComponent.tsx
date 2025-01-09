import { twMerge } from "tailwind-merge";
import { HeaderActions } from "./FieldTypes";

export const HeaderActionComponent = ({
  headerActions,
}: {
  headerActions?: HeaderActions[];
}) => {
  return (
    <div className="flex gap-3 mr-4 flex-wrap">
      {headerActions?.map((actions, index) => (
        <div
          key={index}
          className={twMerge(
            "px-3 py-1 text-sm bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-sm flex items-center gap-2 sm:px-2 cursor-pointer sm:py-1 md:px-3 md:py-3 lg:px-3 lg:py-3 xl:px-3 xl:py-2 hover:bg-gray-300",
            actions.className
          )}
          onClick={() => actions.handler()}
        >
          {actions.icon} {actions.name}
        </div>
      ))}
    </div>
  );
};
