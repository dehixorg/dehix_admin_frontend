import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import PersonalInfo from "./personalInfo/personalInfo";

function FreelancerTabs() {
  return (
    <div className="">
    <Tabs defaultValue="Personal-Info" >
      <TabsList className="grid w-full grid-cols-9">
        <TabsTrigger value="Personal-Info">Personal-Info</TabsTrigger>
        <TabsTrigger value="Professional-Info">Professional-Info</TabsTrigger>
        <TabsTrigger value="Pending-Project">Pending-Project</TabsTrigger>
        <TabsTrigger value="Rejected-Project">Rejected-Project</TabsTrigger>
        <TabsTrigger value="Accepted-Project">Accepted-Project</TabsTrigger>
        <TabsTrigger value="Oracle-Project">Oracle-Project</TabsTrigger>
        <TabsTrigger value="Skill">Skill</TabsTrigger>
        <TabsTrigger value="Domain">Domain</TabsTrigger>
        <TabsTrigger value="Educational-Info">Educational-Info</TabsTrigger>
      </TabsList>
      <TabsContent value="Personal-Info">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Professional-Info">
      <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Pending-Project">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Rejected-Project">
      <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Accepted-Project">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Oracle-Project">
      <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Skill">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Domain">
      <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Educational-Info">
        <PersonalInfo/> 
      </TabsContent>
    </Tabs>
    </div>
  );
}
export default FreelancerTabs;