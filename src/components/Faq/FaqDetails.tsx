import { CustomComponentProps } from "../custom-table/FieldTypes";
import { CustomDialog } from "../CustomDialog";

export const FaqDetails = ({ id: _id, data }: CustomComponentProps) => {
  return (
    <CustomDialog
      title={"Faq Details"}
      description={"Detailed information about the faq."}
      content={
        <>
          <div>
            <p>
              <strong>Type:</strong> {data.type}
            </p>
            <p>
              <strong>Status:</strong> {data.status}
            </p>
            <p>
              <strong>Question:</strong> {data.question}
            </p>
            <p>
              <strong>Answer:</strong> {data.answer}
            </p>
            <p>
              <strong>URL Count:</strong>
              {data.importantUrl.length}
            </p>
            <ul className="list-disc list-inside">
              {data.importantUrl.length > 0 ? (
                data.importantUrl.map((url: any, urlIndex: number) => (
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
                ))
              ) : (
                <li className="text-gray-500">No URLs available</li>
              )}
            </ul>
          </div>
        </>
      }
    />
  );
};
