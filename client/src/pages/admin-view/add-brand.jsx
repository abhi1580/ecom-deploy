import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AdminAddBrand = () => {
  const [formData, setFormData] = useState({ name: "" });
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Category name is required", variant: "destructive" });
      return;
    }
    dispatch(addCategory(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Category added successfully" });
        setFormData({ name: "" });
      } else {
        toast({ title: "Failed to add category", variant: "destructive" });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Add New Brand
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter brand name"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Category
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddBrand;
