import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LatestOrder = () => {
  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Id</TableHead>
            <TableHead>Payment Id</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <TableRow
              key={i}
              className="hover:bg-gray-100 transition-all duration-300"
            >
              <TableCell className="py-3">{`INV00${i + 1}`}</TableCell>
              <TableCell className="py-3">{`PAY${i + 1}`}</TableCell>
              <TableCell className="py-3">{3 * 17}</TableCell>
              <TableCell className="py-3">
                <span className="bg-amber-500 px-3 py-1 rounded-full text-white text-sm">
                  Delivered
                </span>
              </TableCell>
              <TableCell className="py-3 font-semibold">
                {5 * 89} PKR
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LatestOrder;
