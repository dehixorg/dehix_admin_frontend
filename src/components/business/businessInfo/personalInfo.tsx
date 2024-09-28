"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { apiHelperService } from "@/services/example";

interface Business {
  name: string; // Combined first and last name
  companyName: string;
  position: string;
  phone: string;
  email: string;
}

function BusinessPersonalInfo({ id }: { id: string }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  //const id = "8LdE4z5D38P3pL16XDpt8THhHiw1";

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        console.log(id);
        const response = await apiHelperService.getAllBusinessPersonalInfo(id);
        const data = response.data; // Ensure data is accessed correctly

        // Extract and format the personal information needed
        const personalInfo: Business = {
          name: `${data.firstName} ${data.lastName}` || "Not Provided",
          companyName: data.companyName || "Not Provided",
          position: data.position || "Not Provided",
          phone: data.phone || "Not Provided",
          email: data.email || "Not Provided",
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
        <CardTitle>Business Personal Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={business.name} readOnly />
          </div>
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" value={business.companyName} readOnly />
          </div>
          <div>
            <Label htmlFor="position">Position</Label>
            <Input id="position" value={business.position} readOnly />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={business.phone} readOnly />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={business.email} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessPersonalInfo;
