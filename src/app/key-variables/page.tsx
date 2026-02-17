"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axiosinstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Key, Plus, Save, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/custom-table/Pagination";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

type KeyValuePair = {
  _id: string;
  value: any;
  price?: number;
  createdAt: string;
  updatedAt: string;
};

const breadcrumbItems = [
  { link: "/dashboard", label: "Home" },
  { link: "/key-variables", label: "Key Variables" },
];

export default function KeyVariablesPage() {
  const [keyValues, setKeyValues] = useState<KeyValuePair[]>([]);
  const [newValue, setNewValue] = useState("");
  const [newPrice, setNewPrice] = useState<number | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentEdit, setCurrentEdit] = useState<Partial<KeyValuePair>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate pagination
  const totalPages = Math.ceil(keyValues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = keyValues.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchKeyValues = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/key-value");
        if (response.data?.data) {
          setKeyValues(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching key values:", err);
        setError("Failed to fetch key values");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeyValues();
  }, []);

  const handleAddKeyValue = async () => {
    if (!newValue.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const key = `key_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

      const response = await axiosInstance.post("/api/key-value", {
        key,
        value: newValue.trim(),
        price: newPrice !== undefined ? Number(newPrice) : undefined,
      });

      if (response.data?.data) {
        const newItem = response.data.data;
        setKeyValues((prev) => [
          {
            _id: newItem._id,
            value: newItem.value,
            price: newItem.price,
            createdAt: newItem.createdAt,
            updatedAt: newItem.updatedAt,
          },
          ...prev,
        ]);
        setNewValue("");
        setNewPrice(undefined);
        setSuccess("Key-value pair added successfully!");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error adding key-value pair:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add key value. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (item: KeyValuePair) => {
    setEditingId(item._id);
    setCurrentEdit({
      value: item.value,
      price: item.price,
    });
  };

  const saveEdit = async () => {
    if (!editingId || currentEdit.value === undefined) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Optimistic update
      setKeyValues((prevKeyValues) =>
        prevKeyValues.map((item) =>
          item._id === editingId
            ? {
                ...item,
                value: currentEdit.value,
                price: currentEdit.price,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      // API call after optimistic update
      await axiosInstance.put(`/api/key-value/${editingId}`, {
        value: currentEdit.value,
        price: currentEdit.price,
      });

      setEditingId(null);
      setCurrentEdit({});
      setSuccess("Key-value pair updated successfully!");
    } catch (err: any) {
      console.error("Error updating key-value pair:", err);
      setError(err.response?.data?.message || "Failed to update value");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
      if (success) setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <AdminDashboardLayout
      active="Key Variables"
      breadcrumbItems={breadcrumbItems}
      mainClassName="p-4 sm:px-6"
    >
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Key-Value Pairs</h1>
              <p className="text-muted-foreground">Create & update values</p>
            </div>
          </div>

          {/* Success and Error Messages */}
          {error && (
            <div className="fixed bottom-4 right-4 text-white px-4 py-2 rounded-md z-50">
              {error}
            </div>
          )}
          {success && (
            <div className="fixed bottom-4 right-4 text-foreground/80 px-4 py-2 z-50">
              {success}
            </div>
          )}
          <Card>
            <CardHeader className="p-0">
              <div className="flex items-center justify-between border-b bg-muted/50 px-6 py-3">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <span className="font-semibold">Key-Value Store</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Items Per Page
                    </span>
                    <Select
                      value={`${itemsPerPage}`}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 w-20">
                        <SelectValue placeholder={itemsPerPage} />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 25, 50, 100].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newPrice ?? ""}
                  onChange={(e) =>
                    setNewPrice(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
                <Button onClick={handleAddKeyValue} disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : keyValues.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No key-value pairs found. Add one to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Value</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          {editingId === item._id ? (
                            <Input
                              value={currentEdit.value || ""}
                              onChange={(e) =>
                                setCurrentEdit({
                                  ...currentEdit,
                                  value: e.target.value,
                                })
                              }
                            />
                          ) : (
                            String(item.value)
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item._id ? (
                            <Input
                              type="number"
                              step="0.0001"
                              value={currentEdit.price ?? ""}
                              onChange={(e) =>
                                setCurrentEdit({
                                  ...currentEdit,
                                  price: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                })
                              }
                            />
                          ) : item.price ? (
                            `$${item.price.toFixed(4)}`
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(item.updatedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {editingId === item._id ? (
                            <Button size="sm" onClick={saveEdit}>
                              <Save className="h-4 w-4 mr-1" /> Save
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center p-4 border-t">
              <TablePagination
                page={currentPage}
                setPage={setCurrentPage}
                isNextAvailable={currentPage < totalPages}
              />
            </CardFooter>
          </Card>
    </AdminDashboardLayout>
  );
}
