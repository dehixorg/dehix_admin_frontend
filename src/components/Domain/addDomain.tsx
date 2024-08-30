import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { axiosInstance } from '@/lib/axiosinstance';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectItem,
    SelectValue,
    SelectContent,
} from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";

interface DomainData {
    domain: string;
    description: string;
}
interface Domain {
    label: string;
  }

const domainSchema = z.object({
    domain: z.string().nonempty('Please select a domain'),
    description: z.string().nonempty('Please enter a description'),
});

const AddDomain: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [domains, setDomains] = useState<Domain[]>([]);
    const { control, handleSubmit, formState: { errors }, reset } = useForm<DomainData>({
        resolver: zodResolver(domainSchema),
        defaultValues: {
            domain: '',
            description: '',
        },
    });
    useEffect(() => {
        async function fetchDomains() {
            try {
                const response = await axiosInstance.get('/domain/all');
                setDomains(response.data.data);
            } catch (error) {
                console.error('Error fetching domains:', error);
            }
        };

        fetchDomains();
    }, []);

    const onSubmit = async (data: DomainData) => {
        try {
            console.log('Submitting data:', data);
            await axiosInstance.post(`/domain/create`, data);
            reset();
            setOpen(false);
        } catch (error) {
            console.error('Error submitting domain:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Domain
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>Add Domain</DialogTitle>
                    <DialogDescription>
                        Enter the domain details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Controller
                            control={control}
                            name="domain"
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    onValueChange={(value) => field.onChange(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {domains.map((domain) => (
                                            <SelectItem key={domain.label} value={domain.label}>
                                                {domain.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.domain && (
                            <p className="text-red-600">{errors.domain.message}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    placeholder="Description"
                                    {...field}
                                    className="border p-2 rounded mt-2 w-full h-[130px]"
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-red-600">{errors.description.message}</p>
                        )}
                    </div>
                    <DialogFooter className="mt-3">
                        <Button className="w-full" type="submit">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDomain;
