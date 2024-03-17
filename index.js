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
    res.json({ run: 'run bot11 wjs' })
}); app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })

// PING BOT ----
setInterval(async () => {
    try {
        const res = await fetch('https://gemini-wjs-b.onrender.com')
        const data1 = await res.json()
    } catch (err) {
        console.log('err')
    }
}, 100 * 1000)

// CONATED BOT BY MY WHATSAPP ---
bot.on('qr', (qr) => { qrcode.generate(qr, { small: true }) })
bot.on('ready', () => { console.log('bot is ready !') })

const arr = ['start', 'Start', 'follow', 'Follow', 'description', 'Description']
const arr2 = [
    'عذرا! يبدو ان هناك ضعف في الأتصال',
    'حاول توضيح ما تريد من فضلك',
    'اعتذر لأني لم افهمك جيدا',
    'حاول صياغة سؤالك بطريقة افضل',
    'يجي متابعتي أولا _[instagram.com/bashar1_x]_'
]

bot.on('message', async (msg) => {
    if (!arr.includes(msg.body)) {
        if (msg.type == 'chat') {
            if (msg._data.quotedMsg) {
                if (msg._data.quotedMsg.type != 'image') {
                    try {
                        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                        const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
                        const chat = model.startChat({ generationConfig })
                        const result = await chat.sendMessage(msg.body)

                        const txt = result.response.text()
                        await bot.sendMessage(msg.from, txt)
                        run(msg.from)
                    } catch (err) {
                        await bot.sendMessage(msg.from, arr2[Math.floor(Math.random() * arr2.length - 1) + 1])
                    }
                }
            } else {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
                    const chat = model.startChat({ generationConfig })
                    const result = await chat.sendMessage(msg.body)

                    const txt = result.response.text()
                    await bot.sendMessage(msg.from, txt)
                    run(msg.from)
                } catch (err) {
                    await bot.sendMessage(msg.from, arr2[Math.floor(Math.random() * arr2.length - 1) + 1])
                }
            }
        }
    }
});

bot.on('message', async (ctx) => {
    if (!arr.includes(ctx.body)) {
        if (ctx.type == 'image') {
            if (ctx.body != '') {
                try {
                    const mediaData = await ctx.downloadMedia()
                    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                    const prompt = ctx.body;
                    const image = { inlineData: { data: mediaData.data, mimeType: "image/png", } };
                    const result = await model.generateContent([prompt, image])
                    const txt = result.response.text()

                    await bot.sendMessage(ctx.from, txt)
                    run(ctx.from)
                } catch (err) {
                    await bot.sendMessage(ctx.from, arr2[Math.floor(Math.random() * arr2.length - 1) + 1])
                }
            } else {
                const arr = [
                    `عذرا أسحب الصورة الى اليسار وأكتب تحتها ماذا تريد كي أجيبك`,
                    `لا اعلم ماذا تريد بالضبط من الصورة, قم بكتابة ما تريد تحتها عن طريق سحبها الى اليسار`,
                    `عفوا يجب كتابة ما تريد تحت الصورة, أسحب الصورة الى اليسار`,
                    `عزيزي لكي استطيع مساعدتك يجب عليك توضيح ماذا تريد من الصورة, أسحب الصورة الى اليسار`
                ]
                const random = Math.floor(Math.random() * arr.length - 1) + 1;
                await ctx.reply(arr[random])
                    .catch(async () => { await bot.sendMessage(ctx.from, ) })
            }
        }
    }
})



bot.on('message', async (ctx) => {
    if (!arr.includes(ctx.body)) {
        if (ctx.type == 'chat' && ctx._data.quotedMsg) {
            if (ctx._data.quotedMsg.type == 'image') {
                try {
                    const quotedMessage = await ctx.getQuotedMessage();
                    const mediaData = await quotedMessage.downloadMedia();

                    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                    const prompt = ctx.body;
                    const image = { inlineData: { data: mediaData.data, mimeType: "image/png", } };
                    const result = await model.generateContent([prompt, image])

                    const txt = result.response.text()
                    await bot.sendMessage(ctx.from, txt)
                    run(ctx.from)
                } catch (err) {
                    await bot.sendMessage(ctx.from, arr2[Math.floor(Math.random() * arr2.length - 1) + 1])
                }
            }
        }
    }
})

