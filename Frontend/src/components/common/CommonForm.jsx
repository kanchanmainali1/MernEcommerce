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
            className="block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
            <SelectTrigger className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
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
            className="block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
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
            className="block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
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
        className="w-full py-3 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
