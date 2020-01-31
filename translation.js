const api_key = "trnsl.1.1.20200131T112310Z.bfc1d36c54675d02.261fee42a4730dcc205a9a15b708749acc263fba";
var languages = [];
var selectedLang = "en";
var selectedFromLang = "es";
var finalTranscript = '';

window.onload = ()=>{
    loadSupportedLanguages();
    createCanvas();
}

function translateText(text){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            if(isOverflown(document.querySelector("#translationBox"))){
                document.querySelector("#translationBox").innerHTML = '';
                finalTranscript = '';
            }
            document.querySelector("#translationBox").innerHTML += res.text;
        }
    };
    xhttp.open("POST", encodeURI("https://translate.yandex.net/api/v1.5/tr.json/translate?lang="+selectedFromLang+"-"+selectedLang+"&key="+api_key+"&text="+text), true);
    xhttp.send();
}

function translateFinalText(text){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            if(isOverflown(document.querySelector("#translationBox"))){
                document.querySelector("#translationBox").innerHTML = '';
                finalTranscript = '';
            }
            document.querySelector("#translationBox").innerHTML = res.text;
        }
    };
    xhttp.open("POST", encodeURI("https://translate.yandex.net/api/v1.5/tr.json/translate?lang="+selectedFromLang+"-"+selectedLang+"&key="+api_key+"&text="+text), true);
    xhttp.send();
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight;
}

function loadSupportedLanguages(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            var json = res["langs"];
        
            let cont = 0;
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    document.querySelector("#supportedLanguages").innerHTML += '<option value="'+key+'">'+json[key]+'</option>';
                    document.querySelector("#supportedFromLanguages").innerHTML += '<option value="'+key+'">'+json[key]+'</option>';

                    languages.push({
                        key: json[key]
                    });
                    cont++;
                }
              }
              document.querySelector("#supportedLanguages").value = selectedLang;
              document.querySelector("#supportedFromLanguages").value = selectedFromLang;
              transcriptVoice();
        //document.querySelector("#supportedLanguages").innerHTML +=
        }
    };
    xhttp.open("POST", "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui=en&key="+api_key, true);
    xhttp.send();
}

function changeLang(){
    let select = document.querySelector("#supportedLanguages");
    selectedLang = select.options[select.selectedIndex].value;
}

function changeFromLang(){
    let select = document.querySelector("#supportedFromLanguages");
    selectedFromLang = select.options[select.selectedIndex].value;
}

function transcriptVoice() {
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let recognition = new window.SpeechRecognition();
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.continuous = true;
    recognition.lang = selectedFromLang+"-"+selectedFromLang.toUpperCase();
    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
            let transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                //translateFinalText(interimTranscript);
                interimTranscript += transcript;
            }
            translateFinalText(finalTranscript);

        }
        
        //document.querySelector('#msg' + totalMsgs).innerHTML = finalTranscript + '<i style="color:#ddd; float: right;">' + interimTranscript + '</>';
    }

    recognition.start();
}