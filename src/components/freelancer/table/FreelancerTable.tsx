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
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface UserData {
  _id:string;
  firstName: string;
  email: string;
  phone: string;
  skills: string[];
  domain: string[];
}

const FreelancerTable: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/freelancer/allfreelancer');
        console.log('API Response:', response.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const handleRedirect = (id: string) => {
    router.push(`/freelancer/${id}`); 
  };

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email-Id</TableHead>
                  <TableHead>Phone-No.</TableHead>
                  <TableHead>Skill Count</TableHead>
                  <TableHead>Domain Count</TableHead>
                  <TableHead>More</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : userData.length > 0 ? (
                  userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.skills?.length || 0}</TableCell>
                      <TableCell>{user.domain?.length || 0}</TableCell>
                      <TableCell><Button  onClick={() => handleRedirect(user._id)}>click</Button></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
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

export default FreelancerTable;
