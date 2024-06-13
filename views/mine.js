//CONSTENT AND VAREBUL
const but_setMore = document.getElementById("but_setMore"),
cheng_image = document.getElementById("cheng_image"),
cheng_video = document.getElementById("cheng_video"),
cheng_audio = document.getElementById("cheng_audio"),
cheng_file = document.getElementById("cheng_file"),


prompt_audio = document.getElementById("prompt_audio"),
prompt_img = document.getElementById("prompt_img"),
prompt_video = document.getElementById("prompt_video"),
prompt_file = document.getElementById("prompt_file"),



button_audio = document.getElementById("button_audio"),
button_msg = document.getElementById("button_msg"),



more_action = document.getElementById("more_action"),
online = document.getElementById("online"),
menu = document.getElementById("menu"),
menu_button = document.getElementById("menu_button"),

message_container = document.getElementById("message_container"),
form_message = document.getElementById("form_message"),
input_msg = document.getElementById("input_msg"),
promptU = document.getElementById("prompt"),

prompt_send = document.getElementById("prompt-send"),
prompt_input = document.getElementById("prompt-input"),

follow_insta = document.getElementById("follow_insta"),
follow_button = document.getElementById("follow_button"),
imr = document.querySelector(".i-m-r"),
header_image = document.getElementById("header_image"),

loginName = document.getElementById("loginName"),

header_call = document.getElementById("header_call"),

header_genr = document.getElementById("header-genr"),
for_image = document.getElementById("for_image"),

menu_input = document.getElementById("menu_input")


const now = new Date(); let hours12 = now.getHours() % 12; if (hours12 === 0) {
    hours12 = 12
}; let timeOfDay = "AM"; if (now.getHours() >= 12) {
    timeOfDay = "PM";
};
const time = `${timeOfDay} ${hours12}:${now.getMinutes().toString().padStart(2, "0")}`
const srcImr = new Image()
const setSrcImr = srcImr.src = "./image.jpg"
header_image.src = setSrcImr
// HELP FULL RESULTE
const arrErr = ['يبدو انك غير متصل بالأنترنت', 'تحقق من الشبكة الخاصة بك', 'من فضلك تحقق من الأتصال بالأنترنت', 'لست متصل بالأنترنت تحقق من ذالك']
let historyData = [];
function setHistory(UorM, text) {
    let x =
    {
        role: UorM,
        parts: [{
            text: text
        }]
    }
    historyData.push(x)

    if (historyData.length > 5) {
        historyData.splice(0, 2)
    }

}

let numDon = 0;
function handlingMessage(data, type, dataGen) {
    if(dataGen){
        var im = `
        <div class="for-image">
        <img onclick="saveImage(this.src)" src="${dataGen.result1[0]}" alt="end" />
        <img onclick="saveImage(this.src)" src="${dataGen.result1[1]}" alt="end" />
        <img onclick="saveImage(this.src)" src="${dataGen.result1[2]}" alt="end" />
        <img onclick="saveImage(this.src)" src="${dataGen.result1[3]}" alt="end" />
        </div>

        <div class="for-video">
        <video controls="" src="${dataGen.result2[0]}"></video>
        <video controls="" src="${dataGen.result2[1]}"></video>
        </div>
        `
    } else{
        im = ''
    }
    const rendom = Math.floor(Math.random() * 9999999999) + 1
    message_container.innerHTML += `
    <li class="message-right">
    <img class="i-m-r" src="${setSrcImr}">
    <div id="r${rendom}">
    ${data}
    ${im}
    

    </div>
    <span>المساعد - ${time}</span>
    </li>`

    scroll()
    if (type == 'chatText') {
        const EL = document.getElementById('r' + rendom).innerText
        setHistory('model', EL)
    }
    if (type == 'err') {
        historyData = []
    }

    if (!localStorage.getItem('keyFollow')) {
        numDon++
        if (numDon == 5) {
            follow_insta.style.display = 'flex'
        }
    }
    saveChats(message_container.innerHTML)
}

// GET CHATS IN DATA BS
if (localStorage.getItem('chats')) {
    message_container.innerHTML = localStorage.getItem('chats')
}




