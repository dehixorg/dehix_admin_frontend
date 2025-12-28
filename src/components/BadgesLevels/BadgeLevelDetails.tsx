import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import EditBadgeLevel from "./editBadgeLevel";
import DeleteBadgeLevel from "./deleteBadgeLevel";

export const BadgeLevelDetails = ({ id, data, refetch }: CustomComponentProps & { refetch?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CustomDialog
      title={"Badge & Level Details"}
      description={"Detailed information about the badge or level."}
      triggerState={isOpen}
      setTriggerState={setIsOpen}
      content={
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>Type:</strong> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{data.type}</span></p>
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${data.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {data.isActive ? "Active" : "Inactive"}
              </span></p>
              <p><strong>Name:</strong> {data.name}</p>
              <p><strong>Description:</strong> {data.description}</p>
            </div>
          </div>


          {/* Image URL */}
          {data.imageUrl && (
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Icon</h3>
              <div className="flex items-center space-x-4">
                <Image
                  src={data.imageUrl}
                  alt={data.name}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-icon.png";
                  }}
                />
                <div>
                  <p><strong>Image URL:</strong></p>
                  <p className="text-sm text-gray-600 break-all">{data.imageUrl}</p>
                </div>
              </div>
            </div>
          )}

          {/* Type-specific fields */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Type-Specific Details</h3>
            {data.type === "BADGE" && (
              <div className="space-y-2">
                <p><strong>Base Reward:</strong> {data.baseReward || 0} points</p>
              </div>
            )}
            {data.type === "LEVEL" && (
              <div className="space-y-2">
                <p><strong>Priority:</strong> {data.priority || 0}</p>
                <p><strong>Reward Multiplier:</strong> {data.rewardMultiplier || 1.0}x</p>
              </div>
            )}
          </div>

          {/* Criteria */}
          {data.criteria && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Criteria</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  {Object.entries(data.criteria).map(([key, value]: [string, any]) => (
                    value && (
                      <li key={key} className="flex justify-between">
                        <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <span className="text-gray-700">{value.toString()}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <EditBadgeLevel data={data} refetch={refetch} onClose={() => setIsOpen(false)} />
              <DeleteBadgeLevel data={data} refetch={refetch} onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      }
    />
  );
};
