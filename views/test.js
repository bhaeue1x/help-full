const textarea = document.getElementById("message_input")
const message_form = document.getElementById("message-form");
const inp_file = document.getElementById("inp_file")
const prompt_image = document.getElementById("prompt-image")
const prompt_input = document.getElementById("prompt-input")
const prompt = document.getElementById("prompt")
const prompt_close = document.getElementById("prompt-close")
const prompt_send = document.getElementById("prompt-send")
const message_container = document.getElementById('message-container')
const audio = new Audio('audio.mp3')
const timer = new Date();
let hours = timer.getHours()
if (hours > 12) {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,];
    hours = arr[hours - 1]
}
const time = `${hours}: ${timer.getMinutes()}`



message_form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (textarea.value == '') {
        return textarea.focus()
    }
    message_container.innerHTML += `
        <li class="message-left">
            <p>
                <pre>${textarea.value}</pre>
            </p>
            <span>أنــت ● ${time}</span>
        </li>`
    message_form.style.height = "55px"
    audio.play(); textarea.focus(); scroll()


  let jss = await JSON.stringify({message_cont: textarea.value})
  textarea.value = ""
    const res = await fetch('./gemini-text', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: jss
    })
    const data = await res.json()
    message_container.innerHTML += `
    <li class="message-right">
    <p>
    <pre>${data.message_cont}</pre>
    </p>
    <span>المساعد ● ${time}</span>
    </li>`
    
    scroll()
})



prompt_send.onclick = async () => {
    if (prompt_input.value == '') {
        return prompt_input.focus()
    }
    message_container.innerHTML += `
        <li class="message-left">
            <p class="img-icon">🏜️️</p>
            <p>
                ${prompt_input.value}
            </p>
            <span>امجد ● ${time}</span>
        </li>`

    audio.play()
    prompt.style.display = "none"
    message_form.style.display = "flex"
    scroll()
    prompt_image.src = ''
    const formData = new FormData();
    formData.append('image', inp_file.files[0]);
    formData.append('prompt', prompt_input.value);
    prompt_input.value = ""
    const res = await fetch('./gemini-image', {
        method: 'POST',
        body: formData
    })
    const data = await res.json()
    message_container.innerHTML += `
    <li class="message-right">
    <p>
    <pre >${data.message_cont}</pre>
    </p>
    <span>المساعد ● ${time}</span>
    </li>`
}






textarea.addEventListener("input", () => {
    message_form.style.height = "27px"; // إزالة ارتفاع محدد مسبقًا
    message_form.style.height = textarea.scrollHeight + "px";
});


prompt_close.onclick = () => {
    prompt.style.display = "none"
    message_form.style.display = "flex"
    prompt_image.src = ''
}

inp_file.onchange = () => {
    prompt.style.display = "flex"
    message_form.style.display = "none"
    prompt_image.src = URL.createObjectURL(inp_file.files[0])
}


// SCROLL TO UP BAGE
const scroll = () => { message_container.scrollTo(0, message_container.scrollHeight) }


if ('beforeinstallprompt' in window) {
  window.addEventListener('beforeinstallprompt', (evt) => {
    evt.preventDefault();
    evt.prompt();
  });
}
