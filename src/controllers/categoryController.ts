import type { Request, Response } from "express"; 
// UBAH BARIS INI: sesuaikan dengan nama file db.ts kamu yang ada di dalam folder lib
import { prisma } from "../lib/db.js";

// 1. Menampilkan semua kategori dari Supabase
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data kategori", error });
    }
};

// 2. Menyimpan data kategori baru ke Supabase
export const createCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name harus diisi" });
        }

        const newCategory = await prisma.category.create({
            data: { name }
        });

        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat membuat kategori", error });
    }
};

// 3. Menampilkan data kategori berdasarkan id
export const getCategoryById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const category = await prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil kategori", error });
    }
};

// 4. Mengupdate data kategori berdasarkan id
export const updateCategoryById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name }
        });

        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengupdate kategori", error });
    }
};

// 5. Menghapus data kategori berdasarkan id
export const deleteCategoryById = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = Number(req.params.id);
        
        await prisma.category.delete({
            where: { id }
        });

        res.json({ message: `Kategori dengan ID ${id} berhasil dihapus` });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus kategori", error });
    }
};