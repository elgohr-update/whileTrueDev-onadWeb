// Imports the Google Cloud client library
import * as textToSpeech from '@google-cloud/text-to-speech';
import { PurchaseMessage, AudioEncoding, Voice } from '../@types/data';

// Creates a client

async function purchaseMessageTTS(purchaseData: PurchaseMessage) {
  const privateKey = process.env.GOOGLE_CREDENTIALS_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
  const options = {
    credentials: {
      private_key: privateKey,
      client_email: process.env.GOOGLE_CREDENTIALS_EMAIL,
    },
  };
  const client = new textToSpeech.TextToSpeechClient(options);

  // The text to synthesize

  const { userId } = purchaseData;
  const { productName } = purchaseData;
  const quantity = purchaseData.purchaseNum;
  const { text } = purchaseData;

  // 추후 선택기능 넣을 예정
  const messageWithAppreciate = `
  <speak>
    ${userId}님 ${productName} ${quantity}원 구매 감사합니다 <break time="0.4s"/> ${text}
  </speak>
  `;

  // const messageOnlyMessage = `
  //   <speak>
  //     ${text}
  //   </speak>
  // `

  const audioConfig: AudioEncoding = { speakingRate: 1.3, audioEncoding: 'MP3' };
  const voice: Voice = { languageCode: 'ko-KR', name: 'ko-KR-Standard-A', ssmlGender: 'FEMALE' };
  // Construct the request
  const params = {
    input: { ssml: messageWithAppreciate },
    // Select the language and SSML voice gender (optional)
    voice, // , ssmlGender: 'NEUTRAL'
    // select the type of audio encoding
    audioConfig,
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(params);
  // Write the binary audio content to a local file
  if (response && response.audioContent) {
    return response.audioContent;
  }
}

export default purchaseMessageTTS;
