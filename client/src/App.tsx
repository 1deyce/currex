import "./App.css";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const serverURL = import.meta.env.VITE_BACKEND_URL;
if (!serverURL) {
    throw new Error("Missing BACKEND_URL environment variable");
}

function App() {
    const [fromValue, setFromValue] = useState("");
    const [toValue, setToValue] = useState("");
    const [amount, setAmount] = useState("");
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleConversion = async () => {
        setLoading(true);
        console.log(fromValue, toValue, amount);
        try {
            const response = await fetch(`${serverURL}/convert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: fromValue,
                    to: toValue,
                    amount: amount.toString(),
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data) {
                setConvertedAmount(data.amount.toFixed(2));
            }
            console.log("Converted Amount:", data.amount);
        } catch (error) {
            console.error("Error converting currency:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center mx-auto">
                <h1 className="mb-6 font-bold">
                    Curre<span className="text-blue-500 italic">X</span>
                </h1>
                <p className="text-lg mb-6">
                    At Currex, we understand that managing currency exchanges
                    can be a daunting task, whether you're traveling, investing,
                    or simply trying to make informed purchasing decisions.
                    That’s why we’ve created a user-friendly platform designed
                    to simplify your currency conversion needs.
                </p>
                <h2 className="font-semibold text-2xl mb-6">How it works</h2>
                <p className="text-md mb-6">
                    How It Works . Get Instant Results: Click the "Convert"
                    button and watch the magic happen—your converted amount will
                    be displayed instantly!
                </p>
                <ul className="mb-20 text-sm">
                    <li>
                        1. Choose the currency you want to convert from and the
                        currency you want to convert to.{" "}
                    </li>
                    <li>2. Input the amount you wish to convert. </li>
                    <li>
                        3. Click the "Convert" button and watch the magic
                        happen—your converted amount will be displayed
                        instantly!
                    </li>
                </ul>
                <div className="my-10 text-2xl">
                    {loading
                        ? "Loading..."
                        : convertedAmount !== 0
                        ? `${convertedAmount} ${toValue}`
                        : "Please select your inputs..."}
                </div>
                <div className="flex items-center flex-row gap-6">
                    <Select onValueChange={setFromValue}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>From Currency Code</SelectLabel>
                                <SelectItem value="USD">
                                    United States Dollar [USD]
                                </SelectItem>
                                <SelectItem value="GBP">
                                    Great Britain Pound [GBP]
                                </SelectItem>
                                <SelectItem value="EUR">Euro [EUR]</SelectItem>
                                <SelectItem value="JPY">
                                    Japanese Yen [JPY]
                                </SelectItem>
                                <SelectItem value="ZAR">
                                    South African Rand [ZAR]
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setToValue}>
                        <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>To Currency Code</SelectLabel>
                                <SelectItem value="USD">
                                    United States Dollar [USD]
                                </SelectItem>
                                <SelectItem value="GBP">
                                    Great Britain Pound [GBP]
                                </SelectItem>
                                <SelectItem value="EUR">Euro [EUR]</SelectItem>
                                <SelectItem value="JPY">
                                    Japanese Yen [JPY]
                                </SelectItem>
                                <SelectItem value="ZAR">
                                    South African Rand [ZAR]
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        className="font-bold"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.match(/^\d*\.?\d{0,2}$/)) {
                                setAmount(value);
                            }
                        }}
                    />
                </div>
                <div className="mt-10">
                    <Button
                        onClick={handleConversion}
                        type="submit"
                        className="w-[600px]"
                        disabled={
                            fromValue === "" || toValue === "" || amount === ""
                        }
                    >
                        {loading ? "Converting..." : "Convert"}
                    </Button>
                </div>
            </div>
        </>
    );
}

export default App;
