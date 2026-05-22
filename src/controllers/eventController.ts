import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. Ambil semua event + data relasi kategori & pembicara
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await prisma.event.findMany({
            include: {
                category: true,
                pembicara: true
            },
            orderBy: { id: 'asc' }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data event", error });
    }
};

// 2. Simpan event baru ke Supabase
export const createEvent = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, categoryId, pembicaraId, location, dateEvent, description, status } = req.body;

        if (!name || !categoryId || !pembicaraId || !location || !dateEvent) {
            return res.status(400).json({ message: "Data utama wajib diisi!" });
        }

        const newEvent = await prisma.event.create({
            data: {
                name,
                categoryId: Number(categoryId),   
                pembicaraId: Number(pembicaraId), 
                location,
                dateEvent: new Date(dateEvent),
                description: description || "",
                status: status || "active"
            }
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal menyimpan event ke Supabase", error });
    }
};

// 3. Ambil detail event berdasarkan ID
export const getEventById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const event = await prisma.event.findUnique({
            where: { id },
            include: { category: true, pembicara: true }
        });

        if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data event", error });
    }
};

// 4. Update data event
export const updateEventById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { name, categoryId, pembicaraId, location, dateEvent, description, status } = req.body;

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                name,
                categoryId: categoryId ? Number(categoryId) : undefined,
                pembicaraId: pembicaraId ? Number(pembicaraId) : undefined,
                location,
                dateEvent: dateEvent ? new Date(dateEvent) : undefined,
                description,
                status
            }
        });

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate event", error });
    }
};

// 5. Hapus data event
export const deleteEventById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        await prisma.event.delete({
            where: { id }
        });
        res.json({ message: "Event berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus event", error });
    }
};