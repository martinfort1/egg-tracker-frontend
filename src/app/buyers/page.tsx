"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"

export default function BuyersPage(){
    const [buyers, setBuyers] = useState([]);

    useEffect(() => {
      api.get("/buyers")
        .then(res => setBuyers(res.data));
        
    }, [])
    
    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <h1 className="text-4xl font-bold mb-6">
                    Buyers
                </h1>
                <Link href={"/buyers/new"}>
                    <Button className="bg-green-500 text-black font- hover:bg-green-600 rounded-full">
                        <Plus />
                        Add Buyer
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded shadow">
                <Table className="border border-solid border-black">
                    <TableHeader className="bg-gray-300">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {buyers.map((buyer:any)=>(
                            <TableRow key={buyer.id}>
                                <TableCell className="font-medium">
                                    {buyer.name}
                                </TableCell>

                                <TableCell className="font-medium">
                                    {buyer.phone}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {buyer.address}
                                </TableCell>

                                <TableCell className="text-right">
                                    <Link href={`/buyers/${buyer.id}`}>
                                        <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700" variant={"outline"} size={"sm"}>
                                            More info
                                        </Button>
                                    </Link>
                                </TableCell>
                                
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>

            </div>
        </div>
    )


}