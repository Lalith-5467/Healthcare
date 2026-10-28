import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { prisma } from '../config/prisma';

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ext || (file.mimetype.startsWith('video/') ? '.mp4' : '.png');
    const randomHash = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${randomHash}${safeExt}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Allowed types: JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, OGG.`));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for images & video media
  },
}).single('file');

export const uploadFileHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  uploadMiddleware(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
          success: false,
          message: 'File size exceeds 5MB limit.',
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
      return;
    } else if (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'File upload validation failed.',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded. Please include a file in the "file" field.',
      });
      return;
    }

    try {
      const category = (req.body?.category || 'GENERAL').toUpperCase();
      const relativeUrl = `/uploads/${req.file.filename}`;
      const uploaderId = req.user?.id || null;

      const record = await prisma.uploadedFile.create({
        data: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size,
          url: relativeUrl,
          category,
          uploaderId,
        },
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: record.id,
          url: record.url,
          fileName: record.fileName,
          originalName: record.originalName,
          mimeType: record.mimeType,
          sizeBytes: record.sizeBytes,
          category: record.category,
        },
      });
    } catch (dbError) {
      next(dbError);
    }
  });
};
