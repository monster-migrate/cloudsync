import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { latitude, longitude, data } = req.body;
    if (!latitude || !longitude) return res.status(400).json({ error: "Missing data" });
    try {
        const client = await clientPromise;
        const db = client.db();

        const existingDoc = await db.collection("weather").findOne({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        });

        if (existingDoc) {
            return res.status(200).json({
                success: true,
                message: "Data already exists - no update performed"
            });
        }

        const result = await db.collection("weather").insertOne({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            data: data,
            createdAt: new Date()
        });

        return res.status(201).json({
            success: true,
            insertedId: result.insertedId
        });

    } catch (err) {
        console.error("Database operation failed:", err);
        return res.status(500).json({
            error: "Internal Server Error",
            details: err instanceof Error ? err.message : "Unknown error"
        });
    }
}
