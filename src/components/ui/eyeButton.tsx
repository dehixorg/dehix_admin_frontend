import { Eye } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

export function ButtonIcon({ onClick, variant = "outline", ...props }: ButtonProps) {
  return (
    <Button variant={variant} size="icon" className="h-4 py-3" onClick={onClick} {...props}>
      <Eye className="h-4 w-4" />
    </Button>
  );
}




