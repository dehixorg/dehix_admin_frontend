import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Field, FormFieldProps, FormFieldType } from "./FormTypes";

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
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={!editable}
      rules={{ required }}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
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
  options,
  editable,
  fullWidth,
}: FormFieldProps) => {
  return (
    <div style={{ marginBottom: "10px", width: fullWidth ? "100%" : "auto" }}>
      <label htmlFor={name}>
        {label}
        {required && "*"}
      </label>
      <select
        id={name}
        name={name}
        disabled={!editable}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const TextareaField = ({
  name,
  label,
  required,
  editable,
  fullWidth,
}: FormFieldProps) => {
  return (
    <div style={{ marginBottom: "10px", width: fullWidth ? "100%" : "auto" }}>
      <label htmlFor={name}>
        {label}
        {required && "*"}
      </label>
      <textarea
        id={name}
        name={name}
        disabled={!editable}
        style={{
          width: "100%",
          padding: "8px",
          boxSizing: "border-box",
          minHeight: "100px",
        }}
      />
    </div>
  );
};

// Date Picker Field Component
const DateField = ({
  name,
  label,
  required,
  editable,
  fullWidth,
}: FormFieldProps) => {
  return (
    <div style={{ marginBottom: "10px", width: fullWidth ? "100%" : "auto" }}>
      <label htmlFor={name}>
        {label}
        {required && "*"}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        disabled={!editable}
        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
      />
    </div>
  );
};

// Image Upload Field Component
const ImageUploadField = ({ name, label, required, editable }: FormFieldProps) => {
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
    default:
      return InputField;
  }
};

export function CustomFormField(formFieldProps: FormFieldProps) {
  const FieldToRender = mapComponentsToFields(formFieldProps.type);
  return <FieldToRender {...formFieldProps} />;
}
