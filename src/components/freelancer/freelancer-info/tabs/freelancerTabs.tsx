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
import EducationalInfo from "./educationalInfo/educationalInfo";
import SkillDomain from "./skillDomain/skillDomain";
import Project from "./project/project";
import OracleProject from "./oracleProject/oracleProject";

function FreelancerTabs() {
  return (
    <div className="">
    <Tabs defaultValue="Personal-Info" >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="Personal-Info">Personal-Info</TabsTrigger>
        <TabsTrigger value="Project">Projects</TabsTrigger>
        <TabsTrigger value="Oracle-Project">Oracle-Project</TabsTrigger>
        <TabsTrigger value="Skill-Domain">Skill/Domain</TabsTrigger>
      </TabsList>
      <TabsContent value="Personal-Info">
        <PersonalInfo/>
      </TabsContent>
      <TabsContent value="Project">
        <Project/>
      </TabsContent>
      <TabsContent value="Oracle-Project">
      <OracleProject/>
      </TabsContent>
      <TabsContent value="Skill-Domain">
        <SkillDomain/>
      </TabsContent>
    </Tabs>
    </div>
  );
}
export default FreelancerTabs;