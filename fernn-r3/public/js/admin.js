var sch=false;
function schowaj(){
    if(window.innerWidth>=768)
    {
        document.getElementById("navbarNavDropdown").classList.add("d-none");
        sch=true;
    }else{
        if(sch==true)
        {
            document.getElementById("navbarNavDropdown").classList.remove("d-none");
            sch=false;
        }
    }
    window.setTimeout(schowaj, 100);
}
schowaj();

const ToTop = document.getElementById("ToTop");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        ToTop.style.display = "block";
    } else {
        ToTop.style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}