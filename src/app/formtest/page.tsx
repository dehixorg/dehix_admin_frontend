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
    },
  ],
};

const TestPage: React.FC = () => {
  return (
    <div>
      <h1>Freelancer Profile Form</h1>
      <Form {...tempFormData} />
    </div>
  );
};

export default TestPage;