bot.on('message', async (msg) => {
    if (msg.type == 'ptt') {
        const arr = [
            `انا لا استطيع سماع الرسائل الصوتية`,
            `عفوا لا يمكنني سماع الصوت لم اتدرب جيدا على هذا`,
            `أتمنى لو كان بامكاني سماع الصوت لاكن لم اتدرب بشكل كاف`
        ]
        const random = Math.floor(Math.random() * arr.length - 1) + 1;
        await msg.reply(arr[random])
            .catch(async () => { await bot.sendMessage(msg.from, 'عذرا! يبدو ان هناك ضعف في الأتصال, حاول مجددا') })
    }
})

const run = async (id) => {
    const random = Math.floor(Math.random() * 5 - 1) + 1;
    if (random == 3) {
        try {
            const txt = '`يجب عليك متابعه bashar@ ...` \n _`Insta`•[instagram.com/bashar1_x]_'
            await bot.sendMessage(id, txt)
        } catch (err) { console.log('err') }
    }
}


// COMMAND RUN BOT ---
bot.on('message', async (msg) => {
    if (msg.body == 'start' || msg.body == 'Start') {
        const txt1 = '`قائمة الأوامر ...` \n\n *start* _`البدأ والحصول على قائمة الأوامر الخاصة بي`_ \n\n *description* _`الوصف وبعض التعليمات`_ \n\n *follow* _`تستطيع متابعتي على مواقع التواصل`_ \n أكتب احد الأوامر " " وأرسله \n'
        const txta1 = `\n
 أهلا بك..

حسناً هل أنت بحاجة إلى اي مساعدة او ينقصك بعض المعلومات، لا عليك أنا سوف أساعدك، اسالني وسوف أجيب؛

أنا أملك موسوعة هائلة من المعلومات العامة وأملك المعرفة في أمور عديدة مثل الرياضيات، الطب، الدين، الطبخ، التحليل... وغيرها من الأمور العديدة

    
وأنا قادر على تحليل الصور، بإمكانك ارسال لي صورة مع تحديد ماذا تريد من الصورة بكتابة ماذا تريد تحتها.`
        await msg.reply(txt1)
            .catch(async () => { await bot.sendMessage(msg.from, 'عذرا! يبدو ان هناك ضعف في الأتصال, حاول مجددا') })
    }
    if (msg.body == 'follow' || msg.body == 'Follow') {
        const txt2 = '`تستطيع متابعتي المطور على ...` \n\n _`Insta`•[instagram.com/bashar1_x]_ \n\n _`Telegram`•[t.me/bashar1_x]_ \n\n _`Facebook`•[facebook.com/bashar1.x]_ \n\n _`Wtatsapp`•[wa.me/0985780023]_'
        await msg.reply(txt2)
            .catch(async () => { await bot.sendMessage(msg.from, 'عذرا! يبدو ان هناك ضعف في الأتصال, حاول مجددا') })
    }
    if (msg.body == 'description' || msg.body == 'Description') {
        const txt3 = `
أنا ذكاء اصطناعي قادر على الإجابة عن كافة الأسئلة والمواضيع العامة،
        
وانا أملك قاعدة بيانات هائلة من جوجل وأملك سيرفر سريع وسلس بفضل مطوري @bashar 985780023 وكل هذا لكي أقدم افضل أداء وأدق المعلومات؛
"يتوفر لي نسخة على تلكرام بأمكانك تجربتها https://t.me/helps_full_bot النسخه على تلكرام اسرع وأفضل بأضعاف من التي على واتساب"
        
            
للمزيد من المعلومات حول هذا البوت، أو حدوث أخطأ أثناء الاستخدام يمكنك مراسلة الحسابات التالية.
_bashar[0985780023], hamam[0938278247], amjad[0983385125]_`
        await msg.reply(txt3)
            .catch(async () => { await bot.sendMessage(msg.from, 'عذرا! يبدو ان هناك ضعف في الأتصال, حاول مجددا') })
    }
})


bot.initialize();
