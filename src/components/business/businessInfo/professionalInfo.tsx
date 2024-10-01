"use client";

import { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react"; // Icon for no data state

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axiosinstance";
import { useToast } from "@/components/ui/use-toast"; // For toast notifications

interface Business {
  companyName: string;
  companySize: string;
  linkedIn: string;
  personalWebsite: string;
  isVerified: string;
}

function BusinessProfessionalInfo({ id }: { id: string }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // For displaying toast notifications

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axiosInstance.get(`/business/${id}`);
        const data = response.data;

        const professionalInfo: Business = {
          companyName: data.companyName || "Not Provided",
          companySize: data.companySize || "Not Provided",
          linkedIn: data.linkedIn || "Not Provided",
          personalWebsite: data.personalWebsite || "Not Provided",
          isVerified: data.isVerified ? "Yes" : "No",
        };

        setBusiness(professionalInfo);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch professional info. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

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
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Business Professional Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
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
            <Label htmlFor="personalWebsite">Personal Website</Label>
            <Input
              id="personalWebsite"
              value={business.personalWebsite}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="isVerified">Verified</Label>
            <Input
              id="isVerified"
              value={business.isVerified}
              readOnly
              className={
                business.isVerified === "Yes"
                  ? "text-green-500"
                  : "text-red-500"
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessProfessionalInfo;
