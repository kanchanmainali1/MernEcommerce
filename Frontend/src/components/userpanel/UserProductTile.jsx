import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function UserProductTile({ product, handleGetProductDetails = () => {} }) {
  return (
    <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
              Out of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-semibold rounded">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">
              {categoryOptionsMap[product?.category]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-lg font-bold ${product?.salePrice > 0 ? 'line-through text-gray-500' : 'text-primary'}`}>
              Rs.{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold text-red-600">Rs.{product?.salePrice}</span>
            )}
          </div>
        </CardContent>
      </div>
      <div className="p-4">
        <Button
          onClick={() => handleGetProductDetails(product?._id)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}

export default UserProductTile;