let disabled = true;
// //SENT MESSAGE TEXT
button_msg.onclick = async () => {
    if (input_msg.value == '') {
        return input_msg.focus()
    }
    if (disabled == true) {
        form_message.style.bottom = '-60px'
        disabled = false
    }

    message_container.innerHTML += `
    <li class="message-left">
        <div class="i-m-u">
        <div></div>
        </div>
        <p> <pre>${input_msg.value}</pre> </p>
        <span>انــت - ${time}</span>
    </li>`
    setHistory('user', input_msg.value)

    button_audio.style.left = '0'
    header_genr.style.left = '0'
    input_msg.blur(); onLine(); scroll();

    const parssToJson = await JSON.stringify({
        text: input_msg.value, historyData, varGenr
    })
    input_msg.value = ""; form_message.style.height = "50px";
    try {
        const res = await fetch('./gemini-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: parssToJson
        })
        const data = await res.json()
        console.log(data)
        
        form_message.style.bottom = '0'
        disabled = true
        handlingMessage(data.message, 'chatText', data.generativeImage)
    } catch (err) {
        setTimeout(() => {
            handlingMessage(arrErr[Math.floor(Math.random() * arrErr.length - 1) + 1], 'err')
            form_message.style.bottom = '0'
            input_msg.focus();
            disabled = true
        }, 1500)
    }
}

