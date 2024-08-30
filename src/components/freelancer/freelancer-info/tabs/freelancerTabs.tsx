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
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="Personal-Info">Personal-Info</TabsTrigger>
        <TabsTrigger value="Professional-Info">Professional-Info</TabsTrigger>
        <TabsTrigger value="Project">Project</TabsTrigger>
        <TabsTrigger value="Oracle-Project">Oracle-Project</TabsTrigger>
        <TabsTrigger value="Skill-Domain">Skill/Domain</TabsTrigger>
        <TabsTrigger value="Educational-Info">Educational-Info</TabsTrigger>
      </TabsList>
      <TabsContent value="Personal-Info">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Professional-Info">
      <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Project">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Oracle-Project">
      <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Skill-Domain">
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