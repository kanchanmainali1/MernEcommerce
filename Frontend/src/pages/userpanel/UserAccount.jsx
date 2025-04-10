import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/userpanel/Address";
import UserOrders from "@/components/userpanel/Order";

function UserAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          alt="Account Banner"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto py-8">
        <Tabs defaultValue="orders">
          <TabsList className="flex justify-center space-x-4 mb-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <UserOrders />
          </TabsContent>
          <TabsContent value="address">
            <Address />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserAccount;
