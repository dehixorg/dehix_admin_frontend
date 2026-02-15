// components/bids/BidDetails.tsx
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";
import Link from "next/link"; 

export const BidDetails = ({ data }: CustomComponentProps) => {
  return (
    data && (
      <CustomDialog
        title="Bid Details"
        description="Detailed information about the selected bid."
        content={
          <div className="flex flex-col space-y-3 p-4 rounded-md text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Project ID</p>
                <Link 
                  href={`/projects/view?id=${data.project_id}`} 
                  className="font-mono text-base mt-1 text-blue-600 hover:underline dark:text-blue-400 break-all" 
                >
                  {data.project_id}
                </Link>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Bidder ID</p>
                <Link
                  href={`/users/view?id=${data.bidder_id}`}
                  className="font-mono text-base mt-1 text-blue-600 hover:underline dark:text-blue-400 break-all" 
                >
                  {data.bidder_id}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                <p className="text-xl font-bold mt-1">
                  ${data.current_price}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-semibold mt-1 ${
                    data.bid_status === "ACCEPTED"
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-50"
                      : data.bid_status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-50"
                      : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-50"
                  }`}
                >
                  {data.bid_status}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Description</p>
              <div className="p-2 mt-1 bg-gray-100 dark:bg-zinc-700 rounded-md overflow-hidden">
                <p className="text-xs whitespace-pre-wrap break-all break-words">{data.description}</p>
              </div>
            </div>
          </div>
        }
      />
    )
  );
};