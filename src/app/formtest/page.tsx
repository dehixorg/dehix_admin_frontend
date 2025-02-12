"use client"

import React from "react";
import Form from "@/components/custom-form/Form";
import { FormData, FormFieldType } from "@/components/custom-form/FormTypes";

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
      required: true,
      editable: true,
      fullWidth: true,
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
      editable: true,
      fullWidth: true,
      placeholder: ""
    },
    {
      type: FormFieldType.DATE,
      name: "dob",
      label: "Date Of Birth",
      required: true,
      editable: true,
      fullWidth: true,
      placeholder: "Select your birth date"
    },
    {
      type: FormFieldType.COMBOBOX,
      name: "language",
      label: "Languages",
      required: true,
      editable: true,
      fullWidth: true,
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
  ],
};

const TestPage: React.FC = () => {
  return (
    <div>
      {/* <h1>Freelancer Profile Form</h1> */}
      <Form {...tempFormData} />
    </div>
  );
};

export default TestPage;
