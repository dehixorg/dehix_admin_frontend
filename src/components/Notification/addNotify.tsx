import React, { useState, useRef } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Plus, Image as ImageIcon, UploadCloud } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import { Api_Methods, Messages, NotificationStatusEnum , imageSize } from "@/utils/common/enum";
import { apiHelperService } from "@/services/notification";
import { apiService } from "@/services/apiService";
interface ImportantUrl {
  urlName: string;
  url: string;
}

interface notifyData {
  heading: string;
  description: string;
  type: string;
  status: NotificationStatusEnum;
  importantUrl: ImportantUrl[];
  background_img: string;
}

const notifySchema = z.object({
  heading: z.string().min(1, "Please enter a heading"),
  description: z.string().min(1, "Please enter a description"),
  type: z.enum(["BOTH", "BUSINESS", "FREELANCER"]),
  status: z.enum(["ACTIVE"]).default("ACTIVE"),
  importantUrl: z
    .array(
      z.object({
        urlName: z.string().min(1, "Please enter the URL name"),
        url: z.string().min(1, "Please enter a valid URL"),
      })
    )
    .nonempty({ message: "Please add at least one URL" }),
});

const allowedImageFormats = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];
const maxImageSize = imageSize.maxImageSize; // 1MB

interface AddNotifyProps {
  onAddNotify: () => void; // Prop to pass the new domain
}
const AddNotify: React.FC<AddNotifyProps> = ({ onAddNotify }) => {
  const [open, setOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sizeInMb = maxImageSize / (1024 * 1024);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<notifyData>({
    resolver: zodResolver(notifySchema),
    defaultValues: {
      heading: "",
      description: "",
      type: "",
      status: NotificationStatusEnum.ACTIVE,
      importantUrl: [{ urlName: "", url: "" }],
      background_img: "",
    },
  });
  const { toast } = useToast();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "importantUrl",
  });
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && allowedImageFormats.includes(file.type)) {
      if (file.size <= maxImageSize) {
        setSelectedPicture(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        alert(`File size exceeds the ${sizeInMb} Mb limit.`);
      }
    } else {
      toast({
        title: "Error",
        description: Messages.FILE_TYPE_ERROR("image"),
        variant: "destructive", // Red error message
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && allowedImageFormats.includes(file.type)) {
      if (file.size <= maxImageSize) {
        setSelectedPicture(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        alert(`File size exceeds the ${sizeInMb} Mb limit.`);
      }
    } else {
      toast({
        title: "Error",
        description: Messages.FILE_TYPE_ERROR("image"),
        variant: "destructive", // Red error message
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const onSubmit = async (data: notifyData) => {
    try {
      const formData = new FormData();
      let response: any = null;

      if (selectedPicture) {
        formData.append("background_img", selectedPicture);
        const postResponse = await apiHelperService.uploadNotificationImage(formData)
        if (postResponse.data.data) {
          const { Location } = postResponse.data.data;
          response = await apiHelperService.createNotification({
            ...data,
            background_img: Location,
          });
        } else {
          toast({
            title: "Error",
            description: Messages.ADD_ERROR("notification"),
            variant: "destructive", // Red error message
          });
        }
      } else {
        response = await apiHelperService.createNotification({
          ...data,
          background_img: "",
        });
      }
      if (response?.data?.data) {
        toast({
          title: "Success",
          description: "Notification Added Successfully",
          variant: "default", // Red error message
        });
        reset();
        setOpen(false);
        onAddNotify();
      } else {
        toast({
          title: "Error",
          description: Messages.ADD_ERROR("notification"),
          variant: "destructive", // Red error message
        });
      }
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
                    <SelectItem value="BOTH">Both</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="FREELANCER">Freelancer</SelectItem>
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
            <input
              type="file"
              accept={allowedImageFormats.join(",")}
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />

            <div
              className="h-48  border p-2 rounded mt-2 w-full shadow-lg flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {previewUrl ? (
                <div className="w-40 h-40 border-2 border-black-300 bg-gray-700 flex items-center justify-center cursor-pointer">
                  <Image
                    width={112}
                    height={112}
                    src={previewUrl}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-dashed border-2 border-gray-400 rounded-lg p-6">
                  <UploadCloud className="text-gray-500 w-12 h-12 mb-2" />
                  <p className="text-gray-700 text-center">
                    Drag and drop your image here or click to upload
                  </p>
                  <div className="flex items-center mt-2">
                    <ImageIcon className="text-gray-500 w-5 h-5 mr-1" />
                    <span className="text-gray-600 text-sm">
                      Supported formats: JPG, PNG,JPEG
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    Maximum size -: {sizeInMb} Mb
                  </span>
                </div>
              )}
            </div>
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
