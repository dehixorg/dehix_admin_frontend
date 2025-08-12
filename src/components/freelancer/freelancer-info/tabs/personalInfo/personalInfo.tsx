"use client";
import { PackageOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

import { educationCard as EducationCard } from "../educationalInfo/educationalInfo";
import { projectsCard as ProjectsCard } from "../professionalProjects/professionalProjects";
import { UserProfilePage } from "../personalinfoCards/personalinfoCards";
import { ProfessionalCard } from "../professionalInfo/professionalinfoCard";
import { ConsultantCards } from "../consultant/ConsultantCards";

import { Separator } from "@/components/ui/separator";
import { apiHelperService } from "@/services/freelancerProfile";
import SkillCard from "../skilldomaincard/SkillCard";
import DomainCard from "../skilldomaincard/DomainCard";

/* ---------- NEW: Assuming a ProfileCard component exists ---------- */
import {ProfileCard}  from "../profileCard/ProfileCard"// You'll need to create this component and provide the correct path.


/* ---------- helpers ---------- */

const fetchUserProfile = async (id: string) => {
  const { data } = await apiHelperService.getAllFreelancerPersonalInfo(id);
  return {
    profile: data.data,
    education: Object.values(data.data.education ?? {}),
    projects: Object.values(data.data.projects ?? {}),
    professional: Object.values(data.data.professionalInfo ?? {}),

    skills: data.data.skills ?? [],
    domain: data.data.domain ?? [],
    consultant: Object.values(data.consultant ?? {}),
  };
};

const fetchProfile = async (id: string) => {
  const { data } = await apiHelperService.getFreelancerProfileById(id);
  return {
   data
  };
};

/* ---------- component ---------- */

interface PersonalInfoProps {
  id?: string;
  /** Profile passed down from parent */
  

}
let origprofile;
const PersonalInfo: React.FC<PersonalInfoProps> = ({ id }) => {
  /* one set for the PARENT profile… */
  const [parentProfile, setParentProfile] = useState<any>(null);
 
  const [parentProjects, setParentProjects] = useState<any[]>([]);
  const [parentProfessional, setParentProfessional] = useState<any[]>([]);
  const [parentSkills, setParentSkills] = useState<any[]>([]);
  const [parentDomain, setParentDomain] = useState<any[]>([]);
  const [parentConsultant, setParentConsultant] = useState<any[]>([]);

  /* …and one set for the API profile */
  const [apiProfile, setApiProfile] = useState<any>(null);
  const [apiEducation, setApiEducation] = useState<any[]>([]);
  const [apiProjects, setApiProjects] = useState<any[]>([]);
  const [apiProfessional, setApiProfessional] = useState<any[]>([]);
  const [apiSkills, setApiSkills] = useState<any[]>([]);
  const [apiDomain, setApiDomain] = useState<any[]>([]);
  const [apiConsultant, setApiConsultant] = useState<any[]>([]);

  /* flags for “Show More / Show Less” */
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const toggleShowAll = (key: string) =>
    setShowAll((p) => ({ ...p, [key]: !p[key] }));

  /* ---------- 1️⃣ react to the parent‑supplied profile ---------- */
useEffect(() => {
  if (id) {
    const getProfile = async () => {
      try {
        const pprofile = await fetchProfile(id);
        console.log(pprofile); // This will now log the resolved data
        // You can now use the resolved data here, e.g., to set a state.
        if(pprofile.data.data)
        {
          setParentProfile(pprofile.data.data)
        }
        // origprofile=pprofile // This is still not the best practice.
        // It's better to set a state variable with the data.
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    getProfile();
  }
}, [id]);



  /* ---------- 2️⃣ react to the `id` → fetch from API ---------- */
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const {
          profile: p,
          education,
          projects,
          professional,
          skills,
          domain,
          consultant,
        } = await fetchUserProfile(id);

        setApiProfile(p);
        setApiEducation(education);
        setApiProjects(projects);
        setApiProfessional(professional);
        setApiSkills(skills);
        setApiDomain(domain);
        setApiConsultant(consultant);

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
              {showAll[sectionKey] ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
        <Separator className="my-1" />
      </div>
    );
  };

  const profileToDisplay = apiProfile ?? parentProfile;

  return (
    <div className="grid auto-rows-max gap-4 md:gap-8">
      <h2 className="text-3xl font-semibold pl-4 pt-1 tracking-tight">
        Personal Information
      </h2>
      {profileToDisplay ? (
        <UserProfilePage profile={profileToDisplay} />
      ) : (
        <div className="text-center py-10">
          <PackageOpen className="mx-auto text-gray-500" size={100} />
          <p className="text-gray-500">No personal information available.</p>
        </div>
      )}
      <Separator className="my-1" />

      {/* NEW: Profiles section using apiProfile data */}
      {parentProfile && (
        <>
          <h2 className="text-3xl font-semibold pb-6 tracking-tight">
            Profiles
          </h2>
          <div className="grid gap-4 pb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Assuming ProfileCard takes the whole apiProfile object as a prop */}
            <ProfileCard data={parentProfile} />
          </div>
          <Separator className="my-1" />
        </>
      )}

      {/* The rest of your existing sections, now correctly aligned below the new one */}
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

      {/* common sections (if you only want ONE combined list, merge arrays first) */}
      {renderSection({
        title: "Professional Info",
        data: [ ...apiProfessional],
        Card: ProfessionalCard,
        sectionKey: "professional",
        fallback: "No professional information available.",
      })}

      {renderSection({
        title: "Domains",
        data: [...parentDomain, ...apiDomain],
        Card: DomainCard,
        sectionKey: "domain",
        fallback: "No domain information available.",
      })}
      {renderSection({
        title: "Skills",
        data: [ ...apiSkills],

        Card: SkillCard,
        sectionKey: "skills",
        fallback: "No Skill information available.",
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