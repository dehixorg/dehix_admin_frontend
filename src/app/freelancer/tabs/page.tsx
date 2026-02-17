"use client";
import { useSearchParams } from "next/navigation";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfo from "@/components/freelancer/freelancer-info/tabs/personalInfo/personalInfo";
import DehixTalent from "@/components/freelancer/freelancer-info/tabs/dehixtalent/dehixTalent";
import Project from "@/components/freelancer/freelancer-info/tabs/project/project";
import OracleProject from "@/components/freelancer/freelancer-info/tabs/oracleProject/oracleProject";

const FreelancerPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return (
    <AdminDashboardLayout
      active="Freelancer"
      breadcrumbItems={[
        { label: "Freelancer", link: "/freelancer" },
        { label: id as string, link: "#" },
      ]}
      mainClassName="ml-5 mr-5"
    >
      <Tabs defaultValue="Personal-Info">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Personal-Info">Personal-Info</TabsTrigger>
          <TabsTrigger value="Project">Projects</TabsTrigger>
          <TabsTrigger value="Oracle-Project">Oracle</TabsTrigger>
          <TabsTrigger value="Skill-Domain">Dehix Talent</TabsTrigger>
        </TabsList>
        <TabsContent value="Personal-Info">
          <PersonalInfo  id={id || ""} />
        </TabsContent>
        <TabsContent value="Project">
          <Project  id={id || ""} />
        </TabsContent>
        <TabsContent value="Oracle-Project">
          <OracleProject  profile id={id || ""} />
        </TabsContent>
        <TabsContent value="Skill-Domain">
          <DehixTalent  profile id={id || ""} />
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};
export default FreelancerPage;