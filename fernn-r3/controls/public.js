var nodemailer = require('nodemailer');
var MySql = require('sync-mysql')
const encode = require('nodejs-base64-encode')
var url = require('url');

// dane do MySQL
var con = new MySql({
    host: "5.39.95.160",
    user: "master",
    password: "Brtk123.",
    database: "fernn"
})

// dane do wysyłania
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'robert.bogdanik13@gmail.com',
        pass: 'Brtk123.'
    }
})

// pobieranie danych do wysłanie email
const GiveData = (req, res, sess) => {
    // walidacja url
    let params = new URLSearchParams(url.parse(req.url, true).query)

    var error = false
    if(params.get('Error')=="true"){ error = true }

    var successsend = false
    if(params.get('SuccessSend')=="true"){ successsend = true }

    var emailbool = false
    var email
    if(params.get('Email')!=null){ emailbool = true; email = params.get('Email'); }
    
    // wygenerowanie widoku
    res.render('public/forgotpassword', {
        "Company": false,
        "Error": error,
        "SuccessSend": successsend,
        "EmailBool": emailbool,
        "Email": email,
    })
}

// strona glowna
const Home = (req, res, sess) => {
    // walidacja url
    var Work = false
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('Work')=="true"){ Work=true; }

    res.render('public/index', {
        "Work": Work
    }) 
}

// wysyłanie email z linkiem
const SendEmail = (req, res, sess) => {
    var EmailError = false

    // sprawdzanie ilości kont
    var sql='SELECT `_ID`, `Company` FROM `accounts` WHERE `Email`="'+encode.encode(req.body.email, 'base64')+'"'
    var PID = con.query(sql)
    if(PID.length != 1){ EmailError = true }

    if(EmailError && req.body.SC==null){
        // jeżeli coś się niezgadza
        if(PID.length>1){
            // otwarcie strony z wybraniem firmy w wypadku wielu dopasowanych firma
            res.redirect('/login/companypassword?Email='+req.body.email)
            return false
        }else{
            // generowanie fałszywego email
            var html = '\
            <div style=" width: 500px; margin: auto;">\
                <div style="text-align: center;">\
                    <img src="cid:logo" style="margin: 0 auto; width="300px;">\
                    <h1 style="color: #1a6aba; font-size: 50px; ">Zapomniane hasło</h1>\
                    <p style="color: #212121; font-size: 20px; ">W celu zmiany hasła kliknij w poniższy przycisk.</p><br>\
                    <a href="http://fernn.pl/login/restartpassword?Code=ABCDEFGHIG&PID=0&CID=0"><button style="text-decoration: none; padding: 10px; font-size: 20px; color: #fff; background-color: #0d6efd; border: 2px solid #0d6efd;">Odzyskaj dostęp</button></a><br><br>\
                    <p style="color: #212121; font-size: 18px;">Przycisk będzie aktywny 24h od daty wysłania. Po tym czasie konieczne będzie wysłanie nowej wiadomści.</p>\
                    <p style="color: #212121; font-size: 18px;">Jeśli to nie przez Ciebie został użyty formularz do odzyskiwania hasła i nie wiesz jakiego konta mailowego dotyczy to zignoruj tę wiadomość - najprawdopodobniej ktoś błędnie podał Twój adres na swoim koncie.</p><br><br>\
                    <p style="color: #212121; font-size: 12px;">Dziękujemy i pozdrawiamy!</p>\
                    <p style="color: #212121; font-size: 12px;">Zespół Fernn</p>\
                </div>\
            </div>'
        }
    }else{
        if(req.body.SC=="true")
        {
            // sprawdzanie czy firma została potem dobrana
            sql='SELECT a._ID, c._ID AS Company FROM `accounts` as a JOIN `company` as c ON a.Company = c._ID WHERE a.Email="'+encode.encode(req.body.email, 'base64')+'" AND c.Name="'+req.body.company+'"'
            PID = con.query(sql)
        }
        PID= PID[0]

        var pid = PID._ID
        var company = PID.Company

        // warzność linku
        var dane = new Date()
        var _1_dni = 1000 * 60 * 60 * 24;
        var a = new Date(dane);
        a.setTime(a.getTime() + _1_dni);
        a=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()+"T"+a.getHours()+":"+a.getMinutes()+":"+a.getSeconds()
    
        // kod weryfikacyjny
        var znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var kod =""
        for(var d=0; d<20; d++){
            kod+=znaki[getRandomInt(0,33)]
        }
        // wstawianie do bazy 
        sql='INSERT INTO `recovery` (`Company`, `Code`, `PID`, `importance`) VALUES ("'+company+'", "'+kod+'", "'+pid+'", "'+a+'")'
        con.query(sql)

        // generowanie dobrego email
        var html = '\
        <div style=" width: 500px; margin: auto;">\
            <div style="text-align: center;">\
                <img src="cid:logo" style="margin: 0 auto; width="300px;">\
                <h1 style="color: #1a6aba; font-size: 50px; ">Zapomniane hasło</h1>\
                <p style="color: #212121; font-size: 20px; ">W celu zmiany hasła kliknij w poniższy przycisk.</p><br>\
                <a href="http://fernn.pl/login/restartpassword?Code='+kod+'&PID='+pid+'&CID='+company+'"><button style="text-decoration: none; padding: 10px; font-size: 20px; color: #fff; background-color: #0d6efd; border: 2px solid #0d6efd;">Odzyskaj dostęp</button></a><br><br>\
                <p style="color: #212121; font-size: 18px;">Przycisk będzie aktywny 24h od daty wysłania. Po tym czasie konieczne będzie wysłanie nowej wiadomści.</p>\
                <p style="color: #212121; font-size: 18px;">Jeśli to nie przez Ciebie został użyty formularz do odzyskiwania hasła i nie wiesz jakiego konta mailowego dotyczy to zignoruj tę wiadomość - najprawdopodobniej ktoś błędnie podał Twój adres na swoim koncie.</p><br><br>\
                <p style="color: #212121; font-size: 12px;">Dziękujemy i pozdrawiamy!</p>\
                <p style="color: #212121; font-size: 12px;">Zespół Fernn</p>\
            </div>\
        </div>'
    }

    // opcej email
    var mailOptions = {
        from: 'robert.bogdanik13@gmail.com',
        to: req.body.email,
        subject: 'Zapomniane hasło',
        html: html,
        attachments: [{
            filename: 'image.png',
            path: './public/img/logo.png',
            cid: 'logo' 
        }]
    }

    // wysyłanie email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            // wpisanie do kąsoli błedu i pokazanie się o tym informacji
            console.log(error)
            res.redirect('/login/forgotpassword?Error=true&Email='+req.body.email)
        } else {
            // pokazanie potwierdzenia wysłania
            res.redirect('/login/forgotpassword?SuccessSend=true')
        }
    })
}

