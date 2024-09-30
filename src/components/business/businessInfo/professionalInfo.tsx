"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiHelperService } from "@/services/business";

interface Business {
  // Combined first and last name
  companyName: string;
  companySize: string;
  linkedIn: string;
  personalWebsite: string;
  isVerified: string;
}

function BusinessProfessionalInfo({ id }: { id: string }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  //const id = "8LdE4z5D38P3pL16XDpt8THhHiw1";

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await apiHelperService.getAllBusinessPersonalInfo(id);
        const data = response.data; // Ensure data is accessed correctly

        // Extract and format the personal information needed
        const personalInfo: Business = {
          companyName: data.companyName || "Not Provided",
          companySize: data.companySize || "Not Provided",
          linkedIn: data.linkedIn || "Not Provided",
          personalWebsite: data.email || "Not Provided",
          isVerified: data.isVerified ? "Yes" : "No",
        };

        setBusiness(personalInfo);
      } catch (error) {
        setError((error as Error).message);
        console.error("API Error:", error);
      }
    };

    fetchBusiness();
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!business) {
    return <p>No business found.</p>;
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Business Professional Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Comapny Name</Label>
            <Input id="companyName" value={business.companyName} readOnly />
          </div>
          <div>
            <Label htmlFor="companySize">Company Size</Label>
            <Input id="companySize" value={business.companySize} readOnly />
          </div>
          <div>
            <Label htmlFor="linkedIn">LinkedIn</Label>
            <Input id="linkedIn" value={business.linkedIn} readOnly />
          </div>
          <div>
            <Label htmlFor="personalWebsite">PersonalWebsite</Label>
            <Input
              id="personalWebsite"
              value={business.personalWebsite}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="isVerified">Verified</Label>
            <Input id="isVerified" value={business.isVerified} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessProfessionalInfo;
