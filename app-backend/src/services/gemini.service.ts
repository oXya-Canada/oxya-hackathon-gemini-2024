import { GoogleGenerativeAI } from '@google/generative-ai';
import { jsonrepair } from 'jsonrepair';
import { GOOGLE_GEN_AI_KEY } from '@/config';
import pdfParse from 'pdf-parse';
import { HttpException } from '@/exceptions/HttpException';
class GeminiService {
  private generativeAI = new GoogleGenerativeAI(GOOGLE_GEN_AI_KEY);
  private model = this.generativeAI.getGenerativeModel({
    model: 'gemini-1.5-pro-latest',
    generationConfig: { response_mime_type: 'application/json', maxOutputTokens: 1000000 },
    systemInstruction: {
      role: 'system',
      parts: [{ text: 'The output must always be in JSON format' }],
    },
  });

  async generateMultiChoiceCards(numberOfCards: number, certification: string) {
    try {
      const multiChoiceCardsPrompt = `Generate ${numberOfCards} question-answer for the ${certification} 2024 certification.
        The question should present four potential answers. 
        Only one of these answers should be correct. 
        Each answer should come with a unique explanation.
        The output needs to be in JSON format, similar to the following example :
        [{"question":"What is the color of the sky?","answers":[{"text":"green","correct":false,"explanation":"The sky is not green, it's blue."},{"text":"blue","correct":true,"explanation":"The sky is blue because it reflects the water"}]}]`;
      return formatOutput((await this.model.generateContent(multiChoiceCardsPrompt)).response.text());
    } catch (error) {
      console.log(error);
      throw new HttpException(400, 'Error generating cards from topic name');
    }
  }

  async generateCardsFromPdf(dataBuffer: Buffer, numberOfCards: number) {
    try {
      const pdfText = await pdfParse(dataBuffer);
      // return pdfText.text;
      const pdfPrompt = `
        Generate ${numberOfCards} question-answer about this pdf file.
  The question should present four potential answers.
  Only one of these answers should be correct.
  Each answer should come with a unique explanation.
  The output needs to be in JSON format, similar to the following example :
  [{"question":"What is the color of the sky?","answers":[{"text":"green","correct":false,"explanation":"The sky is not green, it's blue."},{"text":"blue","correct":true,"explanation":"The sky is blue because it reflects the water"}]}]`;
      const res = (await this.model.generateContent([pdfText.text, pdfPrompt])).response.text();
      console.log(res);
      return formatOutput(res);
    } catch (error) {
      console.log(error);
      throw new HttpException(400, 'Error generating cards from pdf');
    }
  }
}

function formatOutput(output: string) {
  return JSON.parse(jsonrepair(output.replaceAll('```json\n', '').replaceAll('```', '').trim()));
}

export default GeminiService;
