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

interface RenderDataSectionProps<T> {
  title: string;

  data: T[];
  CardComponent: React.ComponentType<{ data: T }>;
  fallbackMessage: string;
}


const PersonalInfo: React.FC<PersonalInfoProps> = ({ id }) => {
  // Use id prop
  const [educationData, setEducationData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [professionalData, setProfessionalData] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [talentData, settalent] = useState<any[]>([]);
  const [consultantData, setconsultant] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userProfileData = await fetchUserProfile(id); // Use id prop
      setEducationData(userProfileData.educationData);
      setProjectsData(userProfileData.projectsData);
      setProfileData(userProfileData.profileData);
      settalent(userProfileData.talent);
      setconsultant(userProfileData.consultant);

      setProfessionalData(userProfileData.professionalData);
    };

    if (id) {
      fetchData();
    }
  }, [id]);


  const renderDataSection = <T,>({
  title,
  data,
  CardComponent,
  fallbackMessage,
}: RenderDataSectionProps<T>) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 3);

  return (
    <div>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {title}
      </h2>

      {/* Responsive Grid Container */}
      <div className="grid gap-4 pb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {visibleData.length > 0 ? (
          visibleData.map((item, index) => (
            <CardComponent key={index} data={item} />
          ))
        ) : (
          <div className="text-center py-10 w-full">
            <PackageOpen className="mx-auto text-gray-500" size="100" />
            <p className="text-gray-500">{fallbackMessage}</p>
          </div>
        )}
      </div>

      {/* Show More / Show Less Button */}
      {data.length > 3 && (
        <div className="text-center mt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      <Separator className="my-1" />
    </div>
  );
};

  
  



return (
  <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Personal Information
      </h2>
      <div >

        {profileData ? (
          <UserProfilePage
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

    {renderDataSection({
      title: "Education Info",
      data: educationData,
      CardComponent: ({ data }) => <EducationCard education={data} />,
      fallbackMessage: "No education information available.",
    })}

    {renderDataSection({
      title: "Projects Info",
      data: projectsData,
      CardComponent: ({ data }) => <ProjectsCard projects={data} />,
      fallbackMessage: "No project information available.",
    })}

    {renderDataSection({
      title: "Professional Info",
      data: professionalData,
      CardComponent: ({ data }) => <ProfessionalCard info={data} />,
      fallbackMessage: "No professional information available.",
    })}

    {renderDataSection({
      title: "Dehix Talent",
      data: talentData,
      CardComponent: ({ data }) => <Talentcard info={data} />,
      fallbackMessage: "No talent information available.",
    })}

    {renderDataSection({
      title: "Consultant",
      data: consultantData,
      CardComponent: ({ data }) => <ConsultantCards info={data} />,
      fallbackMessage: "No consultant information available.",
    })}
  </div>
);
};

export default PersonalInfo;
