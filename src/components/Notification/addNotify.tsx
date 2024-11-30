import React, { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { AiOutlineCloudUpload } from "react-icons/ai"; // Cloud upload icon

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"; 
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axiosinstance";
import { useToast } from "@/components/ui/use-toast";

interface ImportantUrl {
  urlName: string;
  url: string;
}

interface FAQData {
  heading: string;
  description: string;
  type: string;
  status: string;
  importantUrl: ImportantUrl[];
  image: FileList;
}

const faqSchema = z.object({
  heading: z.string().nonempty("Please enter a heading"),
  description: z.string().nonempty("Please enter a description"),
  type: z.enum(["both", "business", "freelancer"]),
  status: z.enum(["active"]).default("active"),
  importantUrl: z
    .array(
      z.object({
        urlName: z.string().nonempty("Please enter the URL name"),
        url: z.string().url("Please enter a valid URL"),
      }),
    )
    .nonempty({ message: "Please add at least one URL" }),
  image: z
    .any()
    .refine((files) => files && files.length === 1, "Please upload an image")
    .refine(
      (files) =>
        files &&
        ["image/jpeg", "image/jpg", "image/png"].includes(files[0]?.type),
      "Only .jpg, .jpeg, and .png files are allowed",
    ),
});

const AddNotify: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FAQData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      heading: "",
      description: "",
      type: "both",
      status: "active",
      importantUrl: [{ urlName: "", url: "" }],
      image: undefined,
    },
  });
  const { toast } = useToast();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "importantUrl",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FAQData) => {
    try {
      const formData = new FormData();
      formData.append("heading", data.heading);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("status", data.status);
      data.importantUrl.forEach((url, index) => {
        formData.append(`importantUrl[${index}][urlName]`, url.urlName);
        formData.append(`importantUrl[${index}][url]`, url.url);
      });
      if (data.image) {
        formData.append("image", data.image[0]);
      }

      await axiosInstance.post(
        "", // API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the notification.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add Notification</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form content */}
          <div className="flex justify-between mt-4">
            <Button type="submit" className="bg-gray-500 text-white">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNotify;
