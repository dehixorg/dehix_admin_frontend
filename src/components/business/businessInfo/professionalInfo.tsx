"use client";

import { PackageOpen, Shield, ShieldOff, Globe, Users, Link } from "lucide-react"; // Added icons for better representation

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface ProfessionalData {
  companyName: string;
  companySize: string;
  linkedIn: string;
  personalWebsite: string;
  isVerified: string;
}

function BusinessProfessionalInfo({
  professionalData,
}: {
  professionalData: ProfessionalData | null;
}) {
  const business = professionalData;

  if (!business) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto text-gray-500" size={100} />
        <p className="text-gray-500">
          No business professional information found.
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-4">
          Business Professional Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Company Name and Verification Status */}
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h2 className="text-xl font-medium">{business.companyName}</h2>
            {business.isVerified === "Yes" ? (
              <Shield className="text-green-500" size={28} />
            ) : (
              <ShieldOff className="text-red-500" size={28} />
            )}
          </div>

          {/* Business Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Users className="text-gray-500" size={20} />
              <div>
                <p className="text-sm font-medium">Company Size</p>
                <p className="text-base">{business.companySize}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link className="text-gray-500" size={20} />
              <div>
                <p className="text-sm font-medium">LinkedIn</p>
                {business.linkedIn !== "Not Provided" ? (
                  <a
                    href={business.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer" // Ensures security when opening in a new tab
                    className="text-base underline text-blue-500"
                  >
                    {business.linkedIn}
                  </a>
                ) : (
                  <p className="text-base text-gray-500">{business.linkedIn}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Globe className="text-gray-500" size={20} />
              <div>
                <p className="text-sm font-medium">Personal Website</p>
                {business.personalWebsite !== "Not Provided" ? (
                  <a
                    href={business.personalWebsite}
                    target="_blank"
                    rel="noopener noreferrer" // Ensures security when opening in a new tab
                    className="text-base underline text-blue-500"
                  >
                    {business.personalWebsite}
                  </a>
                ) : (
                  <p className="text-base text-gray-500">
                    {business.personalWebsite}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield
                className={`${business.isVerified === "Yes" ? "text-green-500" : "text-red-500"
                  }`}
                size={20}
              />
              <div>
                <p className="text-sm font-medium">Verified Status</p>
                <span
                  className={`inline-block mt-1 ${business.isVerified === "Yes"
                    ? "bg-green-500/20 text-green-700 dark:text-green-400"
                    : "bg-red-500/20 text-red-700 dark:text-red-400"
                    } rounded-full px-3 py-1 text-xs font-medium`}
                >
                  {business.isVerified === "Yes" ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessProfessionalInfo;