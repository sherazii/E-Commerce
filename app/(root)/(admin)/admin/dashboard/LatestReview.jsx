import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaStar } from "react-icons/fa";

const LatestReview = () => {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <TableRow
              key={i}
              className="hover:bg-gray-100 transition-all duration-300"
            >
              <TableCell className="py-3">{`Product${i+1}`}</TableCell>
              <TableCell className="py-3 flex text-yellow-500">
                <FaStar/>
                <FaStar/>
                <FaStar/>
                <FaStar/>
                <FaStar/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestReview;
