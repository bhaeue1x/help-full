import { fileURLToPath } from 'url'; import path, { dirname } from 'path'; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
import express from 'express'
import multer from 'multer';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import cors from 'cors'
const genAI = new GoogleGenerativeAI('AIzaSyDpNB7IQ4qLwNU_-4g3ye8pSwHjzaKXloY');
const app = express()
const upload = multer();
app.use(cors()); app.use(express.json()); app.use(express.static('views')); app.use(express.urlencoded())

async function runText(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
        const chat = model.startChat({ generationConfig })
        const result = await chat.sendMessage(prompt)
        const response = await result.response.text()
        return response
    } catch (err) { return 'err' }
}
async function runImage(prompt, urlImage) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const imagePars = { inlineData: { data: urlImage, mimeType: "image/png", } };
        const result = await model.generateContent([prompt, imagePars]);
        const response = await result.response.text()
        return response
    } catch (err) { return 'err' }
}

app.get('/', (req, res) => { res.sendFile(__dirname + './views/index.html') })

const err_msg = ['من فضلك حاول صياغة سؤالك بطريقة اخرى', 'اعتذر اني لم افهم سؤالك جيدا', 'يبدو الأتصال ضعيف حاول مجددا']
app.post('/gemini-text', async (req, res) => {
    try {
        const result = await runText(req.body.message_cont)
        if (result == 'err') {
            res.json({ message_cont: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
        } else {
            res.json({ message_cont: result })
        }
    } catch (err) { console.log('err') }
})

app.post('/gemini-image', upload.single('image'),  async (req, res) => {
   const buffer = await req.file.buffer.toString('base64')
    try {
        const result = await runImage(req.body.prompt, buffer)
        if(result == 'err') {
            res.json({ message_cont: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
        } else {
            res.json({ message_cont: result })
        }
    } catch (err) {console.log('err')}
})

app.get('/*', (req, res) => { res.send('thes bage none2 ...') })
app.listen(process.env.PORT || 3000, () => { console.log(`app listen now ...`) })
