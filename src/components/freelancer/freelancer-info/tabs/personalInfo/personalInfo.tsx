'use client';
import { useSelector } from 'react-redux';
import { PackageOpen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { RootState } from '@/lib/store';
import { axiosInstance } from '@/lib/axiosinstance';
import { Separator } from '@/components/ui/separator';
import { educationCard as EducationCard } from '../educationalInfo/educationalInfo'; 
import { projectsCard as ProjectsCard } from '../professionalProjects/professionalProjects';

const fetchUserProfile = async (uid: string) => {
  try {
    const freelancer_id = 'gCtAoAMpAHNUkJdyj0zmTFwbmL22';
    const response = await axiosInstance.get(`/freelancer/${freelancer_id}`);
    const educationData = Object.values(response.data.education || {});
    const projectsData = Object.values(response.data.projects || {}); // Convert to array
    console.log('Education:', educationData);
    console.log('Projects:', projectsData);
  
    return { educationData, projectsData };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return { educationData: [], projectsData: [] };
  }
};

export default function PersonalInfo() {
  const user = useSelector((state: RootState) => state.user);
  const [educationData, setEducationData] = useState<any[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const userProfileData = await fetchUserProfile(user.uid);
      setEducationData(userProfileData.educationData);
      setProjectsData(userProfileData.projectsData);
    };

    fetchData();
  }, [user.uid]);

  
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Personal Information
      </h2>
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
    </div>
  );
}
