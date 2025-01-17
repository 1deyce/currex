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
                const ratesString = event.data;

                const ratesArray = ratesString.split(" ").filter(Boolean);
                console.log("Rates array:", ratesArray);

                const data = {} as CurrencyRate;

                for (let i = 0; i < ratesArray.length; i += 2) {
                    const currency = ratesArray[i].replace(":", "").trim();
                    const rate = parseFloat(ratesArray[i + 1]);
                    if (currency && !isNaN(rate)) {
                        data[currency] = rate;
                    }
                }

                console.log("Parsed rates:", data);
                setSpots(data);
                setLoading(false);
                setError(null);
            } catch (error) {
                console.error("Failed to parse data:", error);
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

    if (Object.keys(spots).length > 0) {
        return (
            <div>
                <h2 className="text-3xl font-bold">Current Rates</h2>
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
                            {Object.entries(spots).map(([currency, rate]) => (
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
    } else {
        return <p>No data received yet.</p>;
    }
};

export default SpotPrices;