//SEND MESSAGE IMAGE
let typeSend;
prompt_send.onclick = async () => {
    if (disabled == true) {
        form_message.style.bottom = '-60px'
        more_action.classList.remove('toggle-more')
        disabled = false
    }
    if (prompt_input.value == '') {
        return prompt_input.focus()
    }
    closePrompt()
    let varebulMedia;
    let whatMedia;
    if (typeSend == 'image') {
        varebulMedia = `<img src="${URL.createObjectURL(cheng_image.files[0])}" alt="لا يمكن حفظ الصور🧩" class="img-icon">`
        whatMedia = cheng_image.files[0];

    } else if (typeSend == 'audio') {
        varebulMedia = `<audio class="audio2" controls src="${URL.createObjectURL(cheng_audio.files[0])}"></audio>`
        whatMedia = cheng_audio.files[0];

    } else if (typeSend == 'video') {
        varebulMedia = `<video controls class="img-icon" src="${URL.createObjectURL(cheng_video.files[0])}"></video>`
        whatMedia = cheng_video.files[0];

    } else if (typeSend == 'file') {
        varebulMedia = `<p class="docoment">${cheng_file.files[0].name}</p>`
        whatMedia = cheng_file.files[0];
    }

    message_container.innerHTML += `
    <li class="message-left">
    <div class="i-m-u"><div></div></div>
    ${varebulMedia}
    <p> ${prompt_input.value} </p>
    <span>انـت - ${time}</span>
    </li>`
    promptU.style.display = "none"
    scroll(); onLine()

    const formData = new FormData();
    formData.append('media', whatMedia);
    formData.append('prompt', prompt_input.value);
    formData.append('historyData', JSON.stringify(historyData));

    prompt_input.value = ""
    try {
        const res = await fetch('./gemini-media', {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        form_message.style.bottom = '0'
        more_action.style.margin = '50px'
        disabled = true
        handlingMessage(data.message, 'chatMedio')
    } catch (err) {
        setTimeout(() => {
            handlingMessage(arrErr[Math.floor(Math.random() * arrErr.length - 1) + 1], 'err')
            form_message.style.bottom = '0'
            more_action.style.margin = '50px'
            disabled = true
        }, 1500)
    }
}


//SCROLL DON BAGE
function scroll() {
    message_container.scrollBy({
        top: message_container.scrollHeight + 20,
        behavior: "smooth"
    });
}
scroll()

follow_button.onclick = () => {
    window.localStorage.setItem('keyFollow', 'userFollow')
    location = 'https://instagram.com/bashar1_x'
}

// SAVE CHAT IN LOCALE
const saveChats = (save) => {
    localStorage.setItem('chats', save)
}

//INPUT HEIGHT UP
input_msg.addEventListener("input", () => {
    form_message.style.height = "50px";
    form_message.style.height = input_msg.scrollHeight + "px";
});

//PROMPT IMAGE CHOSE
const closePrompt = () => {
    promptU.style.display = "none"
    prompt_audio.style.display = 'none'
    prompt_img.style.display = 'none'
    prompt_video.style.display = 'none'
    prompt_file.style.display = 'none'
}


//ONLINE OR NO
function onLine() {
    if (navigator.onLine) {
        online.style.background = '#1eb85e'
    } else {
        online.style.background = '#ba005d'
    }
};
onLine()


cheng_audio.onchange = () => {
    promptU.style.display = "flex"
    prompt_audio.style.display = "block"
    prompt_audio.src = URL.createObjectURL(cheng_audio.files[0])
    typeSend = 'audio'
}
cheng_image.onchange = () => {
    promptU.style.display = "flex"
    prompt_img.style.display = "block"
    prompt_img.src = URL.createObjectURL(cheng_image.files[0])
    typeSend = 'image'
}
cheng_video.onchange = () => {
    promptU.style.display = "flex"
    prompt_video.style.display = "block"
    prompt_video.src = URL.createObjectURL(cheng_video.files[0])
    typeSend = 'video'
}
cheng_file.onchange = () => {
    promptU.style.display = "flex"
    prompt_file.style.display = "block"
    prompt_file.innerHTML = cheng_file.files[0].name
    typeSend = 'file'

}

but_setMore.onclick = () => {
    more_action.classList.toggle('toggle-more')
}



let b = true; let recorder;
button_audio.onmousedown = async () => {
    if (b == true) {
        navigator.mediaDevices.getUserMedia({
            audio: true
        })
        .then(async (stream) => {
            recorder = await new MediaRecorder(stream);
            recorder.start();
            button_audio.classList.add('audio-inm')
            b = false
        })
        .catch((err) => {
            menu_button.click()
        })
    } else {
        await recorder.stop()
        recorder.ondataavailable = async function (e) {
            const blobUrl = URL.createObjectURL(e.data);

            button_audio.classList.remove('audio-inm')
            b = true

            message_container.innerHTML += `
            <li class="message-left">
            <div class="i-m-u"><div></div></div>
            <audio class="audio2" controls src="${blobUrl}"></audio>
            <span>انـت - ${time}</span>
            </li>`
            scroll(); onLine()
            const formData = new FormData()
            formData.append('audio', e.data, 'audio.webm')
            try {
                const res = await fetch('./gemini-audio', {
                    method: 'POST',
                    body: formData
                })
                const data = await res.json()
                handlingMessage(data.message, 'chatAudio')
            } catch (err) {
                setTimeout(() => {
                    handlingMessage(arrErr[Math.floor(Math.random() * arrErr.length - 1) + 1], 'err')
                }, 1500)
            }
        }
    }
}

input_msg.onkeyup = async () => {
    if (input_msg.value == '') {
        button_audio.style.left = '0'
        header_genr.style.left = "0"
    } else {
        header_genr.style.left = "-50px"
        button_audio.style.left = '70px'
        if (button_audio.classList.contains('audio-inm')) {
            await recorder.stop()
            button_audio.classList.remove('audio-inm')
        }
    }
}


var varGenr = false;
header_genr.onclick = () => {
    if (varGenr == false) {
        header_genr.style.borderColor = "#00B3C9"
        varGenr = true
    } else {
        header_genr.style.borderColor = "#333"
        varGenr = false
    }
}

if(!localStorage.getItem('login')){
    window.location = 'login.html'
}

if(localStorage.getItem('name')){
    loginName.innerHTML = localStorage.getItem('name')
}

header_call.onclick = async () => {
    window.location = 'call.html'
}


const saveImage = (e) => {
    const link = document.createElement("a");
    link.href = e;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const sendERR = () => {
    if(menu_input.value == '') {menu_input.focus(); return}
    
    window.location = `https://wa.me/+994402993020?text=${menu_input.value}`
}
