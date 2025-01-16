import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type CurrencyRate = {
    [key: string]: number;
};

const SpotPrices = () => {
    const [spots, setSpots] = useState<CurrencyRate>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const serverURL = import.meta.env.VITE_BACKEND_URL;
    if (!serverURL) {
        throw new Error("Missing BACKEND_URL environment variable");
    }

    useEffect(() => {
        const sse = new EventSource(`${serverURL}/sse`);

        sse.onmessage = (event) => {
            console.log("Received message:", event.data);
            try {
                const data = event.data
                    .split(";")
                    .reduce((acc: CurrencyRate, curr: string) => {
                        const [currency, rate] = curr.split(": ");
                        if (currency && rate) {
                            acc[currency] = parseFloat(rate);
                        }
                        return acc;
                    }, {});
                setSpots(data);
                setLoading(false);
                setError(null);
            } catch (error) {
                setError("Failed to parse data");
                setLoading(false);
            }
        };

        sse.onerror = () => {
            setError("SSE connection error");
            setLoading(false);
            sse.close();
        };

        return () => {
            sse.close();
        };
    }, [serverURL]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2 className="text-3xl font-bold">Spot Prices</h2>
            <p className="mb-6">[Base Currency: USD]</p>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-center">
                                Currency
                            </TableHead>
                            <TableHead className="text-center w-[100px]">
                                Rate
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(spots.rates).map(([currency, rate]) => (
                            <TableRow key={currency}>
                                <TableCell>{currency}</TableCell>
                                <TableCell>{rate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SpotPrices;
