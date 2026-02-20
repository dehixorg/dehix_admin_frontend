"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/business";
import { Messages } from "@/utils/common/enum";

interface ChangeVerificationStatusProps {
    businessId: string;
    currentStatus: string; // "Yes" or "No"
    onUpdateSuccess?: () => void;
}

export default function ChangeVerificationStatus({
    businessId,
    currentStatus,
    onUpdateSuccess,
}: ChangeVerificationStatusProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus);
        setIsLoading(true);
        try {
            const apiStatus = newStatus === "Yes" ? "VERIFIED" : "NOT_VERIFIED";
            await apiHelperService.updateUserStatus(businessId, apiStatus);
            toast({
                title: "Success",
                description: Messages.UPDATE_SUCCESS("verification status"),
                variant: "default",
            });
            onUpdateSuccess?.();
        } catch (error) {
            toast({
                title: "Error",
                description: Messages.UPDATE_ERROR("verification status"),
                variant: "destructive",
            });
            setStatus(currentStatus);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <p className="text-sm font-medium">Verified Status:</p>
            <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={isLoading}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Yes">Verified</SelectItem>
                    <SelectItem value="No">Not Verified</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
