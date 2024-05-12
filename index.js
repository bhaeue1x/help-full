import { fileURLToPath } from 'url'; import path, { dirname } from 'path'; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
import express from "express";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import multer from "multer";
import { marked } from "marked"; const upload = multer();
const app = express()
app.use(express.static('views')); app.use(express.urlencoded()); app.use(express.json());
const genAI = new GoogleGenerativeAI("AIzaSyDpNB7IQ4qLwNU_-4g3ye8pSwHjzaKXloY")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })
// 8192
const generationConfig = { temperature: 1, topK: 0, topP: 0.95, maxOutputTokens: 5000, };
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE, },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE, },
];
// RUN CHAT TEXT
async function runChatText(history, text) {
  try {
    const chat = model.startChat({
      generationConfig, safetySettings, history: history
    })
    const result = await chat.sendMessage(text)
    const response = result.response.text()
    const parserTo = await marked.parse(response)
    return parserTo
  } catch (err) { return 'err' }
}
// RUN CHAT MEDIA
async function runChatMedia(history, prompt, data, mimeType) {
  try {
    const parssMedia = { inlineData: { data, mimeType } };
    const chat = model.startChat({
      generationConfig, safetySettings, history: history
    })
    const result = await chat.sendMessage([prompt, parssMedia])
    const response = result.response.text()
    const parserTo = await marked.parse(response)
    return parserTo
  } catch (err) {
    return 'err'
  }
}

// RUN CHAT AUDIO
async function runChatAudio(data, mimeType) {
  try {
    const parssMedia = { inlineData: { data, mimeType } };
    const chat = model.startChat({
      generationConfig,
      safetySettings
    })
    const result = await chat.sendMessage(['?', parssMedia])
    const response = result.response.text()
    const parserTo = await marked.parse(response)
    return parserTo
  } catch (err) {
    return 'err'
  }
}
// RUN CHAT CALL
async function runChatCall(data, mimeType) {
  try {
    const parssMedia = { inlineData: { data, mimeType } };
    const chat = model.startChat({
      generationConfig,
      safetySettings
    })
    const result = await chat.sendMessage(['?', parssMedia])
    const response = result.response.text()
    return response
  } catch (err) {
    return 'err'
  }
}



// runChat('hi')
const err_msg = ['حاول مجددا', 'هنالك مشكلة حدثت لتو, من فضلك ابلغ مطوري ليقوم بحلها, شكرا لك على تعاونك \n <a style="color: #ba005d;" href="https://instagram.com/bashar1_x">انستغرام</a> & <a style="color: #00b938;" href="https://wa.me/0985780023">واتساب</a>']
const arr_bad = ['مرحبا بك كيف حالك اليوم هل انت بحاجة الى مساعدة انا ذكاء اصطناعي قادر على مساعدتك', 'مرحبا انا نموذج ذكاء اصطناعي تم تطويري بواسطة بشار الحيوي', 'انا ذكاء اصطناعي تم تدريبي بواسطة بشار مرشد الحيوي']

// HANDLING RAOTER ...
app.get('/app-1.5', (req, res) => { res.sendFile(__dirname + '/views/index2.html') })


// GEMINI TEXT ..
app.post('/gemini-text', async (req, res) => {
  try {
    const result = await runChatText(req.body.historyData, req.body.text)
    if (result == 'err') {
      res.json({ message: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
    } else {
      if (result.includes("نموذج") && result.includes("أنا") && result.includes("جوجل")) {
        res.json({ message: arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1] })
      } else {
        res.json({ message: result })
      }
    }
  } catch (err) { console.log('err') }
})


// GEMINI MEDIA ..
app.post('/gemini-media', upload.single('media'), async (req, res) => {

  const buffer = req.file.buffer.toString('base64')
  const historyData = JSON.parse(req.body.historyData)
  try {
    const result = await runChatMedia(historyData, req.body.prompt, buffer, req.file.mimetype)
    if (result == 'err') {
      res.json({ message: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
    } else {
      if (result.includes("نموذج") && result.includes("أنا") && result.includes("جوجل")) {
        res.json({ message: arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1] })
      } else {
        res.json({ message: result })
      }
    }
  } catch (err) { console.log('err') }
})


// GEMINI AUDIO ..
app.post('/gemini-audio', upload.single('audio'), async (req, res) => {
  const buffer = req.file.buffer.toString('base64')
  try {
    const result = await runChatAudio(buffer, req.file.mimetype)
    if (result == 'err') {
      res.json({ message: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
    } else {
      if (result.includes("نموذج") && result.includes("أنا") && result.includes("جوجل")) {
        res.json({ message: arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1] })
      } else {
        res.json({ message: result })
      }
    }
  } catch (err) { console.log('err') }
})

// GEMINI CALL ..
app.post('/gemini-call', upload.single('audio'), async (req, res) => {
  const buffer = req.file.buffer.toString('base64')
  try {
    const result = await runChatCall(buffer, req.file.mimetype)
    if (result == 'err') {
      res.json({ message: err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1] })
    } else {
      if (result.includes("نموذج") && result.includes("أنا") && result.includes("جوجل")) {
        res.json({ message: arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1] })
      } else {
        res.json({ message: result })
      }
    }
  } catch (err) { console.log('err') }
})


// LOGIN USERS ..
app.post('/login', async (req, res) => {
  try {
    const text = `name: ${req.body.name} \n user-name: ${req.body.user} \n number: ${req.body.number} \n ip: ${req.body.ip}`
    const formData = new FormData(); formData.append("text", text);
    const tokin = '6351210996:AAEqIL8M169m5qfnS2qCz2VXKilvqFT9WMM'
    const url = `https://api.telegram.org/bot${tokin}/sendMessage?chat_id=5358365084`
    const res2 = await fetch(url, {
      method: 'POST',
      body: formData
    })
    const data = await res2.json()
    res.json({ message: data.ok })
  } catch (err) { 
    res.json({ message: false })
  }
})

app.get('/run', (req, res) => { res.json({ run: 'server on line1' }) })

// DOWNLOAD APP
app.get('/download', (req, res) => { res.sendFile(__dirname + '/views/download.html') })
app.get('/', (req, res) => { res.sendFile(__dirname + '/views/download.html') })


// PING BOT ----
setInterval(async () => {
  try {
    const res = await fetch('https://gemini-wjs-b.onrender.com/run')
    const data1 = await res.json()
  } catch (err) { console.log('errRun') }
}, 100 * 1000)

app.listen(process.env.PORT || 3000, () => { console.log(`app listen now ...`) })
