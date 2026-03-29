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

import {ProfileCard}  from "../profileCard/ProfileCard"
/* ---------- helpers ---------- */

const fetchUserProfile = async (id: string) => {
  const { data } = await apiHelperService.getAllFreelancerPersonalInfo(id);
  
  // Extract skills and domains from attributes array
  const attributes = data.data.attributes || [];
  const skills = attributes
    .filter((attr: any) => attr?.type === "SKILL" && attr?.name)
    .map((skill: any) => ({
      name: skill.name,
      experience: skill.experience,
      level: skill.level,
      _id: skill._id,
    }));
  
  const domain = attributes
    .filter((attr: any) => attr?.type === "DOMAIN" && attr?.name)
    .map((dom: any) => ({
      name: dom.name,
      experience: dom.experience,
      level: dom.level,
      _id: dom._id,
    }));
  
  return {
    profile: data.data,
    education: Object.values(data.data.education ?? {}),
    projects: Object.values(data.data.projects ?? {}),
    professional: Object.values(data.data.professionalInfo ?? {}),

    skills: skills,
    domain: domain,
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
      <div className="flex flex-col py-2">
        <h2 className="text-2xl font-bold pb-6 tracking-tight text-foreground">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
          {visible.length ? (
            visible.map((d, i) => <Card key={i} data={d} />)
          ) : (
            <div className="text-center py-10 w-full col-span-full border rounded-xl bg-muted/20 border-dashed">
              <PackageOpen className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-sm text-muted-foreground font-medium">{fallback}</p>
            </div>
          )}
        </div>
        {data.length > 3 && (
          <div className="text-center mt-2 mb-6">
            <button
              onClick={() => toggleShowAll(sectionKey)}
              className="px-6 py-2.5 text-sm font-semibold text-foreground bg-secondary rounded-lg border shadow-sm hover:bg-secondary/80 focus:ring-2 focus:ring-ring transition-colors"
            >
              {showAll[sectionKey] ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
        <Separator className="my-6 block opacity-50" />
      </div>
    );
  };

  const profileToDisplay = apiProfile ?? parentProfile;

  return (
    <div className="flex flex-col gap-6 w-full px-6 py-6 overflow-hidden">
      <div className="flex flex-col py-2">
        <h2 className="text-2xl font-bold pb-6 tracking-tight text-foreground">
          Personal Information
        </h2>
        {profileToDisplay ? (
          <UserProfilePage profile={profileToDisplay} />
        ) : (
          <div className="text-center py-10 w-full border rounded-xl bg-muted/20 border-dashed">
            <PackageOpen className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-sm text-muted-foreground font-medium">No personal information available.</p>
          </div>
        )}
      </div>

      <Separator className="my-6 block opacity-50" />

      {/* NEW: Profiles section using apiProfile data */}
      {parentProfile && (
        <div className="flex flex-col py-2">
          <h2 className="text-2xl font-bold pb-6 tracking-tight text-foreground">
            Profiles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {/* Assuming ProfileCard takes the whole apiProfile object as a prop */}
            <ProfileCard data={parentProfile} />
          </div>
          <Separator className="my-6 block opacity-50" />
        </div>
      )}

      {/* The rest of your existing sections, now correctly aligned below the new one */}
      {renderSection({
        title: "Education",
        data: apiEducation,
        Card: EducationCard,
        sectionKey: "educationApi",
        fallback: "No education data available.",
      })}

      {renderSection({
        title: "Projects",
        data: apiProjects,
        Card: ProjectsCard,
        sectionKey: "projectsApi",
        fallback: "No project data available.",
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
        fallback: "No skill information available.",
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