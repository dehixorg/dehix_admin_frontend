"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FreelancerTable from "@/components/dehixtalent/table/freelancertable";
import BusinessTable from "@/components/dehixtalent/table/businesstable";

function TalentTabs() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Tabs defaultValue="FreelancerTable">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="FreelancerTable">FreeLancer</TabsTrigger>
          <TabsTrigger value="BusinessTable">Business</TabsTrigger>
        </TabsList>
        <TabsContent value="FreelancerTable">
          <FreelancerTable />
        </TabsContent>
        <TabsContent value="BusinessTable">
          <BusinessTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TalentTabs;
