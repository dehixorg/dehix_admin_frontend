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
      response.data.professionalInfo || {}
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
  id?: string;
  profile?: any;
}

interface RenderDataSectionProps<T> {
  title: string;
  data: T[];
  CardComponent: React.ComponentType<{ data: T }>;
  fallbackMessage: string;
  showAll: boolean;
  toggleShowAll: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ id,profile }) => {
  const [educationData, setEducationData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [professionalData, setProfessionalData] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [talentData, settalent] = useState<any[]>([]);
  const [consultantData, setconsultant] = useState<any[]>([]);
  const [showAllSections, setShowAllSections] = useState<Record<string, boolean>>({});

  const toggleShowAll = (section: string) => {
    setShowAllSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
  const loadData = async () => {
    if (profile) {
      const educationData = Object.values(profile.education || {});
      const projectsData = Object.values(profile.projects || {});
      const professionalData = Object.values(profile.professionalInfo || {});
      const talent = Object.values(profile.dehixTalent || {});
      const consultant = Object.values(profile.consultant || {});

      setEducationData(educationData);
      setProjectsData(projectsData);
      setProfessionalData(professionalData);
      settalent(talent);
      setconsultant(consultant);
      setProfileData(profile);
    } else if (id) {
      const userProfileData = await fetchUserProfile(id);
      setEducationData(userProfileData.educationData);
      setProjectsData(userProfileData.projectsData);
      setProfileData(userProfileData.profileData);
      settalent(userProfileData.talent);
      setconsultant(userProfileData.consultant);
      setProfessionalData(userProfileData.professionalData);
    }
  };

  loadData();
}, [id, profile]);


  const renderDataSection = <T,>({
    title,
    data,
    CardComponent,
    fallbackMessage,
    showAll,
    toggleShowAll,
  }: RenderDataSectionProps<T>) => {
    const visibleData = showAll ? data : data.slice(0, 3);

    return (
      <div>
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {title}
        </h2>

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

        {data.length > 3 && (
          <div className="text-center mt-4">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={toggleShowAll}
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
      <div>
        {profileData ? (
          <UserProfilePage profile={profileData} />
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
        CardComponent: EducationCard,
        fallbackMessage: "No education information available.",
        showAll: showAllSections["education"] || false,
        toggleShowAll: () => toggleShowAll("education"),
      })}

      {renderDataSection({
        title: "Projects Info",
        data: projectsData,
        CardComponent: ProjectsCard,
        fallbackMessage: "No project information available.",
        showAll: showAllSections["projects"] || false,
        toggleShowAll: () => toggleShowAll("projects"),
      })}

      {renderDataSection({
        title: "Professional Info",
        data: professionalData,
        CardComponent: ProfessionalCard,
        fallbackMessage: "No professional information available.",
        showAll: showAllSections["professional"] || false,
        toggleShowAll: () => toggleShowAll("professional"),
      })}

      {renderDataSection({
        title: "Dehix Talent",
        data: talentData,
        CardComponent: Talentcard,
        fallbackMessage: "No talent information available.",
        showAll: showAllSections["talent"] || false,
        toggleShowAll: () => toggleShowAll("talent"),
      })}

      {renderDataSection({
        title: "Consultant",
        data: consultantData,
        CardComponent:ConsultantCards,
        fallbackMessage: "No consultant information available.",
        showAll: showAllSections["consultant"] || false,
        toggleShowAll: () => toggleShowAll("consultant"),
      })}
    </div>
  );
};

export default PersonalInfo;