// wybieranie firmy
const SelectCompany = (req, res, sess) => {
    // pobranie i sprawdzenie adresu email
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('Email')==null){ res.redirect('/login/forgotpassword?Error=true'); return false; }

    // pobranie listy pasujących firm
    var email = params.get('Email')
    var sql='SELECT DISTINCT c.Name FROM `accounts` as a JOIN `company` as c ON a.Company = c._ID WHERE a.Email="'+encode.encode(email, 'base64')+'"'
    var wyn = con.query(sql)

    // wygenerowanie widoku
    res.render('public/forgotpassword', {
        "Company": true,
        "CompanyData": wyn,
        "Emial": email
    })
}

// update danych konta
const UpdateData = (req, res, sess) => {
    // walidacja url
    let params = new URLSearchParams(url.parse(req.url, true).query)

    if(params.get('Code')==null){ res.redirect('/login/forgotpassword?Error=true'); return false; }else{ var kod = params.get('Code') }
    if(params.get('PID')==null){ res.redirect('/login/forgotpassword?Error=true'); return false; }else{ var PID = params.get('PID') }
    if(params.get('CID')==null){ res.redirect('/login/forgotpassword?Error=true'); return false; }else{ var CID = params.get('CID') }

    // walidacja kodu weryfikacyjnego
    var sql='SELECT * FROM `recovery` WHERE `Company`="'+CID+'" AND `Code`="'+kod+'" AND `PID`="'+PID+'" AND `importance`>CURRENT_DATE()'
    var wyn = con.query(sql)

    if(wyn.length!=1){ res.redirect('/login/forgotpassword?Error=true'); return false; }

    // usunięcie rekordu do resetu hasła
    sql='DELETE FROM `recovery` WHERE `Company`="'+CID+'" AND `Code`="'+kod+'" AND `PID`="'+PID+'" AND `importance`>CURRENT_DATE()'
    con.query(sql)

    // wygenerowania widoku z resetem hasła
    res.render('public/forgotpassword', {
        "Update": true,
        "CID": CID,
        "PID": PID,
        "SuccessUpdate": false
    })
}

