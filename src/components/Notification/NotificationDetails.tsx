import Image from "next/image";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";

export const NotificationDetails = ({ id, data }: CustomComponentProps) => {
  return (
    data && (
      <CustomDialog
        title={"Notification Details"}
        description={"Detailed information about the Notification."}
        content={
          <div className="flex flex-col space-y-4 p-4 text-gray-800 dark:text-gray-200">
            {/* Header Section */}
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-gray-50">
                {data.heading}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {data.type}
              </p>
            </div>

            {/* Main Content Section */}
            <p>{data.description}</p>

            {data.background_img && data.background_img !== "" && (
              <div className="flex justify-center">
                <Image
                  src={data.background_img}
                  alt="notification"
                  width={2000}
                  height={2000}
                  className="w-full max-h-60 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* URL Section */}
            <div>
              <p className="text-md font-semibold">
                URL Count: {data.importantUrl?.length || 0}
              </p>

              {data.importantUrl && data.importantUrl.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {data.importantUrl.map((url: any, urlIndex: number) => (
                    <div key={urlIndex} className="space-y-1">
                      <p>
                        <strong>URL Name:</strong> {url.urlName}
                      </p>
                      <p>
                        <strong>URL:</strong>
                        <a
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 dark:text-blue-300 underline ml-1"
                        >
                          {url.url}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  No URLs available
                </p>
              )}
            </div>
          </div>
        }
      />
    )
  );
};