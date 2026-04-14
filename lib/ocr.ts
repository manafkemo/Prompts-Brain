export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const Tesseract = (await import('tesseract.js')).default;
    const result = await Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    });
    return result.data.text.trim();
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}