// zapisanie zmian 
const SaveData = (req, res, sess) => {
    // weryfikacja url
    if(req.body.hasloa!=req.body.haslob || req.body.hasloa.length<6 || req.body.hasloa!=null){ res.redirect('/login/forgotpassword?Error=true'); return false; }

    // update danych
    var sql='UPDATE `accounts` SET `Password` = "'+req.body.hasloa+'" WHERE `_ID` = "'+req.body.PID+'" AND `Company`="'+req.body.CID+'"'
    con.query(sql)

    // wygenerowanie widoku
    res.render('public/forgotpassword', {
        "Update": true,
        "SuccessUpdate": true
    })
}

// dodaweanie firm index
const StartCompany = (req, res, sess) => {
    // walidacja url
    let params = new URLSearchParams(url.parse(req.url, true).query)

    var Success =false
    if(params.get('Success')=="true"){ Success=true }

    var DataError =false
    if(params.get('DataError')=="true"){ DataError=true }

    var Error =false
    if(params.get('Error')=="true"){ Error=true }

    var SuccessSend =false
    if(params.get('SuccessSend')=="true"){ SuccessSend=true }

    // wygenerowanie widoku
    res.render('public/start', {
        "Success": Success,
        "DataError": DataError,
        "Error": Error,
        "SuccessSend": SuccessSend
    })
}

