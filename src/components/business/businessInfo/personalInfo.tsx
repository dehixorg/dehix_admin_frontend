"use client";


import { Phone, Mail, Building, User, Briefcase, PackageOpen } from "lucide-react"; // Icons for various fields

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface Personalinfo {
  name: string; 
  companyName: string;
  position: string;
  phone: string;
  email: string;
}

function PersonalInfo({
  personalData,
}: {
  personalData: Personalinfo |null ;
}) {
  const business = personalData;

  if (!business) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto text-gray-500" size={100} />
        <p className="text-gray-500">No business found.</p>
      </div>
    );
  }

  return (
    <Card  className="w-full max-w p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-4">Business Personal Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">


          <div className="flex items-center space-x-3">
            <User className="text-gray-500" size={24} />
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-base">{business.name}</p>
            </div>
          </div>


          <div className="flex items-center space-x-3">
            <Building className="text-gray-500" size={24} />
            <div>
              <p className="text-sm font-medium">Company Name</p>
              <p className="text-base ">{business.companyName}</p>
            </div>
          </div>

         
          <div className="flex items-center space-x-3">
            <Briefcase className="text-gray-500" size={24} />
            <div>
              <p className="text-sm font-medium">Position</p>
              <p className="text-base ">{business.position}</p>
            </div>
          </div>


          <div className="flex items-center space-x-3">
            <Phone className="text-gray-500" size={24} />
            <div>
              <p className="text-sm font-medium">Phone</p>

                {business.phone}

            </div>
          </div>


          <div className="flex items-center space-x-3">
            <Mail className="text-gray-500" size={24} />
            <div>
              <p className="text-sm font-medium">Email</p>
              { business.email!=="Not Provided"?(
              <a
                href={`mailto:${business.email}`}
                className={"text-base underline  text-blue-500"}
              >
                {business.email}
              </a>)
              :
              (<p className="text-base text-gray-500">{business.email}</p>)
}
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}

export default PersonalInfo;
