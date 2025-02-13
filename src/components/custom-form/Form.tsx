// components/Form.jsx
import React, { useState } from "react";
import { FormData } from "./FormTypes";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "./FormFields";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";

// Main Form Component
export const CustomForm = ({
  title,
  subtitle,
  editable,
  fields,
  numberOfColumns = 1,
  defaultValues,
  submitHandler,
  schema,
  className,
}: FormData) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <Card className={twMerge("px-8 py-4 border-2 w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <Form {...form} formState={{ ...form.formState, disabled: !editable }}>
        <form
          onSubmit={form.handleSubmit(submitHandler)}
          className={`grid gap-4 grid-cols-${numberOfColumns}`}
        >
          {fields.map((field, index) => (
            <CustomFormField
              key={index}
              {...field}
              control={form.control}
              setValue={form.setValue}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </Card>
  );
};
