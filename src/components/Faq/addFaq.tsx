import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"


interface ImportantUrl {
    urlName: string;
    url: string;
}

interface FAQData {
    question: string;
    answer: string;
    type: string;
    status: string;
    importantUrl: ImportantUrl[];
}

const faqSchema = z.object({
    question: z.string().nonempty('Please enter a question'),
    answer: z.string().nonempty('Please enter an answer'),
    type: z.enum(['business', 'freelancer']).default('business'),
    status: z.enum(['active']).default('active'),
    importantUrl: z
        .array(
            z.object({
                urlName: z.string().nonempty('Please enter the URL name'),
                url: z.string().url('Please enter a valid URL'),
            })
        )
        .nonempty({ message: 'Please add at least one URL' }),
});

const AddFaq: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { control, handleSubmit, formState: { errors }, reset } = useForm<FAQData>({
        resolver: zodResolver(faqSchema),
        defaultValues: {
            question: '',
            answer: '',
            type: 'business',
            status: 'active',
            importantUrl: [{ urlName: '', url: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'importantUrl',
    });

    const onSubmit = async (data: FAQData) => {
        try {
            console.log('Submitting data:', data);
            await axiosInstance.post(
                `/faq/createfaq`,
                data,
            );
            reset();
            setOpen(false);
        } catch (error) {
            console.error('Error submitting FAQ:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add FAQ
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add FAQ</DialogTitle>
                    <DialogDescription>
                        Enter the FAQ details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Controller
                            control={control}
                            name="question"
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Question"
                                    {...field}
                                    className="border p-2 rounded mt-2 w-full"
                                />
                            )}
                        />
                        {errors.question && (
                            <p className="text-red-600">{errors.question.message}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <Controller
                            control={control}
                            name="answer"
                            render={({ field }) => (
                                <Textarea
                                    placeholder="Answer"
                                    {...field}
                                    className="border p-2 rounded mt-2 w-full"
                                />
                            )}
                        />
                        {errors.answer && (
                            <p className="text-red-600">{errors.answer.message}</p>
                        )}
                    </div>
                    <div className="mb-3">
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <Select {...field} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="business">Business</SelectItem>
                                        <SelectItem value="freelancer">Freelancer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-3">
                            <Controller
                                control={control}
                                name={`importantUrl.${index}.urlName`}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="URL Name"
                                        {...field}
                                        className="border p-2 rounded mt-2 w-full"
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={`importantUrl.${index}.url`}
                                render={({ field }) => (
                                    <Input
                                        type="url"
                                        placeholder="URL"
                                        {...field}
                                        className="border p-2 rounded mt-2 w-full"
                                    />
                                )}
                            />
                            <Button
                                type="button"
                                onClick={() => remove(index)}
                                className="mt-2 bg-red-600 text-white"
                            >
                                Remove URL
                            </Button>
                        </div>
                    ))}
                    <div className="flex justify-between mt-3">
                        <Button
                            type="button"
                            onClick={() => append({ urlName: '', url: '' })}
                            className="w-full"
                        >
                            Add URL
                        </Button>
                    </div>
                    {errors.importantUrl && (
                        <p className="text-red-600">{errors.importantUrl.message}</p>
                    )}
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

export default AddFaq;
