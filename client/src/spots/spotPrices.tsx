import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const SpotPrices = () => {
    const [spots, setSpots] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const serverURL = import.meta.env.VITE_BACKEND_URL;
    if (!serverURL) {
        throw new Error("Missing BACKEND_URL environment variable");
    }

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await fetch(`${serverURL}/spots`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log(response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                setSpots(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSpots();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Spot Prices</h1>
            <p className="mb-6">[Base Currency: USD]</p>
            <div>
                <Table>
                    <TableCaption>A list of currency rates.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-center">
                                Currency
                            </TableHead>
                            <TableHead className="text-center w-[100px]">Rate</TableHead>
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
