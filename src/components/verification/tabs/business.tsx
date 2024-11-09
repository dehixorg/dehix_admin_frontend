"use client";
import * as React from "react";

import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation



import { formatTime } from "@/lib/utils";
import { formatID } from "@/utils/common/enum";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import CopyButton from "@/components/copybutton";



interface Verificationinfo {
  verifier_id:string;
  verifier_username:string;
  requester_id:string;
  document_id:string;
  comment:string;
  verified_at:string;
  doc_type:string;
}
interface Props {
    businessData:Verificationinfo[]|null;
  }

const Business: React.FC <Props>= ({ businessData }) => {
    const router = useRouter();
    if(!businessData)
    {
        return (
            <div className="text-center py-10">
              <PackageOpen className="mx-auto text-gray-500" size={100} />
              <p className="text-gray-500">No Business Verification Found.</p>
            </div>
          );
    }





  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
              <TableRow>
                  <TableHead>Verifier ID</TableHead>
                  <TableHead>Verifier Username</TableHead>
                  <TableHead>Requester ID</TableHead>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Verified At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { businessData.length > 0 ? (
                  businessData.map((user) => (
                    <TableRow>
                      <TableCell>
                      {user.verifier_id ? (
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                            <span
                                  onClick={() => router.push(`/freelancer/tabs?id=${user.verifier_id}`)}
                                  className="cursor-pointer text-blue-500 hover:underline"
                                >
                                  <span>{formatID(user.verifier_id || "")}</span>
                                </span>
                            </TooltipTrigger>

                            <CopyButton id={user.verifier_id} />

                            <TooltipContent>
                              {user.verifier_id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                         ) : (
                            "No Data Available"
                          )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                        { user.verifier_username?user.verifier_username:"No Data Available"}
                        </div>
                        </TableCell>
                        <TableCell>
                      {user.requester_id ? (
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger>
                            <span
                                  onClick={() => router.push(`/freelancer/tabs?id=${user.requester_id}`)}
                                  className="cursor-pointer text-blue-500 hover:underline"
                                >
                                  <span>{formatID(user.requester_id || "")}</span>
                                </span>
                            </TooltipTrigger>

                            <CopyButton id={user.requester_id} />

                            <TooltipContent>
                              {user.requester_id || "No Data Available"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                         ) : (
                            "No Data Available"
                          )}
                      </TableCell>
                    
                      <TableCell>
                        {user.document_id? (
                          <div className="flex items-center space-x-2">
                            <Tooltip>
                              <TooltipTrigger>
                               
                                  <span>{formatID(user.document_id || "")}</span>
                               
                              </TooltipTrigger>

                              <CopyButton id={user.document_id || ""} />

                              <TooltipContent>
                                {user.document_id || "No Data Available"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          "No Data Available"
                        )}
                      </TableCell>
                      <TableCell>
                      <div className="flex items-center space-x-2">
                        {formatTime(user.verified_at)||"No Data Available"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available. <br />
                          This feature will be available soon. <br />
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Business;
