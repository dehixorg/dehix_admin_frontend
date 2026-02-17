"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiHelperService } from "@/services/verification";
import { Messages } from "@/utils/common/enum";

import Verification from "@/components/verification/verificationTable";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";


interface Verificationinfo {
  _id?: string;
  verifier_id: string;
  verifier_username: string;
  requester_id: string;
  requester_username?: string;
  document_id: string;
  verification_status: string;
  comment?: string;
  verified_at?: string;
  doc_type: string;
  Requester?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    userName?: string;
    profilePic?: string;
  };
  result?: Record<string, unknown>;
}
const BusinessTabs = () => {
  const [experience, setexperience] = useState<Verificationinfo[] | null>(null);
  const [project,setproject] = useState<Verificationinfo[] | null>(null);
  const [education,seteducation] = useState<Verificationinfo[] | null>(null);
  const [business,setbusiness] = useState<Verificationinfo[]| null>(null);
  const [other, setother] = useState<Verificationinfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await apiHelperService.getAllVerification();
        const data = response?.data?.data;
        
      const tempExperience: Verificationinfo[] = [];
      const tempProject: Verificationinfo[] = [];
      const tempEducation: Verificationinfo[] = [];
      const tempBusiness: Verificationinfo[] = [];
      const tempOther: Verificationinfo[] = [];

      // Iterate through data and assign based on doc_type
      if(data)
      {

      data.forEach((item:Verificationinfo) => {
        switch (item.doc_type) {
          case 'experience':
            tempExperience.push(item); 
            break;
          case 'project':
            tempProject.push(item);     
            break;
          case 'education':
            tempEducation.push(item);
            break;
          case 'business':
            tempBusiness.push(item);
            break;
          case 'skill':
            tempExperience.push(item);
            break;
          case 'domain':
            tempBusiness.push(item);
            break;
          default:
            tempOther.push(item);
            break;
        }
      });
      setexperience(tempExperience);
      setproject(tempProject);
      seteducation(tempEducation);
      setbusiness(tempBusiness);
      setother(tempOther);
      setLoading(false); // Stop loading after data processing
    }
    else{
    toast({
      title: "Error",
      description: Messages.FETCH_ERROR("verification"),
      variant: "destructive",
    });
  }

    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("verification"),
        variant: "destructive",
      });
      setLoading(false); // Stop loading in case of an error
    }
  };

  fetchBusiness();
}, [toast]);


  return (
    <AdminDashboardLayout
      active="Business"
      breadcrumbItems={[
        { label: "Dashboard", link: "" },
        { label: "Oracle Verification", link: "/verification" },
      ]}
    >
      <Tabs defaultValue="Experience">
        <TabsList className="flex w-full justify-between gap-2">
          <TabsTrigger value="Experience" className="flex-1 text-center">
          Experience
          </TabsTrigger>
          <TabsTrigger
            value="Project"
            className="flex-1 text-center"
          >
           Project
          </TabsTrigger>
          <TabsTrigger value="Education" className="flex-1 text-center">
          Education
          </TabsTrigger>
          <TabsTrigger
            value="Business"
            className="flex-1 text-center"
          >
           Business
          </TabsTrigger>
          <TabsTrigger value="Other" className="flex-1 text-center">
          Other
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Experience">
          <Verification Data={experience} />
        </TabsContent>
        <TabsContent value="Project">
          <Verification Data={project} />
        </TabsContent>
        <TabsContent value="Education">
          <Verification Data={education} />
        </TabsContent>
        <TabsContent value="Business">
          <Verification Data={business}/>
        </TabsContent>
        <TabsContent value="Other">
          <Verification Data={other} />
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};
export default BusinessTabs;
