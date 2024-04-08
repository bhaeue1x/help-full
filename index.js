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

const arr_what = ['من مطورك', 'من طورك', 'من صنعك', 'من برمجك', 'من اخترعك', 'منو سواك', 'منو اخترعك', 'منو صنعك', 'منو برمجك', 'منو طورك', 'من بشار']
const arr_dev = ['بشار مرشد الحيوي', 'قام بتطويري بشار حيوي', 'بشار مرشد الحيوي القاطن في الرقة مزرعة ربيعة', 'مطوري بشار مرشد الحيوي', 'قام بإنشائي بشار وبمساعدة من  امجد الخلف']
const arr_bad = ['مرحبا بك كيف حالك اليوم هل انت بحاجة الى مساعدة انا ذكاء اصطناعي قادر على مساعدتك', 'مرحبا انا نموذج ذكاء اصطناعي تم تطويري بواسطة بشار الحيوي', 'انا ذكاء اصطناعي تم تدريبي بواسطة بشار مرشد الحيوي']
const err_msg = ['من فضلك حاول صياغة سؤالك بطريقة اخرى', 'اعتذر اني لم افهم سؤالك جيدا', 'يبدو الأتصال ضعيف حاول مجددا']
app.post('/gemini-text', async (req, res) => {
    try {
        const result = await runText(req.body.message_cont)
        if (!arr_what.includes(req.body.message_cont)) {
            if (result == 'err') {
                res.json({ message_cont: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
            } else {
                if (result.includes("نموذج") && result.includes("لغوي") && result.includes("جوجل")) {
                    res.json({message_cont: arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1]})
                } else {res.json({ message_cont: result })}
            }
        } else { res.json({ message_cont: arr_dev[Math.floor(Math.random() * arr_dev.length - 1) + 1] }) }

    } catch (err) { console.log('err') }
})

app.post('/gemini-image', upload.single('image'), async (req, res) => {
    const buffer = await req.file.buffer.toString('base64')
    try {
        const result = await runImage(req.body.prompt, buffer)
        if (result == 'err') {
            res.json({ message_cont: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
        } else {
            res.json({ message_cont: result })
        }
    } catch (err) { console.log('err') }
})

app.get('/run', (req, res) => { res.json({run: 'server on line1'}) })
// PING BOT ----
setInterval(async () => {
    try {
        const res = await fetch('https://gemini-wjs-b.onrender.com/run')
        const data1 = await res.json()
    } catch (err) {console.log('err')}
}, 100 * 1000)




app.listen(process.env.PORT || 3000, () => { console.log(`app listen now ...`) })
