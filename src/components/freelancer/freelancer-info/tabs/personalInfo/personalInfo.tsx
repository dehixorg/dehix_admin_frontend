"use client";
import { PackageOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

import { educationCard as EducationCard } from "../educationalInfo/educationalInfo";
import { projectsCard as ProjectsCard } from "../professionalProjects/professionalProjects";
import { UserProfilePage } from "../personalinfoCards/personalinfoCards";
import { ProfessionalCard } from "../professionalInfo/professionalinfoCard";
import { Talentcard } from "../talent/talentCards";
import { ConsultantCards } from "../consultant/ConsultantCards";

import { Separator } from "@/components/ui/separator";
import { apiHelperService } from "@/services/freelancer";

const fetchUserProfile = async (id: string) => {
  try {
    const response = await apiHelperService.getAllFreelancerPersonalInfo(id);
    const educationData = Object.values(response.data.education || {});
    const projectsData = Object.values(response.data.projects || {});
    const professionalData = Object.values(
      response.data.professionalInfo || {},
    );
    const talent = Object.values(response.data.dehixTalent || {});
    const consultant = Object.values(response.data.consultant || {});
    const profileData = response.data;
  
    return {
      educationData,
      projectsData,
      profileData,
      professionalData,
      talent,
      consultant,
    };
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return {
      educationData: [],
      projectsData: [],
      professionalData: [],
      talent: [],
      consultant: [],
    };
  }
};

interface PersonalInfoProps {
  id: string; // Add id prop
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ id }) => {
  // Use id prop
  const [educationData, setEducationData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [info, setInfo] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [talent, settalent] = useState<any[]>([]);
  const [consultant, setconsultant] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userProfileData = await fetchUserProfile(id); // Use id prop
      setEducationData(userProfileData.educationData);
      setProjectsData(userProfileData.projectsData);
      setProfileData(userProfileData.profileData);
      settalent(userProfileData.talent);
      setconsultant(userProfileData.consultant);

      setInfo(userProfileData.professionalData);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Personal Information
      </h2>
      <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8">
        {profileData ? (
          <UserProfilePage
            className="min-w-[35%]"
            profile={profileData} // Pass profile data
          />
        ) : (
          <div className="text-center py-10 w-[100%]">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
      <Separator className="my-1" />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Education-Info
      </h2>
      <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8">
        {educationData.length > 0 ? (
          educationData.map((education: any, index: number) => (
            <EducationCard
              key={index}
              className="min-w-[35%]"
              education={education}
            />
          ))
        ) : (
          <div className="text-center py-10 w-[100%]">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
      <Separator className="my-1" />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Projects-Info
      </h2>
      <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8">
        {projectsData.length > 0 ? (
          projectsData.map((project: any, index: number) => (
            <ProjectsCard
              key={index}
              className="min-w-[35%]"
              projects={project}
            />
          ))
        ) : (
          <div className="text-center py-10 w-[100%]">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
      <Separator className="my-1" />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Professional-Info
      </h2>
      <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8">
        {info.length > 0 ? (
          info.map((project: any, index: number) => (
            <ProfessionalCard key={index} info={project} />
          ))
        ) : (
          <div className="text-center py-10 w-[100%]">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
      <Separator className="my-1" />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Dehix-Talent
      </h2>
      <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8">
        {talent.length > 0 ? (
          talent.map((talent: any, index: number) => (
            <Talentcard key={index} info={talent} />
          ))
        ) : (
          <div className="text-center py-10 w-[100%]">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
      <Separator className="my-1" />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Consultant
      </h2>
      <div className="flex gap-4 overflow-x-scroll no-scrollbar pb-8">
        {consultant.length > 0 ? (
          consultant.map((talent: any, index: number) => (
            <ConsultantCards key={index} info={talent} />
          ))
        ) : (
          <div className="text-center py-10 w-[100%]">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
