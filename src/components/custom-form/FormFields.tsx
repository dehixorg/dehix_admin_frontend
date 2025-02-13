import { twMerge } from "tailwind-merge";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { FormFieldProps, FormFieldType } from "./FormTypes";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";

const InputField = ({
  name,
  label,
  required,
  editable,
  fullWidth,
  control,
  description,
  placeholder,
  className,
  defaultValue,
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={!editable}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={`${fullWidth && 'col-span-full'} `+className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const DropdownField = ({
  name,
  label,
  required,
  editable,
  fullWidth,
  control,
  description,
  placeholder,
  options,
  className
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={twMerge(`${fullWidth && 'col-span-full'} `, className)}>
          <FormLabel required={required}>{label}</FormLabel>
          <Select
            required={required}
            disabled={!editable}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const TextareaField = ({
  name,
  label,
  required,
  editable,
  fullWidth,
  placeholder,
  control,
  description,
  className,
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${fullWidth && 'col-span-full'} `}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Textarea
              disabled={!editable}
              required={required}
              placeholder={placeholder}
              className={twMerge("resize-none", className)}
              {...field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Date Picker Field Component
const DateField = ({
  name,
  label,
  required,
  editable,
  fullWidth,
  control,
  className,
  placeholder,
  description,
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={twMerge(`${fullWidth && 'col-span-full'} `, "flex flex-col", className)}>
          <FormLabel required={required}>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "min-w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                required={required}
                onSelect={field.onChange}
                disabled={!editable}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Image Upload Field Component
// TODO
const ImageUploadField = ({
  name,
  label,
  required,
  editable,
}: FormFieldProps) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <label htmlFor={name}>
        {label}
        {required && "*"}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        disabled={!editable}
        accept="image/*"
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        onChange={handleImageChange}
      />
    </div>
  );
};

const ComboBox = ({
  name,
  label,
  className,
  control,
  placeholder,
  editable,
  required,
  options,
  description,
  fullWidth,
  setValue,
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={twMerge(`${fullWidth && 'col-span-full'} `, "flex flex-col", className)}>
          <FormLabel required={required}>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!editable}
                  className={cn(
                    "min-w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options?.find((opt) => opt.value === field.value)?.label
                    : placeholder}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="min-w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                  disabled={!editable}
                  required={required}
                />
                <CommandList>
                  <CommandEmpty>{placeholder}</CommandEmpty>
                  <CommandGroup>
                    {options?.map((opt) => (
                      <CommandItem
                        value={opt.value}
                        key={opt.value}
                        onSelect={() => {
                          setValue(name, opt.value);
                        }}
                      >
                        {opt.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            opt.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormInputOTP = ({
  name,
  label,
  className,
  control,
  placeholder,
  editable,
  required,
  description,
  otpLength,
  fullWidth
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={`${fullWidth && 'col-span-full'} `} required={required}>{label}</FormLabel>
          <FormControl>
            <InputOTP
              maxLength={otpLength!}
              {...field}
              placeholder={placeholder}
              disabled={!editable}
              required={required}
            >
              <InputOTPGroup className={className}>
                {Array.from({ length: otpLength! }).map((_, index) => (
                  <InputOTPSlot index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormRadio = ({
  name,
  label,
  className,
  control,
  editable,
  required,
  description,
  options,
  fullWidth
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${fullWidth && 'col-span-full'} space-y-3`}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={twMerge("flex flex-col space-y-1", className)}
              required={required}
              disabled={!editable}
            >
              {options?.map((opt) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl key={opt.value}>
                    <RadioGroupItem value={opt.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{opt.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormSelect = ({
  name,
  label,
  className,
  control,
  editable,
  required,
  description,
  options,
  fullWidth
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`${fullWidth && 'col-span-full'} `}>
          <FormLabel required={required}>{label}</FormLabel>
          <Select
            disabled={!editable}
            required={required}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={className}>
              {options?.map((opt) => (
                <SelectItem value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormCheckboxField = ({
  name,
  label,
  className,
  control,
  editable,
  required,
  description,
  fullWidth
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={twMerge(`${fullWidth && 'col-span-full'} `, "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow")}>
          <FormControl>
            <Checkbox
              className={className}
              disabled={!editable}
              required={required}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel required={required}>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

const mapComponentsToFields = (type: FormFieldType) => {
  switch (type) {
    case FormFieldType.INPUT:
      return InputField;
    case FormFieldType.TEXTAREA:
      return TextareaField;
    case FormFieldType.DATE:
      return DateField;
    case FormFieldType.DROPDOWN:
      return DropdownField;
    case FormFieldType.IMAGE:
      return ImageUploadField;
    case FormFieldType.COMBOBOX:
      return ComboBox;
    case FormFieldType.INPUT_OTP:
      return FormInputOTP;
    case FormFieldType.RADIO:
      return FormRadio;
    case FormFieldType.SELECT:
      return FormSelect;
    case FormFieldType.CHECKBOX:
      return FormCheckboxField;

    default:
      return InputField;
  }
};

export function CustomFormField(formFieldProps: FormFieldProps) {
  const FieldToRender = mapComponentsToFields(formFieldProps.type);

  // Assigning default values
  if (formFieldProps.editable == undefined)
    formFieldProps = { ...formFieldProps, editable: true };
  if (formFieldProps.required == undefined)
    formFieldProps = { ...formFieldProps, required: false };
  if (formFieldProps.otpLength == undefined)
    formFieldProps = { ...formFieldProps, otpLength: 6 };
  if (formFieldProps.defaultValue == undefined)
    formFieldProps = { ...formFieldProps, defaultValue: "" };

  return <FieldToRender {...formFieldProps} />;
}
