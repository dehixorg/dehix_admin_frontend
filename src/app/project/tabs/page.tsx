"use client";
import { useSearchParams } from "next/navigation";

import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import ProjectTabs from "@/components/project/projectTabs/projectTabs";
import { ProjectCard } from "@/components/project/projectCard/projectCard";
import { ProjectBids } from "@/components/project/projectbids/projectBids";// Import the new component

const FreelancerPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  return (
    <AdminDashboardLayout
      active="Project"
      breadcrumbItems={[
        { label: "Dashboard", link: "" },
        { label: "Project", link: "/project" },
        { label: id as string, link: "#" },
      ]}
      mainClassName="ml-5 mr-5"
    >
      <div>
        <div className="mb-2">{id && <ProjectCard id={id} />}</div>
        <div>
          <ProjectTabs id={id || ""} />
        </div>
        {id && <ProjectBids id={id} />}
      </div>
    </AdminDashboardLayout>
  );
};
export default FreelancerPage;