const $ = document
const URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

const search_form = $.getElementById('search-form')
const input = $.querySelector('input')
const button = $.querySelector('button')
const result_sec = $.getElementById('result-sec')

const audio_elem = $.getElementById('audio-elem')

let partOfSpeech = new Set() //use set for not repeat
let audio_src = '';
let definitions = ``;
let phonetic = ''

let test;

function fetchData(word) {
    fetch(`${URL}${word}`)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                console.log('error ' + res.status)
                // console.log(res.json())
            }
        })
        .then(data => {
            if (data != undefined) {
                // console.log(data)
                crData(data[0])
            } else {
                emptyAll()
                let errElem = `<div id="description" class="font-mono">"<span class="err"> ${word}</span> " not defined</div>`
                result_sec.insertAdjacentHTML('afterbegin', errElem)

                console.log('not defined')
                // console.log(data)
            }
        })
}
function crData(data) {
    emptyAll()

    test = data
    data.meanings.forEach((mean) => {
        // console.log(mean)

        partOfSpeech.add(mean.partOfSpeech) //cr part Of Speech

        mean.definitions.forEach((defs) => {
            //Cr definithion
            definitions += `${defs.definition}
`})
    })
    showDataInPage(data)
}


function showDataInPage(data) {
    cr_audio_src(data)
    cr_phonetics(data)

    let partOfSpeech_list = Array.from(partOfSpeech)

    // console.log(data)
    let result_elems = `<div id="title-word">${data.word}<img onclick="phoneticsAudio('${audio_src}')" src="./pic/icon-speaker.png" alt="speaker"></div>
    <div id="adj-pronun" class="font-mono">${partOfSpeech_list.join()} ${phonetic}</div>
    <div id="description" class="font-mono">${definitions}</div>`
    result_sec.insertAdjacentHTML('afterbegin', result_elems)
}


function emptyAll() {
    input.value = ''
    result_sec.innerHTML = ''
    partOfSpeech = new Set()
    audio_src = '';
    definitions = ``;
    phonetic = ''
}

function phoneticsAudio(srcAudio) {
    if (srcAudio != '') {
        audio_elem.src = srcAudio
        audio_elem.play()
    }
}
function cr_audio_src(data) {
    if (data.phonetics.length != 0) { audio_src = data.phonetics[data.phonetics.length - 1].audio }
}
function cr_phonetics(data) {
    if (data.phonetics[data.phonetics.length - 1].text != undefined) {
        phonetic = data.phonetics[data.phonetics.length - 1].text
    } else {
        phonetic = ''
    }
}

window.addEventListener('load', () => {
    input.focus()
})
search_form.addEventListener('submit', (e) => {
    e.preventDefault()

    fetchData(input.value)

    button.classList.add('clickBtn')
    setTimeout(() => { button.classList = '' }, 100)
})

