import { TextDocument } from '@google-cloud/language';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.NL_PROJECT_ID;
const credentials = process.env.NL_KEY;

const client = new TextDocument({ projectId, credentials });

export async function analyzeText(text: string) {
    const document = client.document({ content: text, type: 'PLAIN_TEXT' });
    const [result] = await document.analyzeSentiment();
    return result.sentiment;
}
