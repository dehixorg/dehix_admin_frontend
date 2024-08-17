'use client';
import { Search, UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import DropdownProfile from '@/components/shared/DropdownProfile';
import { Input } from '@/components/ui/input';
import { RootState } from '@/lib/store';
import SidebarMenu from '@/components/menu/sidebarMenu';
import Breadcrumb from '@/components/shared/breadcrumbList';
import CollapsibleSidebarMenu from '@/components/menu/collapsibleSidebarMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    menuItemsBottom,
    menuItemsTop,
} from '@/config/menuItems/freelancer/projectMenuItems';
import { axiosInstance } from '@/lib/axiosinstance';
import { Card } from '@/components/ui/card';

interface Project {
    _id: string;
    projectName: string;
    description: string;
    email: string;
    verified?: any;
    isVerified?: string;
    companyName: string;
    start?: Date;
    end?: Date;
    skillsRequired: string[];
    experience?: string;
    role: string;
    projectType: string;
    totalNeedOfFreelancer?: {
        category?: string;
        needOfFreelancer?: number;
        appliedCandidates?: string[];
        rejected?: string[];
        accepted?: string[];
        status?: string;
    }[];
    status?: string;
    team?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export default function CurrentProject() {
    const user = useSelector((state: RootState) => state.user);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(
                    `/freelancer/${user.uid}/project?status=Active`,
                ); // Fetch data from API
                setProjects(response.data.data); // Store all projects initially
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        fetchData(); // Call fetch data function on component mount
    }, [user.uid]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SidebarMenu
                menuItemsTop={menuItemsTop}
                menuItemsBottom={menuItemsBottom}
                active="Current Projects"
            />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <CollapsibleSidebarMenu
                        menuItemsTop={menuItemsTop}
                        menuItemsBottom={menuItemsBottom}
                        active="Current Projects"
                    />
                    <Breadcrumb
                        items={[
                            { label: 'Freelancer', link: '/dashboard/freelancer' },
                            {
                                label: 'Projects',
                                link: '/freelancer/project/current',
                            },
                            {
                                label: 'Current Projects',
                                link: '#',
                            },
                        ]}
                    />
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                        />
                    </div>
                    <DropdownProfile />
                </header>

                <div className="container mx-auto px-2 sm:px-4 lg:px-6">
                    {' '}
                    <div className="mx-2 sm:mx-4 lg:mx-6">
                        <div className="mt-5 items-center justify-center p-4">
                            {' '}
                            <div className="">
                                <div className="flex p-1 space-x-2">
                                    {' '}
                                    <Card className="pre-wrap flex flex-col w-full lg:w-7/12">
                                        <div className="flex flex-col items-center space-y-4">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src="/user.png" alt="@shadcn" />
                                                <AvatarFallback>
                                                    <UserIcon size={16} />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="p-2 text-center">
                                                <h1 className="text-2xl font-bold">Tushar</h1>
                                                <p className="text-gray-600">tushar:Freelancer</p>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card className="w-full lg:w-5/12 flex flex-col">
                                        <div className="p-2">
                                            {' '}
                                            {/* Reduced padding */}
                                            <div className="mt-2">
                                                <h2 className="text-2xl font-semibold">
                                                    Contact Information :
                                                </h2>
                                                <ul className="list-none space-y-2 mt-2">
                                                    <li>
                                                        <a
                                                            href="mailto:rtushar2708@gmail.com"
                                                            className="text-blue-600"
                                                        >
                                                            rtushar2708@gmail.com
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="tel:+918287907371"
                                                            className="text-blue-600"
                                                        >
                                                            +918287907371
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="https://asas.aa"
                                                            target="_blank"
                                                            className="text-blue-600"
                                                            rel="noreferrer"
                                                        >
                                                            GitHub
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="https://www.dqs.com"
                                                            target="_blank"
                                                            className="text-blue-600"
                                                            rel="noreferrer"
                                                        >
                                                            LinkedIn
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="https://www.dqs.com"
                                                            target="_blank"
                                                            className="text-blue-600"
                                                            rel="noreferrer"
                                                        >
                                                            Personal Website
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="mt-2">
                                                <h2 className="text-2xl font-semibold">
                                                    Professional Summary :
                                                </h2>
                                                {/* Professional summary here */}
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <Card className="w-full mt-2">
                                    {' '}
                                    {/* Reduced margin */}
                                    <div className="p-2">
                                        {' '}
                                        {/* Reduced padding */}
                                        <div className="mt-2">
                                            <h2 className="text-2xl font-semibold">
                                                Project Information :
                                            </h2>
                                            <p className="mt-2">Oracle Project Status: Not Applied</p>
                                            <p>Accepted Projects: 0</p>
                                            <p>Pending Projects: 10</p>
                                            <p>Rejected Projects: 0</p>
                                        </div>
                                    </div>
                                </Card>

                                <div className="flex p-1 space-x-2 mt-2">
                                    {' '}
                                    {/* Reduced padding */}
                                    <Card className="flex-1">
                                        <div className="p-2">
                                            {' '}
                                            {/* Reduced padding */}
                                            <h2 className="text-2xl font-semibold h-30 w-50">
                                                Education:
                                            </h2>
                                        </div>
                                    </Card>
                                    <div className="flex-1">
                                        <Card>
                                            <div className="p-2">
                                                {' '}
                                                <h2 className="text-2xl font-semibold h-30 w-50">
                                                    Resume
                                                </h2>
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a
                                                    className="mt-4 text-white bg-blue-600 p-2 rounded inline-block"
                                                    href=""
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Download Resume
                                                </a>
                                            </div>
                                        </Card>
                                        <Card className="mt-2">
                                            <div className="p-2">
                                                {' '}
                                                {/* Reduced padding */}
                                                <h2 className="text-xl font-semibold">
                                                    Additional Information
                                                </h2>
                                                <p>Date of Birth: Not provided</p>
                                                <p>References: Name - string, Contact - string</p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                <Card className="w-full mt-2">
                                    {' '}
                                    {/* Reduced margin */}
                                    <div className="p-2">
                                        {' '}
                                        {/* Reduced padding */}
                                        <h2 className="text-2xl font-semibold">
                                            Project Information :
                                        </h2>
                                        <p>Account Created: 2024-08-14T11:19:25.799Z</p>
                                        <p>Last Updated: 2024-08-14T11:19:25.799Z</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}