const qrcode = require('qrcode-terminal');
const express = require('express')
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai')
const { Client, LocalAuth } = require('whatsapp-web.js');

const bot = new Client({ authStrategy: new LocalAuth() });
const genAI = new GoogleGenerativeAI("AIzaSyDpNB7IQ4qLwNU_-4g3ye8pSwHjzaKXloY");

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.get('/', (req, res) => {
    res.json({ run: 'run bot2 wjs' })
}); app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })

// PING BOT ----
setInterval(async () => {
    const res = await fetch('https://gemini-wjs-b.onrender.com')
    const data1 = await res.json()
}, 100 * 1000)

// CONATED BOT BY MY WHATSAPP ---
bot.on('qr', (qr) => { qrcode.generate(qr, { small: true }) })
bot.on('ready', () => { console.log('bot is ready !') })

bot.on('message', async (msg) => {
    if (msg.body != '/start' && msg.body != '/follow' && msg.body != '/description') {
        if (msg.type == 'chat') {
            if (msg._data.quotedMsg) {
                if (msg._data.quotedMsg.type != 'image') {
                    //console.log(msg)
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
                    const chat = model.startChat({ generationConfig })
                    const result = await chat.sendMessage(msg.body)
                    //console.log("_______rest______text_", result.response.text())
                    const txt = result.response.text()
                    await bot.sendMessage(msg.from, txt);
                }
            } else {
               // console.log('22', msg)
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
                const chat = model.startChat({ generationConfig })
                const result = await chat.sendMessage(msg.body)
                //console.log("_______rest______text_", result.response.text())
                const txt = result.response.text()
                await bot.sendMessage(msg.from, txt);
            }
        }
    }
});

bot.on('message', async (ctx) => {
    if (ctx.body != '/start' && ctx.body != '/follow' && ctx.body != '/description') {
        if (ctx.type == 'image') {
            if (ctx.body != '') {
               // console.log('--2img--', ctx)
                const mediaData = await ctx.downloadMedia()
                const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                const prompt = ctx.body;
                const image = { inlineData: { data: mediaData.data, mimeType: "image/png", } };
                const result = await model.generateContent([prompt, image]);
                //console.log("_______rest______img_", result.response.text());
                const txt = result.response.text()
                await bot.sendMessage(ctx.from, txt);
            } else {
                const arr = [
                    `عذرا أسحب الصورة الى اليسار وأكتب تحتها ماذا تريد كي أجيبك`,
                    `لا اعلم ماذا تريد بالضبط من الصورة, قم بكتابة ما تريد تحتها عن طريق سحبها الى اليسار`,
                    `عفوا يجب كتابة ما تريد تحت الصورة, أسحب الصورة الى اليسار`,
                    `عزيزي لكي استطيع مساعدتك يجب عليك توضيح ماذا تريد من الصورة, أسحب الصورة الى اليسار`
                ]
                const random = Math.floor(Math.random() * arr.length - 1) + 1;
                await msg.reply(arr[random]);
            }
        }
    }
})

bot.on('message', async (ctx) => {
    if (ctx.body != '/start' && ctx.body != '/follow' && ctx.body != '/description') {
       // console.log(ctx.hasQuotedMsg)
        if (ctx.type == 'chat' && ctx._data.quotedMsg) {
            if (ctx._data.quotedMsg.type == 'image') {
               // console.log('--2img--', ctx)
                const quotedMessage = await ctx.getQuotedMessage();
                const mediaData = await quotedMessage.downloadMedia();
               // console.log(mediaData)
                const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                const prompt = ctx.body;
                const image = { inlineData: { data: mediaData.data, mimeType: "image/png", } };
                const result = await model.generateContent([prompt, image]);
               // console.log("_______rest______img_", result.response.text());
                const txt = result.response.text()
                await bot.sendMessage(ctx.from, txt);
            }
        }
    }
})

bot.on('message', async (msg) => {
    //console.log(msg)
    if (msg.type == 'ptt') {
        const arr = [
            `انا لا استطيع سماع الرسائل الصوتية`,
            `عفوا لا يمكنني سماع الصوت لم اتدرب جيدا على هذا`,
            `أتمنى لو كان بامكاني سماع الصوت لاكن لم اتدرب بشكل كاف`
        ]
        const random = Math.floor(Math.random() * arr.length - 1) + 1;
        await msg.reply(arr[random]);
    }

})


// COMMAND RUN BOT ---
bot.on('message', async (msg) => {
    if (msg.body == '/start') {
        const txt1 = '`قائمة الأوامر ...` \n\n */start* _`البدأ والحصول على قائمة الأوامر الخاصة بي`_ \n\n */description* _`الوصف وبعض التعليمات`_ \n\n */follow* _`تستطيع متابعتي على مواقع التواصل`_ \n أكتب آحد الأوامر مع "/" وأرسله \n'
        const txta1 = `\n
 أهلا بك..

حسناً هل أنت بحاجة إلى اي مساعدة او ينقصك بعض المعلومات، لا عليك أنا سوف أساعدك، اسالني وسوف أجيب؛

أنا أملك موسوعة هائلة من المعلومات العامة وأملك المعرفة في أمور عديدة مثل الرياضيات، الطب، الدين، الطبخ، التحليل... وغيرها من الأمور العديدة

    
وأنا قادر على تحليل الصور، بإمكانك ارسال لي صورة مع تحديد ماذا تريد من الصورة بكتابة ماذا تريد تحتها.`
        await msg.reply(txt1);
    }
    if (msg.body == '/follow') {
        const txt2 = '`تستطيع متابعتي على ...` \n\n _`Insta`•[instagram.com/bashar1_x]_ \n\n _`Telegram`•[t.me/bashar1_x]_ \n\n _`Facebook`•[facebook.com/bashar1.x]_ \n\n _`Wtatsapp`•[wa.me/0985780023]_'
        await msg.reply(txt2);
    }
    if (msg.body == '/description') {
        const txt3 = `
أنا ذكاء اصطناعي قادر على الإجابة عن كافة الأسئلة والمواضيع العامة،
        
وانا أملك قاعدة بيانات هائلة من جوجل وأملك سيرفر سريع وسلس بفضل مطوري @bashar 985780023 وكل هذا لكي أقدم افضل أداء وأدق المعلومات؛
"يتوفل لي نسخه على تلكرام بأمكانك تجربتها https://t.me/helps_full_bot"
        
            
للمزيد من المعلومات حول هذا البوت، أو حدوث أخطأ أثناء الاستخدام يمكنك مراسلة الحسابات التالية.
_bashar[0985780023], hamam[0938278247], amjad[0983385125]_`
        await msg.reply(txt3);
    }
})



bot.initialize();
// // await msg.reply('hi');
