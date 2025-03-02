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
            <>
              <div className="flex flex-col items-start justify-start gap-0">
                <h1 className="text-3xl w-full text-center font-medium text-neutral-900">
                  {data.heading}
                </h1>
                <p className="text-sm text-gray-500 mb-2">{data.type}</p>
                <p className=" mb-2">{data.description}</p>
                {data.background_img !== "" && (
                  <Image
                    src={data.background_img}
                    alt="notification"
                    width={2000}
                    height={2000}
                    className="w-full h-fit"
                  />
                )}
                <p>
                  <strong>URL Count:</strong>
                  {data.importantUrl.length}
                </p>
                <ul className="list-inside">
                  {data.importantUrl.length > 0 ? (
                    data.importantUrl.map(
                      (url: any, urlIndex: number) => (
                        <li key={urlIndex}>
                          <p>
                            <strong>URL Name:</strong> {url.urlName}
                          </p>
                          <p>
                            <strong>URL:</strong>
                            <a
                              href={url.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {url.url}
                            </a>
                          </p>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-gray-500">No URLs available</li>
                  )}
                </ul>
              </div>
            </>
          }
        />
      )
    );
  }