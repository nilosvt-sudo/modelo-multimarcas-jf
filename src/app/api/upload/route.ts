import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToProcess: File[] = [];
    if (singleFile && singleFile.size > 0) {
      filesToProcess.push(singleFile);
    }
    if (files && files.length > 0) {
      for (const f of files) {
        if (f.size > 0 && !filesToProcess.includes(f)) {
          filesToProcess.push(f);
        }
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado ou arquivo vazio." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of filesToProcess) {
      // Validate file type
      const mimeType = file.type;
      if (!mimeType.startsWith("image/")) {
        return NextResponse.json(
          { error: `Tipo de arquivo inválido (${mimeType}). Apenas imagens são permitidas.` },
          { status: 400 }
        );
      }

      // Max 10MB per image
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `A imagem ${file.name} excede o limite de 10MB.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const extension = path.extname(file.name) || ".jpg";
      const randomId = crypto.randomBytes(8).toString("hex");
      const safeFileName = `car_${Date.now()}_${randomId}${extension.toLowerCase()}`;

      const filePath = path.join(uploadDir, safeFileName);
      await writeFile(filePath, buffer);

      uploadedUrls.push(`/uploads/${safeFileName}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Falha ao processar o upload da imagem." },
      { status: 500 }
    );
  }
}
