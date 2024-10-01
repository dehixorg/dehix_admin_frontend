"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axiosinstance";
import { useToast } from "@/components/ui/use-toast"; // Toast for error handling
import { PackageOpen } from "lucide-react"; // Icon for no data state

interface Business {
  name: string; // Combined first and last name
  companyName: string;
  position: string;
  phone: string;
  email: string;
}

function PersonalInfo({ id }: { id: string }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast(); // Toast for error messages

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axiosInstance.get(`/business/${id}`);
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
        toast({
          title: "Error",
          description: "Failed to fetch business data. Please try again.",
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
        <p className="text-gray-500">No business found.</p>
      </div>
    );
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

export default PersonalInfo;
