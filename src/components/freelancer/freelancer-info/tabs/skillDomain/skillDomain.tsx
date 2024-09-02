'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { PackageOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { axiosInstance } from '@/lib/axiosinstance';

interface Skill {
    _id: string;
    name: string;
    level: string;
    experience: string;
    interviewStatus: string;
    interviewInfo: string;
    interviewerRating: number;
}

interface Domain {
    _id: string;
    name: string;
    level: string;
    experience: string;
    interviewStatus: string;
    interviewInfo: string;
    interviewerRating: number;
}

interface UserData {
    skills: Skill[];
    domain: Domain[];
}

const SkillDomain: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const freelancer_id = 'gCtAoAMpAHNUkJdyj0zmTFwbmL22';
                const response = await axiosInstance.get(`/freelancer/${freelancer_id}`);
                const { skills, domain } = response.data;
                console.log('Skills:', skills);
                console.log('Domain:', domain);
                setUserData({ skills, domain });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="">
            <div className="mb-8 mt-4">
                <Card>
                    <div className="lg:overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Id</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Experience</TableHead>
                                    <TableHead>Interview-Status</TableHead>
                                    <TableHead>Interview-Info</TableHead>
                                    <TableHead>Interviewer-Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : userData ? (
                                    <>
                                        {userData.skills.map((skill) => (
                                            <TableRow key={skill._id}>
                                                <TableCell>Skill</TableCell>
                                                <TableCell>{skill._id}</TableCell>
                                                <TableCell>{skill.name}</TableCell>
                                                <TableCell>{skill.level}</TableCell>
                                                <TableCell>{skill.experience}</TableCell>
                                                <TableCell>{skill.interviewStatus}</TableCell>
                                                <TableCell>{skill.interviewInfo}</TableCell>
                                                <TableCell>{skill.interviewerRating}</TableCell>
                                            </TableRow>
                                        ))}
                                        {userData.domain.map((domain) => (
                                            <TableRow key={domain._id}>
                                                <TableCell>Domain</TableCell>
                                                <TableCell>{domain._id}</TableCell>
                                                <TableCell>{domain.name}</TableCell>
                                                <TableCell>{domain.level}</TableCell>
                                                <TableCell>{domain.experience}</TableCell>
                                                <TableCell>{domain.interviewStatus}</TableCell>
                                                <TableCell>{domain.interviewInfo}</TableCell>
                                                <TableCell>{domain.interviewerRating}</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            <div className="text-center py-10 w-full mt-10">
                                                <PackageOpen className="mx-auto text-gray-500" size="100" />
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

export default SkillDomain;