// dodawanie firmy
const InsertCompany =(req, res, sess) => {
    // sprawdzenie wystąpienia firmy w bazie
    var sql='SELECT * FROM `company` WHERE `NIP`="'+encode.encode(req.body.nip, 'base64')+'" OR `Email`="'+encode.encode(req.body.email, 'base64')+'"'
    var wyn = con.query(sql)

    if(wyn.length!=0){ res.redirect('/start?DataError=true'); return false; }

    if(req.body.plan=="Basic(Bezpłatne 14 dni)"){
        // dodanie firmy
        sql='INSERT INTO `company` (`Name`, `NIP`, `Email`, `Phone`, `Adress`) VALUES ( "'+req.body.name+'", "'+encode.encode(req.body.nip, 'base64')+'", "'+encode.encode(req.body.email, 'base64')+'", "'+encode.encode(req.body.telefon, 'base64')+'", "'+encode.encode(req.body.adres, 'base64')+'")'
        con.query(sql)

        // pibranie CID
        sql='SELECT `_ID` FROM `company` WHERE `NIP`="'+encode.encode(req.body.nip, 'base64')+'" AND `Email`="'+encode.encode(req.body.email, 'base64')+'"'
        wyn = con.query(sql)
        wyn = wyn[0]
        var firma = wyn._ID

        // wygenerowanie loginu
        var znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        var login =""
        for(var d=0; d<6; d++){
            login+=znaki[getRandomInt(0,33)]
        }

        // generowanie hasła
        var haslo =""
        for(var d=0; d<10; d++){
            haslo+=znaki[getRandomInt(0,33)]
        }

        // dodanie konta
        sql='INSERT INTO `accounts` (`Login`, `Email`, `Password`, `Firstname`, `Lastname`, `Permissions`, `Company`) VALUES ("'+encode.encode(login, 'base64')+'", "'+encode.encode(req.body.email, 'base64')+'", "'+encode.encode(haslo, 'base64')+'", "'+encode.encode(req.body.imie, 'base64')+'=", "'+encode.encode(req.body.nazwisko, 'base64')+'=", "1", "'+firma+'")'
        con.query(sql)

        // ustalenie końca okresu prubnego
        var dane = new Date()
        var _14_dni = 1000 * 60 * 60 * 24 * 14;
        var a = new Date(dane);
        a.setTime(a.getTime() + _14_dni);
        a=a.getFullYear()+"-"+(a.getMonth()+1)+"-"+a.getDate()
        today=dane.getFullYear()+"-"+(dane.getMonth()+1)+"-"+dane.getDate()

        // dodanie okresu
        sql='INSERT INTO `subscription` (`Company`, `Start`, `End`, `Plan`, `Account`, `Report`, `Attachment`, `Notifications`, `Complaints`) VALUES ("'+firma+'", "'+today+'", "'+a+'", "Test 14 dni", "2", "0", "0", "0", "50")'
        con.query(sql)

        // wygenerowanie email z hasłen i loginem
        var html = '\
        <div style=" width: 600px; margin: auto;">\
            <div style="text-align: center;">\
                <img src="cid:logo" style="margin: 0 auto; width="300px;">\
                <h1 style="color: #1a6aba; font-size: 50px; ">Witamy w systemie Fernn</h1><br><br>\
                <p style="color: #212121; font-size: 25px; margin-top: 20px;">Firma '+req.body.name+' została dodana pomyślnie. Poniżej znajdują się dane do logowania.</p>\
                <table border="1" style="margin: auto; font-size: 20px;">\
                    <tr>\
                        <th style="padding: 5px">Login</th>\
                        <td style="padding: 5px">'+login+'</td>\
                    </tr>\
                    <tr>\
                        <th style="padding: 5px">Hasło</th>\
                        <td style="padding: 5px">'+haslo+'</td>\
                    </tr>\
                </table><br><br>\
                <p style=" color: #212121; font-size: 25px; margin-top: 20px; margin-bottom: 20px;">Możesz zalogwać się teraz wchodząc na stronę www.fernn.pl/login lub klikając w poniższy przecisk.</p>\
                <a href="http://fernn.pl/login"><button style="text-decoration: none; padding: 10px; font-size: 25px; color: #fff; background-color: #0d6efd; border: 2px solid #0d6efd;">Zaloguj się teraz</button></a><br><br>\
                <p style="color: #212121; font-size: 12px;">Dziękujemy i pozdrawiamy!</p>\
                <p style="color: #212121; font-size: 12px;">Zespół Fernn</p>\
            </div>\
        </div>'

        // opcej wysłania email
        var mailOptions = {
            from: 'robert.bogdanik13@gmail.com',
            to: req.body.email,
            subject: 'Witamy w systemie Fernn',
            html: html,
            attachments: [{
                filename: 'image.png',
                path: './public/img/logo.png',
                cid: 'logo' 
            }]
        }
    
        // wysłanie email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                res.redirect('/start?Error=true')
            } else {
                res.redirect('/start?Success=true')
            }
        })
    }

    if(req.body.plan=="Custom"){
        // wygenerowanie serwisowego email dla planu custom
        var html = '\
        <table>\
            <tr>\
                <td>plan</td>\
                <td>'+req.body.plan+'</td>\
            </tr>\
            <tr>\
                <td>ilereklamacji</td>\
                <td>'+req.body.ilereklamacji+'</td>\
            </tr>\
            <tr>\
                <td>ilekont</td>\
                <td>'+req.body.ilekont+'</td>\
            </tr>\
            <tr>\
                <td>ilezalacznikow</td>\
                <td>'+req.body.ilezalacznikow+'</td>\
            </tr>\
            <tr>\
                <td>powiadomienia</td>\
                <td>'+req.body.powiadomienia+'</td>\
            </tr>\
            <tr>\
                <td>raporty</td>\
                <td>'+req.body.raporty+'</td>\
            </tr>\
            <tr>\
                <td>dodatkowo</td>\
                <td>'+req.body.dodatkowo+'</td>\
            </tr>\
            <tr>\
                <td>email</td>\
                <td>'+req.body.email+'</td>\
            </tr>\
            <tr>\
                <td>nip</td>\
                <td>'+req.body.nip+'</td>\
            </tr>\
            <tr>\
                <td>telefon</td>\
                <td>'+req.body.telefon+'</td>\
            </tr>\
        </table>'

        // opcje wysłania serwisowego
        var mailOptions = {
            from: 'robert.bogdanik13@gmail.com',
            to: "robert.bogdanik@interia.pl",
            subject: 'Nowa firma',
            html: html
        }
    
        // wysłanie serwisowego email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                res.redirect('/start?Error=true')
            } else {
                res.redirect('/start?SuccessSend=true')
            }
        })
    }

    // plany Basic Standard Pro
    if(req.body.plan=="Basic" || req.body.plan=="Standard" || req.body.plan=="Pro"){
        // wygenerowanie serwisowego emial
        var html = '\
        <table>\
            <tr>\
                <td>plan</td>\
                <td>'+req.body.plan+'</td>\
            </tr>\
            <tr>\
                <td>email</td>\
                <td>'+req.body.email+'</td>\
            </tr>\
            <tr>\
                <td>nip</td>\
                <td>'+req.body.nip+'</td>\
            </tr>\
            <tr>\
                <td>telefon</td>\
                <td>'+req.body.telefon+'</td>\
            </tr>\
        </table>'

        // opcje wysłania serwisowego
        var mailOptions = {
            from: 'robert.bogdanik13@gmail.com',
            to: "robert.bogdanik@interia.pl",
            subject: 'Nowa firma',
            html: html
        }
    
        // wysłanie serwisowego email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                res.redirect('/start?Error=true')
            } else {
                res.redirect('/start?SuccessSend=true')
            }
        })
    }
}

