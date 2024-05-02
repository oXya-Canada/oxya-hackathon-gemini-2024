import { HttpException } from '@/exceptions/HttpException';
import axios from 'axios';
import { jsonrepair } from 'jsonrepair';

const oxygenApi = axios.create({
  baseURL: 'https://oxyagenai-pv52shfn2q-nn.a.run.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

class OxyagenAiService {
  async generateCardsFromPdf(dataBuffer: Express.Multer.File, numberOfCards: number) {
    try {
      const file = new File([dataBuffer.buffer], dataBuffer.originalname, { type: dataBuffer.mimetype });
      const prompt = `
        Generate ${numberOfCards} question-answer about this pdf file.
        The question should present four potential answers.
        Only one of these answers should be correct.
        Each answer should come with a unique explanation.
        The output needs to be in JSON format, similar to the following example :
        [{"question":"What is the color of the sky?","answers":[{"text":"green","correct":false,"explanation":"The sky is not green, it's blue."},{"text":"blue","correct":true,"explanation":"The sky is blue because it reflects the water"}]}]`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', prompt);
      const res = (
        await oxygenApi.postForm('/genai_query/gemini_pro_single_pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      ).data.response;
      console.log(res);
      return formatOutput(res);
    } catch (error) {
      console.log(error.response.data);
      throw new HttpException(400, 'Error generating cards from pdf', error.response.data);
    }
  }
  async generateCardsFromCorpus(corpus_id: number, numberOfCards: number) {
    try {
      const corpusPrompt = `
        Generate ${numberOfCards} question-answer about this corpus.
        The question should present four potential answers.
        Only one of these answers should be correct.
        Each answer should come with a unique explanation.
        The output needs to be in JSON format, similar to the following example :
        [{"question":"What is the color of the sky?","answers":[{"text":"green","correct":false,"explanation":"The sky is not green, it's blue."},{"text":"blue","correct":true,"explanation":"The sky is blue because it reflects the water"}]}]`;
      console.log('ici');
      const res = (
        await oxygenApi.post('/genai_query/genai_corpus_query', {
          prompt: corpusPrompt,
          corpus_id,
          json_output: true,
        })
      ).data.answer;

      return formatOutput(res);
    } catch (error) {
      console.log(error);
      throw new HttpException(400, 'Error getting documents by corpus id');
    }
  }
  async getCorpus() {
    try {
      const res = await oxygenApi.get('/data_ingestion/corpus');
      return res.data;
    } catch (error) {
      throw new HttpException(400, 'Error getting corpus');
    }
  }
  async createCorpus(corpus_name: any) {
    try {
      const res = await oxygenApi.post('/data_ingestion/corpus', {
        corpus_name,
      });
      return res.data;
    } catch (error) {
      throw new HttpException(400, 'Error creating corpus');
    }
  }
  async deleteCorpus(corpus_id: string) {
    try {
      const res = await oxygenApi.delete(`/data_ingestion/corpus/${corpus_id}`);
      return res.data;
    } catch (error) {
      throw new HttpException(400, 'Error deleting corpus');
    }
  }
  async updateCorpus(corpus_id: string, corpus_name: string) {
    try {
      const res = await oxygenApi.put(`/data_ingestion/corpus/${corpus_id}`, {
        corpus_name,
      });
      return res.data;
    } catch (error) {
      throw new HttpException(400, 'Error updating corpus');
    }
  }
  async getDocumentsByCorpusId(corpus_id: string) {
    try {
      const res = await oxygenApi.get(`/data_ingestion/corpus_document/${corpus_id}`);
      return res.data;
    } catch (error) {
      throw new HttpException(400, 'Error generating cards from corpus');
    }
  }
  async deleteDocumentFromCorpus(document_id: string) {
    try {
      const res = await oxygenApi.delete(`/data_ingestion/corpus_document/${document_id}`);
      return res.data;
    } catch (error) {
      throw new HttpException(400, 'Error deleting document from corpus');
    }
  }
  async addDocumentToCorpus(corpus_id: number, document: Express.Multer.File) {
    try {
      const file = new File([document.buffer], document.originalname, { type: document.mimetype });
      const formData = new FormData();
      formData.append('file', file);
      console.log(corpus_id);
      formData.append('corpus_id', Number(corpus_id));
      const res = await oxygenApi.post('/data_ingestion/corpus_document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      throw new HttpException(400, 'Error adding document to corpus');
    }
  }
}

function formatOutput(output: string) {
  return JSON.parse(jsonrepair(output.replaceAll('```json\n', '').replaceAll('```', '').trim()));
}

export default OxyagenAiService;
