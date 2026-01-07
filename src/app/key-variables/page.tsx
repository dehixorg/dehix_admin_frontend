"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Key, Plus, Save, Edit, Search } from "lucide-react";
import Breadcrumb from "@/components/shared/breadcrumbList";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import DropdownProfile from "@/components/shared/DropdownProfile";
import {
  menuItemsTop,
  menuItemsBottom,
} from "@/config/menuItems/admin/dashboardMenuItems";

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
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all key-value pairs on component mount
  useEffect(() => {
    const fetchKeyValues = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const response = await fetch("/api/key-value", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch key-value pairs"
          );
        }

        const data = await response.json();
        setKeyValues(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load key-value pairs"
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchKeyValues();
  }, []);

  // CREATE
  const handleAddKeyValue = async () => {
    if (!newValue.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch("/api/key-value", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: newValue.trim(),
          price: newPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create value");
      }

      // ✅ backend returns created item
      setKeyValues((prev) => [...prev, result.data]);

      setNewValue("");
      setNewPrice(undefined);
    } catch (err) {
      setError("Failed to add key value");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // START EDIT
  const startEditing = (item: KeyValuePair) => {
    setEditingId(item._id);
    setCurrentEdit(item);
  };

  // UPDATE
  const saveEdit = async () => {
    if (!editingId || currentEdit.value === undefined) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`/api/key-value/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: currentEdit.value,
          price: currentEdit.price,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update");
      }

      setKeyValues((prev) =>
        prev.map((item) => (item._id === editingId ? result.data : item))
      );

      setEditingId(null);
      setCurrentEdit({});
    } catch (err) {
      setError("Failed to update value");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Key Variables"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Key Variables"
          />
          <Breadcrumb items={breadcrumbItems} />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownProfile />
        </header>

        <main className="p-4 sm:px-6">
          <div className="flex justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Key-Value Pairs</h1>
              <p className="text-muted-foreground">Create & update values</p>
            </div>
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Card>
            <CardHeader className="flex items-center gap-2 border-b bg-muted/50 px-6 py-3">
              <Key className="h-5 w-5" />
              <span className="font-semibold">Key-Value Store</span>
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
                <Button onClick={handleAddKeyValue} disabled={loading}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>

              {isFetching ? (
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
                    {keyValues.map((item) => (
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

            <CardFooter className="text-sm text-muted-foreground">
              Showing {keyValues.length} item(s)
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