// podglądanie statusu
const Status = (req, res, sess) => {
    // walidacja url
    let params = new URLSearchParams(url.parse(req.url, true).query)

    var Work = false
    if(params.get('Work')=="true"){ Work=true; }

    var NoFound = false
    var Find = false
    var Ready = false
    var Deleted = false

    // jeśli są dane
    var status, adres, model, producent, pin, kod
    if((params.get('code')!=null && params.get('pin')!=null && params.get('code')!="" && params.get('pin')!="") || (params.get('fnr')!=null && params.get('fnr')!="")){
        // pobranie danych
        if(params.get('fnr')!=null && params.get('fnr')!=""){
            kod = params.get('fnr').substring(0,10)
            pin = params.get('fnr').substring(10,14)
            var sql = 'SELECT s.Status, s.Locking, co.Phone, co.Adress FROM `complaints` AS c JOIN `status` AS s ON c.`Status`=s._ID JOIN `company` AS co ON c.Company = co._ID WHERE c.`Code`="'+kod+'" AND c.`Pin`="'+pin+'"'
            var wyn = con.query(sql)
        }else{
            kod = params.get('code')
            pin = params.get('pin')
            var sql = 'SELECT s.Status, s.Locking, co.Phone, co.Adress FROM `complaints` AS c JOIN `status` AS s ON c.`Status`=s._ID JOIN `company` AS co ON c.Company = co._ID WHERE c.`Code`="'+kod+'" AND c.`Pin`="'+pin+'"'
            var wyn = con.query(sql)
        }

        if(wyn.length==1)
        {
            // czy zakończona
            if(wyn[0].Locking=="2"){ Ready=true; }else{ Find=true; }

            // zapisanie danych
            status = wyn[0].Status
            adres = encode.decode(wyn[0].Adress, 'base64')

            // pobranie modelu i producenta
            if(params.get('fnr')!=null && params.get('fnr')!=""){
                sql='SELECT m.Model, ma.Manufacturer FROM `complaints` AS c JOIN `models` AS m ON c.Model = m._ID JOIN `manufacturers` AS ma ON m.Manufacturer=ma._ID WHERE c.`Code`="'+kod+'" AND c.`Pin`="'+pin+'"'
            }else{
                sql='SELECT m.Model, ma.Manufacturer FROM `complaints` AS c JOIN `models` AS m ON c.Model = m._ID JOIN `manufacturers` AS ma ON m.Manufacturer=ma._ID WHERE c.`Code`="'+kod+'" AND c.`Pin`="'+pin+'"'
            }
            wyn = con.query(sql)
            if(wyn.length==1){ model=wyn[0].Model; producent=wyn[0].Manufacturer; }else{ model="Brak danych"; producent="Brak danych"; }
        }else{
             // jeśli niema sprawdź czy jest w usuniętych
             sql='SELECT co.Adress FROM `delates` AS d JOIN `company` AS co ON d.Company = co._ID WHERE d.`Code`="'+kod+'" AND d.`Pin`="'+pin+'"'
             wyn = con.query(sql)
 
             if(wyn.length!=1){
                //  nieznaleziono
                 NoFound=true
             }else{
                //  jest w usuniętych
                 // zapisanie danych
                 Deleted = true
                 status = "Brak danych"
                 adres = encode.decode(wyn[0].Adress, 'base64')
 
                 // pobranie modelu i producenta
                 sql = 'SELECT m.Model, ma.Manufacturer FROM `delates` AS d JOIN `models` AS m ON d.Model = m._ID JOIN `manufacturers` AS ma ON m.Manufacturer = ma._ID WHERE d.`Code`="'+kod+'" AND d.`Pin`="'+pin+'"'
                 wyn = con.query(sql)

                 console.log(wyn)
                 if(wyn.length==1){ model=wyn[0].Model; producent=wyn[0].Manufacturer; }else{ model="Brak danych"; producent="Brak danych";  }
             }
        }
    }

    // wygenerowanie widoku
    res.render('public/status', {
        "NoFound": NoFound,
        "Find": Find,
        "Ready": Ready,
        "Deleted": Deleted,

        "Status": status,
        "Adres": adres,
        "Model": model,
        "Producent": producent,

        "Code": kod,
        "Pin": pin,
        "Work": Work
    })
}

const Regulations = (req, res,sess) => {
    res.render('public/regulations')
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = { 
    Home,
    GiveData,
    SendEmail,
    SelectCompany,
    UpdateData,
    SaveData,
    StartCompany,
    InsertCompany,
    Status,
    Regulations
}