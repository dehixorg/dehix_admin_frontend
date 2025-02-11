// components/Form.jsx
import React, { useState } from "react";
import { FormData } from "./FormTypes";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./FormFields";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

// Main Form Component
const CustomForm = ({
  title,
  subtitle,
  editable,
  fields,
  numberOfColumns,
  defaultValues,
}: FormData) => {
  const form = useForm({
    defaultValues,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <Form {...form} formState={{ ...form.formState, disabled: !editable }}>
        {fields.map((field, index) => (
          <CustomFormField key={index} {...field} control={form.control} />
        ))}
      </Form>
    </Card>
  );
};

export default CustomForm;
