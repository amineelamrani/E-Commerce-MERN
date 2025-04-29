import UserContext from "@/context/UserContext";
import { useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ViewingProducts() {
  const { fetchedProducts, setDeleteProducts } = useContext(UserContext);

  const handleDeleteProduct = async (e) => {
    const productID = e.target.id.split(" ")[1];
    // when deleted successfully => setDeleteProducts(st=>!st);
    const res = await fetch(`/api/v1/products/${productID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data && data.status === "success") {
      setDeleteProducts((st) => !st);
    }
  };

  const handleUpdateProduct = (e) => {
    console.log(e.target.parentElement.parentElement.id);
  };

  return (
    <div className="p-5">
      <h1 className="text-sm">All product List</h1>
      {fetchedProducts !== null && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchedProducts.map((product, index) => (
              <TableRow key={index} id={product._id}>
                <TableCell>
                  <img src={product.images[0]} className="w-12" alt="" />
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category[0]}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell className="text-right flex justify-end py-5">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Trash className="hover:cursor-pointer hover:scale-125" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the product and remove the data from the
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          id={`alert ${product._id}`}
                          onClick={handleDeleteProduct}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Pencil
                    className="hover:cursor-pointer hover:scale-125"
                    onClick={handleUpdateProduct}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Table : Image[0] - Title(onclick open a new tab for the product) - category - price - delete action - edit (icon to edit and it enables editing the title and the price) */}
    </div>
  );
}
