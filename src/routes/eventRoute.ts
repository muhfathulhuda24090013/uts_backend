import express from "express";
import {
    getAllEvents,
    createEvent,
    getEventById,
    updateEventById,
    deleteEventById
} from "../controllers/EventController.js"; // Pastikan path ke controller sudah benar

const router = express.Router();

// Menghubungkan HTTP Method dengan fungsi controller Prisma + Supabase
router.get("/", getAllEvents); 
router.post("/", createEvent);
router.get("/:id", getEventById);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);

export default router;