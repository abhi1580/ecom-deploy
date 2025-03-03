import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  addNewCategory,
  deleteCategory,
  getAllCategoriesForAdmin,
  // deleteCategory, // Import delete action
} from "@/store/admin/category-slice";
import { Trash2, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminAddCategory = () => {
  const [formData, setFormData] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { categories } = useSelector((state) => state.adminCategories);

  useEffect(() => {
    dispatch(getAllCategoriesForAdmin());
  }, [dispatch]);

  const handleSubmit = () => {
    const trimmedInput = formData.trim();

    if (!trimmedInput) {
      toast({
        title: "Category name cannot be empty!",
        variant: "destructive",
      });
      return;
    }

    if (
      Array.isArray(categories) &&
      categories.some(
        (category) =>
          category?.label?.toLowerCase() === trimmedInput.toLowerCase()
      )
    ) {
      toast({
        title: "Category already exists!",
        variant: "destructive",
      });
      return;
    }

    const label = trimmedInput.charAt(0).toUpperCase() + trimmedInput.slice(1);
    const id = trimmedInput.toLowerCase().replace(/\s+/g, "-");

    if (trimmedInput.includes(" ")) {
      toast({
        title: "Category name should be a single word!",
        variant: "destructive",
      });
      return;
    }

    dispatch(addNewCategory({ id, label })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Category added successfully" });
        setFormData("");
        dispatch(getAllCategoriesForAdmin());
      } else {
        toast({ title: "Failed to add category", variant: "destructive" });
      }
    });
  };

  const handleDelete = (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    console.log(categoryId);
    dispatch(deleteCategory(categoryId)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Category deleted successfully" });
        dispatch(getAllCategoriesForAdmin());
      } else {
        toast({ title: "Failed to delete category", variant: "destructive" });
      }
    });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Add New Category
        </h2>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Category Name
          </Label>
          <Input
            type="text"
            name="name"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter category name"
          />
        </div>
        <Button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={handleSubmit}
        >
          Add Category
        </Button>

        {/* Display Categories Below */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Categories
          </h3>
          {categories?.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="group flex items-center justify-between rounded-md bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 transition duration-200"
                >
                  <span>{category.label}</span>
                  <Trash2
                    className="w-5 h-5 text-red-600 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200"
                    onClick={() => handleDelete(category._id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAddCategory;
