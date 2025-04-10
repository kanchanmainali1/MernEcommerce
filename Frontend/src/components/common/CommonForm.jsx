import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
// Removed the ChevronDown import since it’s no longer used
// import { ChevronDown } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(controlItem) {
    const value = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case "input":
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [controlItem.name]: event.target.value })
            }
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all shadow-sm"
          />
        );

      case "select":
        return (
          <Select
            onValueChange={(val) =>
              setFormData({ ...formData, [controlItem.name]: val })
            }
            value={value}
          >
            <SelectTrigger
              className={`relative w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all shadow-sm ${
                controlItem.className || ""
              }`}
            >
              {/* Extra right padding keeps the text clear even if an arrow is rendered */}
              <SelectValue placeholder={controlItem.label} className="pr-8" />
            </SelectTrigger>
            <SelectContent className="rounded-md border border-gray-300 bg-white shadow-lg z-50">
              {controlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [controlItem.name]: event.target.value })
            }
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all shadow-sm"
          />
        );

      default:
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [controlItem.name]: event.target.value })
            }
            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all shadow-sm"
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-8 bg-white shadow-md rounded-lg">
      <div className="space-y-4">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-2" key={controlItem.name}>
            <Label className="text-sm font-medium text-gray-700">
              {controlItem.label}
            </Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button
        disabled={isBtnDisabled}
        type="submit"
        className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
