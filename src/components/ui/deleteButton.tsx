import { X } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

export function DeleteButtonIcon({ onClick, variant = "destructive", ...props }: ButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className="h-4 py-3"
      onClick={onClick}
      {...props}
    >
      <X className="w-4 h-4" />
    </Button>
  );
}
