"use client"

import React from "react";
import Form from "@/components/custom-form/Form";
import { FormData, FormFieldType } from "@/components/custom-form/FormTypes";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(3, {message: "invalid"}),
  lang: z.string(),
  bio: z.string(),
  dob: z.date(),
  language: z.string(),
  img: z.array(z.instanceof(File)).or(z.instanceof(File))
})

const tempFormData: FormData = {
  editable: true,
  title: "Freelancer Profile",
  subtitle: "Complete your profile to get hired",
  numberOfColumns: 2,
  fields: [
    {
      type: FormFieldType.INPUT,
      name: "fullName",
      label: "Full Name",
      required: false,
      placeholder: "John Smith"
    },
    {
      type: FormFieldType.DROPDOWN,
      name: "lang",
      label: "Programming Language",
      placeholder: "Select a programming language",
      required: true,
      options: [
        { label: "CPP", value: "cpp" },
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
      ]
    },
    {
      type: FormFieldType.TEXTAREA,
      name: "bio",
      label: "Bio",
      required: true,
      // fullWidth: true,
      placeholder: ""
    },
    {
      type: FormFieldType.DATE,
      name: "dob",
      label: "Date Of Birth",
      required: true,
      // fullWidth: true,
      placeholder: "Select your birth date"
    },
    {
      type: FormFieldType.COMBOBOX,
      name: "language",
      label: "Languages",
      required: true,
      placeholder: "Select your language",
      options: [
        { label: "English", value: "en" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Portuguese", value: "pt" },
        { label: "Russian", value: "ru" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Chinese", value: "zh" },
      ]
    },
    {
      type: FormFieldType.IMAGE,
      name: "img",
      label: "Image",
      multipleFiles: true
    },
    {
      type: FormFieldType.RADIO,
      name: "radiio",
      label: "Radio",
      options: [
        { label: "Cricket", value: "c" },
        { label: "Football", value: "f" },
        { label: "Basketball", value: "b" },
      ]
    }
  ],
  schema: schema,
  submitHandler: (data: z.infer<typeof schema>) => {
      console.log(data)
  },
};

const TestPage: React.FC = () => {
  return (
    <div className="w-full min-h-[100vh] h-auto flex items-center justify-center">
      {/* <h1>Freelancer Profile Form</h1> */}
      <Form {...tempFormData} className="w-[50%]" />
    </div>
  );
};

export default TestPage;
