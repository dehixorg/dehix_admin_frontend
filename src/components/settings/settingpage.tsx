"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { axiosInstance } from "@/lib/axiosinstance";
import { toast } from '../ui/use-toast';
import * as React from "react";
import { useState, useEffect } from "react";
import { apiHelperService } from "@/services/admin";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProfilePictureUpload from "@/components/picture_upload/profile_picture";
import { z } from 'zod';

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First Name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Email must be a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
  userName: z.string().min(4,{
    message: 'Username must be 4 character long. '
  }),
});
interface CurrentUserDetailsProps {
  user_id: string;
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const CurrentUserDetails: React.FC <CurrentUserDetailsProps> = ({ user_id }) => {
  //const user1 = "emJFgSdULVesBMqVrd7nQTQ2FhB2";
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userName:'',
    },
    mode: 'all',
  });
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await apiHelperService.getAdminInfo(user_id);
        const userData = response?.data.data || null;

        if (userData) {
          setUser(userData);
          
        } else {
          throw new Error("User details not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    form.reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      userName: user?.userName||'',
    });
  }, [user]);

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    try {
       await axiosInstance.put(`/admin/${user_id}`, {
         ...data,
       });

      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        userName: data.userName,
      });

      // You can update other fields here as needed
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.message) {
        // Show the error message from the backend
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'User Name already taken',
        });
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again later.',
      });
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loading User Details...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
        <Form {...form}>
                 <div>
                <ProfilePictureUpload user_id={user._id} profile={user.profilePic} />
                </div> 
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-6">
                {[
                  { name: 'userName', label: 'User Name', placeholder: 'Enter your user name' },
                  { name: 'firstName', label: 'First Name', placeholder: 'Enter your first name' },
                  { name: 'lastName', label: 'Last Name', placeholder: 'Enter your last name' },
                  { name: 'email', label: 'Email', placeholder: 'Enter your email' },
                  { name: 'phone', label: 'Phone', placeholder: 'Enter your phone number' },
                ].map(({ name, label, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof ProfileFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <Label>{label}</Label>
                        <FormControl>
                          <Input placeholder={placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <div>
                  <Label>Status</Label>
                  <Input value={user.status} readOnly />
                </div>
                <div>
                  <Label>Created At</Label>
                  <Input value={new Date(user.createdAt).toLocaleString()} readOnly />
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <Input value={new Date(user.updatedAt).toLocaleString()} readOnly />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input value={user.type} readOnly />
                </div>
              </div>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentUserDetails;