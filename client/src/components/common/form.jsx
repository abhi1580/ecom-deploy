import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils"; // Utility for conditional classNames (if needed)

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  errors = {},
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    let value = formData[getControlItem.name] || "";
    const error = errors[getControlItem.name]; // Get error for this field

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: e.target.value,
                })
              }
              className={cn(error ? "border-red-500" : "")}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </>
        );
        break;
      case "select":
        element = (
          <>
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={value}
            >
              <SelectTrigger
                className={cn("w-full", error ? "border-red-500" : "")}
              >
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </>
        );
        break;
      case "textarea":
        element = (
          <>
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.id}
              value={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: e.target.value,
                })
              }
              className={cn(error ? "border-red-500" : "")}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </>
        );
        break;
      default:
        element = (
          <>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: e.target.value,
                })
              }
              className={cn(error ? "border-red-500" : "")}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </>
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
