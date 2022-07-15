const mform = document.querySelector("#add");
const mgenderRadio = mform.querySelectorAll("input[name=rodzaj]");
const dokwoty = document.querySelector("#dokwoty");
const dowodu = document.querySelector("#dowodu");

const nazwisko = document.querySelector("#nazwisko");
const imie = document.querySelector("#imie");
const telefon = document.querySelector("#telefon");

const oczekiwania = document.getElementsByClassName("oczekiwania");

var sael = 1

for (const radio of mgenderRadio) {
    radio.addEventListener("change", e => {
        for (const radio of mgenderRadio) {
            if (radio.checked) 
            {
                if (radio.checked) {
                    if(sael==1)
                    {
                        oczekiwania[0].setAttribute("disabled", "");
                        oczekiwania[1].setAttribute("disabled", "");
                        oczekiwania[2].setAttribute("disabled", "");
                    }

                    var zmie = radio.value;
                    if(sael==2)
                    {
                        dowodu.setAttribute("required","");
                        dokwoty.setAttribute("disabled","");
                    }
                    if(sael==3)
                    {
                        dowodu.setAttribute("required","");
                        nazwisko.setAttribute("required","");
                        imie.setAttribute("required","");
                        telefon.setAttribute("required","");
                    }

                    if(zmie=="Gwarancyjna" || zmie=="Rękojmia"){
                        sael=1;
                    }else{
                        if(zmie=="Pogwarancyjna"){
                        sael=2;                             
                        }else{
                            sael=3;
                        }
                    }
                    switch(sael)
                    {
                        case 1:
                            oczekiwania[0].removeAttribute("disabled", "");
                            oczekiwania[1].removeAttribute("disabled", "");
                            oczekiwania[2].removeAttribute("disabled", "");
                        break;
                        case 2:
                            dowodu.removeAttribute("required");
                            dokwoty.removeAttribute("disabled","");
                        break;
                        case 3:
                            dowodu.removeAttribute("required");
                            nazwisko.removeAttribute("required","");
                            imie.removeAttribute("required","");
                            telefon.removeAttribute("required","");
                        break;
                    }
                    break;
                }
            }
        }
    });
}