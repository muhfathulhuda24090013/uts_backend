import type { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// 1. Menampilkan semua pembicara dari Supabase
export const getAllPembicara = async (req: Request, res: Response): Promise<void> => {
    try {
        const pembicara = await prisma.pembicara.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(pembicara);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data pembicara", error });
    }
};

// 2. Menyimpan data pembicara baru ke Supabase
export const createPembicara = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, job, email, photo, bio, status } = req.body;

        if (!name || !job || !email || !bio || !status) {
            return res.status(400).json({ message: "Semua field wajib diisi kecuali foto" });
        }

        // Cek apakah email sudah terdaftar di Supabase untuk menghindari error crash @unique
        const existingEmail = await prisma.pembicara.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email sudah digunakan oleh pembicara lain" });
        }

        const newPembicara = await prisma.pembicara.create({
            data: {
                name,
                job,
                email,
                photo: photo || null,
                bio,
                status
            }
        });

        res.status(201).json(newPembicara);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan saat membuat pembicara", error });
    }
};

// 3. Menampilkan data pembicara berdasarkan id
export const getPembicaraById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const p = await prisma.pembicara.findUnique({ where: { id } });

        if (!p) {
            return res.status(404).json({ message: "Pembicara tidak ditemukan" });
        }
        res.json(p);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data pembicara", error });
    }
};

// 4. Mengupdate data pembicara berdasarkan id
export const updatePembicaraById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { name, job, email, photo, bio, status } = req.body;

        const updatedPembicara = await prisma.pembicara.update({
            where: { id },
            data: {
                name,
                job,
                email,
                photo,
                bio,
                status
            }
        });

        // ✅ SEBELUMNYA: res.json(updatedEvent); (INI YANG TYPO)
        res.json(updatedPembicara); // FIXX: Sudah diganti ke updatedPembicara
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate pembicara", error });
    }
};

// 5. Menghapus data pembicara berdasarkan id
export const deletePembicaraById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        
        await prisma.pembicara.delete({ where: { id } });
        res.json({ message: `Pembicara dengan ID ${id} berhasil dihapus` });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data pembicara, pastikan tidak terikat dengan event manapun.", error });
    }
};