"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { PackageOpen, Eye } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axiosinstance";

interface Project {
  _id: string;
  projectName: string;
  description: string;
  companyId: string;
  email: string;
  companyName: string;
  end: string | null;
  skillsRequired: string[];
  role: string;
  projectType: string;
  profiles: Profile[];
  status: string;
  team: string[];
  url: string[];
  createdAt: string;
  updatedAt: string;
}

interface Profile {
  domain: string;
  freelancersRequired: string;
  skills: string[];
  experience: number;
  minConnect: number;
  rate: number;
  description: string;
  _id: string;
}

const ProjectTable: React.FC = () => {
  const [userData, setUserData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/business/all_project");
        console.log("API Response:", response.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>More</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.projectName}</TableCell>
                      <TableCell>{user.companyName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.profiles[0].experience}</TableCell>
                      <TableCell>{user.profiles[0].rate}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-4">
                            <DialogHeader>
                              <DialogTitle>Project Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the Project.
                              </DialogDescription>
                            </DialogHeader>
                            <div>
                              <p>
                                <strong>Project Name:</strong>{" "}
                                {user.projectName}
                              </p>
                              <p>
                                <strong>Description:</strong> {user.description}
                              </p>
                              <p>
                                <strong>Company Name:</strong>{" "}
                                {user.companyName}
                              </p>
                              <p>
                                <strong>Email:</strong> {user.email}
                              </p>
                              <p>
                                <strong>Role:</strong> {user.role}
                              </p>
                              <p>
                                <strong>Project Type:</strong>{" "}
                                {user.projectType}
                              </p>
                              <p>
                                <strong>Status:</strong> {user.status}
                              </p>
                              <p>
                                <strong>End Date:</strong>{" "}
                                {user.end ? user.end : "Ongoing"}
                              </p>
                              <p>
                                <strong>Created At:</strong> {user.createdAt}
                              </p>
                              <p>
                                <strong>Updated At:</strong> {user.updatedAt}
                              </p>

                              <p>
                                <strong>Skills Required:</strong>{" "}
                                {user.skillsRequired.length > 0 ? (
                                  <ul className="list-disc list-inside">
                                    {user.skillsRequired.map(
                                      (skill, skillIndex) => (
                                        <li key={skillIndex}>{skill}</li>
                                      ),
                                    )}
                                  </ul>
                                ) : (
                                  <span className="text-gray-500">
                                    No skills required
                                  </span>
                                )}
                              </p>

                              <p>
                                <strong>Profiles:</strong>
                              </p>
                              {user.profiles.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {user.profiles.map(
                                    (profile, profileIndex) => (
                                      <li key={profileIndex}>
                                        <p>
                                          <strong>Domain:</strong>{" "}
                                          {profile.domain}
                                        </p>
                                        <p>
                                          <strong>Freelancers Required:</strong>{" "}
                                          {profile.freelancersRequired}
                                        </p>
                                        <p>
                                          <strong>Skills:</strong>{" "}
                                          {profile.skills.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                              {profile.skills.map(
                                                (skill, index) => (
                                                  <li key={index}>{skill}</li>
                                                ),
                                              )}
                                            </ul>
                                          ) : (
                                            <span className="text-gray-500">
                                              No skills
                                            </span>
                                          )}
                                        </p>
                                        <p>
                                          <strong>Experience:</strong>{" "}
                                          {profile.experience} years
                                        </p>
                                        <p>
                                          <strong>Minimum Connections:</strong>{" "}
                                          {profile.minConnect}
                                        </p>
                                        <p>
                                          <strong>Rate:</strong> {profile.rate}{" "}
                                          per hour
                                        </p>
                                        <p>
                                          <strong>Description:</strong>{" "}
                                          {profile.description}
                                        </p>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              ) : (
                                <p className="text-gray-500">
                                  No profiles available
                                </p>
                              )}

                              <p>
                                <strong>URL Count:</strong> {user.url.length}
                              </p>
                              <ul className="list-disc list-inside">
                                {user.url.length > 0 ? (
                                  user.url.map((url, urlIndex) => (
                                    <li key={urlIndex}>
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                      >
                                        {url}
                                      </a>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-gray-500">
                                    No URLs available
                                  </li>
                                )}
                              </ul>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available.
                          <br /> This feature will be available soon.
                          <br />
                          Here you can get directly hired for different roles.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProjectTable;
