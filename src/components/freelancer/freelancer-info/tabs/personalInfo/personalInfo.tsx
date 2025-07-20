"use client";
import { PackageOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  educationCard as EducationCard,
} from "../educationalInfo/educationalInfo";
import {
  projectsCard as ProjectsCard,
} from "../professionalProjects/professionalProjects";
import { UserProfilePage } from "../personalinfoCards/personalinfoCards";
import { ProfessionalCard } from "../professionalInfo/professionalinfoCard";
import { Talentcard } from "../talent/talentCards";
import { ConsultantCards } from "../consultant/ConsultantCards";

import { Separator } from "@/components/ui/separator";
import { apiHelperService } from "@/services/freelancer";

/* ---------- helpers ---------- */

const fetchUserProfile = async (id: string) => {
  console.log(id)
  const { data } = await apiHelperService.getAllFreelancerPersonalInfo(id);
  console.log(data.data)
  return {
    profile: data.data, // full object from API
    education: Object.values(data.data.education ?? {}),
    projects: Object.values(data.data.projects ?? {}),
    professional: Object.values(data.data.professionalInfo ?? {}),
    talent: Object.values(data.data.dehixTalent ?? {}),
    consultant: Object.values(data.consultant ?? {}),
  };
};

/* ---------- component ---------- */

interface PersonalInfoProps {
  id?: string;
  /** Profile passed down from parent */
  profile?: any;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ id, profile }) => {
  /* one set for the PARENT profile… */
  const [parentProfile, setParentProfile] = useState<any>(null);
  const [parentEducation, setParentEducation] = useState<any[]>([]);
  const [parentProjects, setParentProjects] = useState<any[]>([]);
  const [parentProfessional, setParentProfessional] = useState<any[]>([]);
  const [parentTalent, setParentTalent] = useState<any[]>([]);
  const [parentConsultant, setParentConsultant] = useState<any[]>([]);

  /* …and one set for the API profile */
  const [apiProfile, setApiProfile] = useState<any>(null);
  const [apiEducation, setApiEducation] = useState<any[]>([]);
  const [apiProjects, setApiProjects] = useState<any[]>([]);
  const [apiProfessional, setApiProfessional] = useState<any[]>([]);
  const [apiTalent, setApiTalent] = useState<any[]>([]);
  const [apiConsultant, setApiConsultant] = useState<any[]>([]);

  /* flags for “Show More / Show Less” */
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const toggleShowAll = (key: string) =>
    setShowAll((p) => ({ ...p, [key]: !p[key] }));

  /* ---------- 1️⃣ react to the parent‑supplied profile ---------- */
  useEffect(() => {
    if (!profile) return;
    setParentProfile(profile);
    setParentEducation(Object.values(profile.education ?? {}));
    setParentProjects(Object.values(profile.projects ?? {}));
    setParentProfessional(Object.values(profile.professionalInfo ?? {}));
    setParentTalent(Object.values(profile.dehixTalent ?? {}));
    setParentConsultant(Object.values(profile.consultant ?? {}));
  }, [profile]);

  /* ---------- 2️⃣ react to the `id` → fetch from API ---------- */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const {
          profile: p,
          education,
          projects,
          professional,
          talent,
          consultant,
        } = await fetchUserProfile(id);

        setApiProfile(p);
        setApiEducation(education);
        setApiProjects(projects);
        setApiProfessional(professional);
        setApiTalent(talent);
        setApiConsultant(consultant);
        console.log(apiProfile)
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      }
    })();
  }, [id]);

  /* ---------- helper for rendering each data block ---------- */
  const renderSection = <T,>({
    title,
    data,
    Card,
    sectionKey,
    fallback,
  }: {
    title: string;
    data: T[];
    Card: React.ComponentType<{ data: T }>;
    sectionKey: string;
    fallback: string;
  }) => {
    const visible = showAll[sectionKey] ? data : data.slice(0, 3);

    return (
      <div>
        <h2 className="text-3xl font-semibold pb-6 tracking-tight">{title}</h2>

        <div className="grid gap-4 pb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visible.length ? (
            visible.map((d, i) => <Card key={i} data={d} />)
          ) : (
            <div className="text-center py-10 w-full">
              <PackageOpen className="mx-auto text-gray-500" size={100} />
              <p className="text-gray-500">{fallback}</p>
            </div>
          )}
        </div>

        {data.length > 3 && (
          <div className="text-center mt-4">
            <button
              onClick={() => toggleShowAll(sectionKey)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              {showAll[sectionKey] ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

        <Separator className="my-1" />
      </div>
    );
  };

  /* ---------- choose which profile to display (or both) ---------- */
  const profileToShow = apiProfile ?? parentProfile; // ← pick one
  // If you literally want to show both, render two <UserProfilePage … />

  return (
    <div className="grid auto-rows-max gap-4 md:gap-8">
      <h2 className="text-3xl font-semibold pl-4 pt-1 tracking-tight">Personal Information</h2>

      {profileToShow ? (
        <UserProfilePage profile={profileToShow} />
      ) : (
        <div className="text-center py-10">
          <PackageOpen className="mx-auto text-gray-500" size={100} />
          <p className="text-gray-500">No data available.</p>
        </div>
      )}

      <Separator className="my-1" />
      
      {apiProfile && (
        <>
          {renderSection({
            title: "Education",
            data: apiEducation,
            Card: EducationCard,
            sectionKey: "educationApi",
            fallback: "No education data (API).",
          })}

          {renderSection({
            title: "Projects",
            data: apiProjects,
            Card: ProjectsCard,
            sectionKey: "projectsApi",
            fallback: "No project data.",
          })}
        </>
      )}

      {/* common sections (if you only want ONE combined list, merge arrays first) */}
      {renderSection({
        title: "Professional Info",
        data: [...parentProfessional, ...apiProfessional],
        Card: ProfessionalCard,
        sectionKey: "professional",
        fallback: "No professional information available.",
      })}

      {renderSection({
        title: "Dehix Talent",
        data: [...parentTalent, ...apiTalent],
        Card: Talentcard,
        sectionKey: "talent",
        fallback: "No talent information available.",
      })}

      {renderSection({
        title: "Consultant",
        data: [...parentConsultant, ...apiConsultant],
        Card: ConsultantCards,
        sectionKey: "consultant",
        fallback: "No consultant information available.",
      })}
    </div>
  );
};

export default PersonalInfo;
