import React, { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

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
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axiosinstance";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";

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
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );
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
      type: "",
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
        setImagePreview(reader.result);
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
        ``, //  API
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.ADD_ERROR("notification"),
        variant: "destructive", // Red error message
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Notification</DialogTitle>
          <DialogDescription>
            Enter the Notification details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="heading"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Heading"
                  {...field}
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.heading && (
              <p className="text-red-600">{errors.heading.message}</p>
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
                  className="border p-2 rounded mt-2 w-full"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="mb-3">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <div
                  className="border p-2 rounded mt-2 w-full text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                >
                  <label className="cursor-pointer">
                    {imagePreview ? (
                      <Image
                        src={imagePreview as string}
                        alt="Preview"
                        className="w-full h-auto"
                      />
                    ) : (
                      <p>Drag & Drop your image here or click to select</p>
                    )}
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        field.onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            />
            {errors.image && (
              <p className="text-red-600">{errors.image.message}</p>
            )}
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
              onClick={() => append({ urlName: "", url: "" })}
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

export default AddNotify;
