import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import EditBadgeLevel from "./editBadgeLevel";
import DeleteBadgeLevel from "./deleteBadgeLevel";

export const BadgeLevelDetails = ({
  id,
  data,
  refetch,
  open,
  onOpenChange,
}: CustomComponentProps & {
  refetch?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;

  const handleOpenChange = (value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === "function" ? value(isOpen) : value;
    if (onOpenChange) {
      onOpenChange(newValue);
    } else {
      setInternalOpen(newValue);
    }
  };

  return (
    <CustomDialog
      title={"Badge & Level Details"}
      description={"Detailed information about the badge or level."}
      triggerState={isOpen}
      setTriggerState={handleOpenChange}
      content={
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Type:</strong>{" "}
                <span className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm font-medium">
                  {data.type}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium ${data.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
                >
                  {data.isActive ? "Active" : "Inactive"}
                </span>
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Name:</strong> {data.name}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Description:</strong> {data.description}
              </p>
            </div>
          </div>

          {/* Image */}
          {data.imageUrl && (
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                Icon
              </h3>
              <div className="flex justify-center">
                <Image
                  src={data.imageUrl}
                  alt={data.name}
                  width={200}
                  height={200}
                  className="w-full max-w-xs mx-auto object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const regularImg = e.currentTarget
                      .nextElementSibling as HTMLImageElement;
                    if (regularImg) {
                      regularImg.style.display = "block";
                    }
                  }}
                />
                <Image
                  src={data.imageUrl}
                  alt={data.name}
                  width={200}
                  height={200}
                  className="w-full max-w-xs mx-auto object-cover rounded-lg border"
                  style={{ display: "none" }}
                  onError={(e) => {
                    e.currentTarget.src = "/user.png";
                  }}
                />
              </div>
            </div>
          )}

          {/* Type-specific fields */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
              Type-Specific Details
            </h3>
            {data.type === "BADGE" && (
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Base Reward:</strong> {data.baseReward || 0} points
                </p>
              </div>
            )}
            {data.type === "LEVEL" && (
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Priority:</strong> {data.priority || 0}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Reward Multiplier:</strong>{" "}
                  {data.rewardMultiplier || 1.0}x
                </p>
              </div>
            )}
          </div>

          {/* Criteria */}
          {data.criteria && (
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                Criteria
              </h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <ul className="space-y-2">
                  {Object.entries(data.criteria).map(
                    ([key, value]: [string, any]) =>
                      value && (
                        <li key={key} className="flex justify-between">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                            :
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {value.toString()}
                          </span>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <EditBadgeLevel
                data={data}
                refetch={refetch}
                onClose={() => handleOpenChange(false)}
              />
              <DeleteBadgeLevel
                data={data}
                refetch={refetch}
                onClose={() => handleOpenChange(false)}
              />
            </div>
          </div>
        </div>
      }
    />
  );
};
