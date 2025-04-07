import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  const updatedFilterOptions = { ...filterOptions };
  delete updatedFilterOptions.brand; // Remove brand filter

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800">Filters</h2>
      {Object.keys(updatedFilterOptions).map((keyItem) => (
        <Fragment key={keyItem}>
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-700">{keyItem}</h3>
            <div className="flex flex-col gap-2 mt-2">
              {updatedFilterOptions[keyItem].map((option) => (
                <Label key={option.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters[keyItem] &&
                      filters[keyItem].indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                    className="border-gray-300"
                  />
                  {option.label}
                </Label>
              ))}
            </div>
          </div>
          <Separator className="my-4" />
        </Fragment>
      ))}
    </div>
  );
}

export default ProductFilter;
