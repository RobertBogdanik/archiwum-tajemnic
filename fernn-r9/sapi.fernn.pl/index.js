var MySql = require('sync-mysql');
const express = require('express');
// const multer = require("multer")
const path = require('path');
var cors = require('cors');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const { config } = require('process');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(cors());

var con = new MySql({
    host: "localhost",
    user: "root",
    password: "",
    database: "testfernn"
    // host: "5.39.95.160",
    // user: "master",
    // password: "Brtk123.",
    // database: "testfernn"
});
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function GetOneData(sql){
    const result = con.query(sql)
    if( result.length==0 ){ return false }else{ return result[0] }
}
function GetData(sql){
    return con.query(sql)
}

app.get('/v1/1/login', (req, res) => {
    if(req.query.API!=undefined && req.query.Login!=undefined && req.query.Password !=undefined){
        let sql = 'SELECT a.`_ID`, a.Firstname, a.Lastname FROM `accounts` AS a, `api` WHERE `Login`="'+req.query.Login+'" AND `Password`="'+req.query.Password+'" AND `Permissions`=2 AND api.Key="'+req.query.API+'"'
        res.send(GetOneData(sql))
    }else{ res.send("e") }
})

// operacje
app.get('/v1/1/operacje/1', (req, res) => {
    if(req.query.API!=undefined){
        let sql = 'SELECT "" AS Message, operations.* FROM `operations` WHERE `Status` = 1 AND `Type`=1'
        res.send(GetData(sql))
    }else{ res.send("e") }
})
app.get('/v1/1/operacje/2', (req, res) => {
    if(req.query.API!=undefined){
        let sql = 'SELECT "" AS Message, o.*, c.Name FROM `operations` AS o JOIN `company` AS c ON o.CID=c._ID WHERE o.`Status` = 1 AND o.`Type`=3;'
        res.send(GetData(sql))
    }else{ res.send("e") }
})
app.get('/v1/1/operacje/3', (req, res) => {
    if(req.query.API!=undefined){
        let sql = 'SELECT "" AS Message, o.*, c.Name, s.Start, s.End FROM `operations` AS o JOIN `company` AS c ON o.CID=c._ID JOIN subscription AS s ON o.Data1=s._ID WHERE o.`Status` = 1 AND o.`Type`=4;'
        const result = GetData(sql)
        for (let a = 0; a<result.length; a++) {
            result[a].Start = result[a].Start.slice(0, 4) + "-" + result[a].Start.slice(5, 7) + "-" + result[a].Start.slice(8, 10)
            result[a].End = result[a].End.slice(0, 4) + "-" + result[a].End.slice(5, 7) + "-" + result[a].End.slice(8, 10)
        }
        res.send(result)
        // res.send(GetData(sql))
    }else{ res.send("e") }
})
app.get('/v1/1/operacje/4', (req, res) => {
    console.log("ok-4");
    if(req.query.API!=undefined){
        let sql = 'SELECT "" AS Message, o.*, c.Name FROM `operations` AS o JOIN `company` AS c ON o.CID=c._ID WHERE o.`Status` = 1 AND o.`Type`=2;'
        console.log(GetData(sql));
        res.send(GetData(sql))
    }else{ res.send("e") }
})
app.get('/v1/1/operacje/5', (req, res) => {
    if(req.query.API!=undefined){
        let sql = 'SELECT "" AS Message, o._ID, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, c.Adress, a.Firstname, a.Lastname, s.Plan, s.Account, s.Report, s.Attachment, s.Notifications, s.Complaints FROM `operations` AS o JOIN `company` AS c ON o.`Data1`=c._ID JOIN `accounts` AS a ON o.Data2=a._ID JOIN `subscription` AS s ON o.Data4=s._ID WHERE o.`Status` = 1 AND o.`Type`=5;'
        res.send(GetData(sql))
    }else{ res.send("e") }
})

// wiadomości
app.get('/v1/1/send', (req, res) => {
    for (let to of req.query.to) {
        to = JSON.parse(to)
        if(req.query.type[0]=="true"){
            if(req.query.type[1]=="true"){
                // 3
                let sql ='INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES (1, '+req.query.priority+', "'+to._ID+'", +"'+req.query.title+'", "'+req.query.content+'", current_timestamp(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 14 DAY), 0);'
                GetOneData(sql)

                let trescemail = '<div style="text-align: center;">\
                    <img src="./public/img/logo.png" width="30%" style="min-width: 200px; max-width: 400px; text-align: center;">\
                    <h1 style="color:#0d6efd;font-size:50px;">'+req.query.title+'</h1>\
                    <h5 style="color:#212121;font-size:25px;margin-top:20px;">'+req.query.content+'</h5>\
                    <p style="color:#212121;font-size:15px;margin-top:20px;">Dziękujemy i pozdrawiamy! <br> Zespół Fernn</p>\
                    <p style="font-size: 10px;">Wiadomość została wygenerowana automatycznie. Prosimy nie odpowiadać.</p>\
                </div>'
                sql = 'INSERT INTO `messages` (`Type`, `Send_To`, `Title`, `Content`, `Send_date`, `Status`) VALUES (2, "'+top.Email+'", "'+req.query.title+'", \''+trescemail+'\', current_timestamp(), 0)'
                GetOneData(sql)
            }else{
                // 1
                let sql ='INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES (1, '+req.query.priority+', "'+to._ID+'", +"'+req.query.title+'", "'+req.query.content+'", current_timestamp(), DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 14 DAY), 0);'
                GetOneData(sql)
                let trescemail = '<div style="text-align: center;">\
                    <img src="./public/img/logo.png" width="30%" style="min-width: 200px; max-width: 400px; text-align: center;">\
                    <h1 style="color:#0d6efd;font-size:50px;">Nowia wiadomość</h1>\
                    <h5 style="color:#212121;font-size:25px;margin-top:20px;">Temat: '+req.query.title+'<br><br>Aby przeczytać wiadomość zaloguj się do systemu.</h5>\
                    <p style="color:#212121;font-size:15px;margin-top:20px;">Dziękujemy i pozdrawiamy! <br> Zespół Fernn</p>\
                    <p style="font-size: 10px;">Wiadomość została wygenerowana automatycznie. Prosimy nie odpowiadać.</p>\
                </div>'
                sql = 'INSERT INTO `messages` (`Type`, `Send_To`, `Title`, `Content`, `Send_date`, `Status`) VALUES (2, "'+to.Email+'", "'+req.query.title+'", \''+trescemail+'\', current_timestamp(), 0)'
                GetOneData(sql)
            }
        }else{
            if(req.query.type[1]=="true"){
                // 2
                let trescemail = '<div style="text-align: center;">\
                    <img src="./public/img/logo.png" width="30%" style="min-width: 200px; max-width: 400px; text-align: center;">\
                    <h1 style="color:#0d6efd;font-size:50px;">'+req.query.title+'</h1>\
                    <h5 style="color:#212121;font-size:25px;margin-top:20px;">'+req.query.content+'</h5>\
                    <p style="color:#212121;font-size:15px;margin-top:20px;">Dziękujemy i pozdrawiamy! <br> Zespół Fernn</p>\
                    <p style="font-size: 10px;">Wiadomość została wygenerowana automatycznie. Prosimy nie odpowiadać.</p>\
                </div>'
                let sql = 'INSERT INTO `messages` (`Type`, `Send_To`, `Title`, `Content`, `Send_date`, `Status`) VALUES (2, "'+top.Email+'", "'+req.query.title+'", \''+trescemail+'\', current_timestamp(), 0)'
                GetOneData(sql)
            }
        }
        if(req.query.type[2]=="true"){
            // 4-7
            let sql = 'INSERT INTO `messages` (`Type`, `Send_To`, `Title`, `Content`, `Send_date`, `Status`) VALUES (3, "'+to.Phone+'", "'+req.query.title+'", "'+req.query.content+'", current_timestamp(), 0)'
            GetOneData(sql)
        }
    }

    res.send("ok")
})
// wiadomosc przy zglaszaniu firmy
app.get('/v1/1/send/1', (req, res) => {
    req.query.Info = JSON.parse(req.query.Info)
    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+req.query.Info.Data11+'", "System Fernn - Zgłoszenie do systemu", "'+req.query.Info.Message+'", current_timestamp(), NULL, "0");'
    GetOneData(sql)
    res.send("ok")
})
// wiadomosc przy przełurzaniu licencji
app.get('/v1/1/send/2', (req, res) => {
    req.query.Info = JSON.parse(req.query.Info)
    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.Info.CID+'", "System Fernn - Przedłurzanie licencji", "'+req.query.Info.Message+'", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'SELECT `Email` FROM `company` WHERE `_ID`="'+req.query.Info.CID+'"'
    const Email = GetOneData(sql).Email
    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+Email+'", "System Fernn - Przedłurzanie licencji", "'+req.query.Info.Message+'", current_timestamp(), NULL, "0");'
    GetOneData(sql)
    res.send("ok")
})
// wiadomosc przy dadawaniu reklamacji
app.get('/v1/1/send/3', (req, res) => {
    req.query.Info = JSON.parse(req.query.Info)
    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.Info.CID+'", "System Fernn - Dodatkowe reklamacje", "'+req.query.Info.Message+'", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'SELECT `Email` FROM `company` WHERE `_ID`="'+req.query.Info.CID+'"'
    const Email = GetOneData(sql).Email
    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+Email+'", "System Fernn - Dodatkowe reklamacje", "'+req.query.Info.Message+'", current_timestamp(), NULL, "0");'
    GetOneData(sql)
    res.send("ok")
})
// wiadomosc przy zmianie planu
app.get('/v1/1/send/4', (req, res) => {
    req.query.Info = JSON.parse(req.query.Info)
    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.Info.CID+'", "System Fernn - Zmiana planu", "'+req.query.Info.Message+'", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'SELECT `Email` FROM `company` WHERE `_ID`="'+req.query.Info.CID+'"'
    const Email = GetOneData(sql).Email
    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+Email+'", "System Fernn - Zmiana planu", "'+req.query.Info.Message+'", current_timestamp(), NULL, "0");'
    GetOneData(sql)
    res.send("ok")
})
// wiadomosc przy firma auto
app.get('/v1/1/send/5', (req, res) => {
    req.query.Info = JSON.parse(req.query.Info)
    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.Info.CID+'", "System Fernn - Zgłoszenie do systemu", "'+req.query.Info.Message+'", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'SELECT `Email` FROM `company` WHERE `_ID`="'+req.query.Info.CID+'"'
    const Email = GetOneData(sql).Email
    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+Email+'", "System Fernn - Zgłoszenie do systemu", "'+req.query.Info.Message+'", current_timestamp(), NULL, "0");'
    GetOneData(sql)
    res.send("ok")
})


// akceptacja
app.get('/v1/1/zatwierdzenia/1', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'INSERT INTO `company` (`Name`, `NIP`, `Email`, `Phone`, `Adress`) VALUES ("'+req.query.Data8+'", "'+req.query.Data12+'", "'+req.query.Data11+'", "'+req.query.Data13+'", "'+req.query.Data14+'")'
    console.log(sql)
    GetOneData(sql)

    sql = 'SELECT _ID FROM `company` WHERE `NIP`="'+req.query.Data12+'"'
    console.log(sql)
    const CID = GetOneData(sql)._ID

    const znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let login = ""
    for(let d=0; d<6; d++){ login+=znaki[getRandomInt(0,33)] }
    let haslo = ""
    for(let d=0; d<10; d++){ haslo+=znaki[getRandomInt(0,33)] }

    sql = `INSERT INTO \`accounts\` (\`Login\`, \`Email\`, \`Password\`, \`Firstname\`, \`Lastname\`, \`Permissions\`, \`Company\`) VALUES ("${login}", "${req.query.Data11}", "${haslo}", "${req.query.Data9}", "${req.query.Data10}", "1", "${CID}");`
    console.log(sql)
    GetOneData(sql)

    sql = 'SELECT _ID FROM `accounts` WHERE `Login`="'+login+'" AND `Password`="'+haslo+'" AND `Company`="'+CID+'"'
    console.log(sql)
    const PID = GetOneData(sql)._ID

    sql = 'INSERT INTO `sections` (`Name`, `Company`) VALUES ("Main", "'+CID+'");'
    console.log(sql)
    GetData(sql)

    sql = 'SELECT _ID FROM `sections` WHERE `Company`="'+CID+'"'
    console.log(sql)
    const SID = GetOneData(sql)._ID

    sql = `INSERT INTO \`subscription\` (\`Company\`, \`Start\`, \`End\`, \`Plan\`, \`Account\`, \`Report\`, \`Attachment\`, \`Notifications\`, \`Complaints\`) VALUES (${CID}, CURRENT_DATE(), date_add(CURRENT_DATE(),interval 365 day), "${req.query.Data1}", "${req.query.Data3}", "${req.query.Data6}", "${req.query.Data4}", "${req.query.Data5}", "${req.query.Data2}" )`
    console.log(sql)
    GetData(sql)

    sql = 'SELECT _ID FROM `subscription` WHERE `Company`="'+CID+'"'
    console.log(sql)
    const SUB = GetOneData(sql)._ID

    sql = 'INSERT INTO `departments` (`Section`, `Account`, `Company`) VALUES ("'+SID+'", "'+PID+'", "'+CID+'")'
    console.log(sql)
    GetData(sql)

    sql = 'UPDATE `operations` SET `Status` = "2" WHERE `operations`.`_ID` = "'+req.query._ID+'"'
    GetOneData(sql)
    res.send("ok")
})
app.get('/v1/1/zatwierdzenia/2', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'SELECT `End` FROM `subscription` WHERE `Company`="'+req.query.CID+'" ORDER BY `_ID` ASC'
    const End = GetOneData(sql).End

    sql = 'INSERT INTO `subscription` (`Company`, `Start`, `End`, `Plan`, `Account`, `Report`, `Attachment`, `Notifications`, `Complaints`, `Loock`) VALUES ('+req.query.CID+', date_add("'+End.slice(0, 10)+'",interval 1 day), date_add(CURRENT_DATE(),interval '+parseInt(365*parseInt(req.query.Data7.split(" ")[0]))+' day), "'+req.query.Data1+'", "'+req.query.Data2+'", "'+req.query.Data5+'", "'+req.query.Data3+'", "'+req.query.Data4+'", "'+req.query.Data8+'", "0");'
    GetOneData(sql)
    
    sql = 'UPDATE `operations` SET `Status` = "2" WHERE `operations`.`_ID` = "'+req.query._ID+'"'
    GetOneData(sql)
    res.send("e")
})
app.get('/v1/1/zatwierdzenia/3', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)
    
    let sql = 'SELECT `_ID`, `Complaints` FROM `subscription` WHERE `Start`=date_add("'+req.query.Start.slice(0, 10)+'",interval 1 day) AND `End`=date_add("'+req.query.End.slice(0, 10)+'",interval 1 day) AND `Company`="'+req.query.CID+'"'
    const sid = GetOneData(sql)._ID
    const act = GetOneData(sql).Complaints
    
    sql = 'UPDATE `subscription` SET `Complaints` = "'+(parseInt(act)+parseInt(req.query.Data2))+'" WHERE `_ID` = "'+sid+'";'
    GetOneData(sql)

    sql = 'UPDATE `operations` SET `Status` = "2" WHERE `operations`.`_ID` = "'+req.query._ID+'"'
    GetOneData(sql)
    res.send("ok")
})
app.get('/v1/1/zatwierdzenia/4', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'SELECT _ID FROM `subscription` WHERE `Start`<CURRENT_TIMESTAMP() AND `End`>CURRENT_TIMESTAMP() AND `Company`="'+req.query.CID+'"'
    const PlID = GetOneData(sql)._ID

    sql = 'UPDATE `subscription` SET `Plan` = "'+req.query.Data1+'", `Account` = "'+req.query.Data2+'", `Report` = "'+req.query.Data5+'", `Attachment` = "'+'", `Notifications` = "'+req.query.Data4+'", `Complaints` = "'+req.query.Data3+'" WHERE `subscription`.`_ID` = "'+PlID+'"'
    GetOneData(sql)

    sql = 'UPDATE `operations` SET `Status` = "2" WHERE `operations`.`_ID` = "'+req.query._ID+'"'
    GetOneData(sql)
    res.send("e")
})
app.get('/v1/1/zatwierdzenia/5', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql= 'UPDATE `company` SET `Name` = "'+req.query.Name+'", `NIP` = "'+req.query.NIP+'", `Email` = "'+req.query.Email+'", `Phone` = "'+req.query.Phone+'", `Adress` = "'+req.query.Adress+'" WHERE `company`.`_ID` = "'+req.query.CID+'";'
    GetOneData(sql)

    sql = 'SELECT _ID FROM `accounts` WHERE `Company`="'+req.query.CID+'" ORDER BY `_ID` ASC LIMIT 1'
    const PID = GetOneData(sql)._ID
    sql = 'UPDATE `accounts` SET `Firstname` = "'+req.query.Firstname+'", `Lastname` = "'+req.query.Lastname+'" WHERE `_ID` = "'+PID+'"'
    GetOneData(sql)

    sql = 'SELECT _ID FROM `subscription` WHERE `Company`="'+req.query.CID+'"'
    const PlID = GetOneData(sql)._ID
    sql = 'UPDATE `subscription` SET `Plan` = "'+req.query.Plan+'", `Account` = "'+req.query.Account+'", `Report` = "'+req.query.Report+'", `Attachment` = "'+req.query.Attachment+'", `Notifications` = "'+req.query.Notification+'", `Complaints` = "'+req.query.Complaints+'" WHERE `subscription`.`_ID` = "'+PlID+'"'
    GetOneData(sql)

    sql = 'UPDATE `operations` SET `Status` = "2" WHERE `operations`.`_ID` = "'+req.query._ID+'"'
    GetOneData(sql)
    res.send("ok")
})

// odmowa
app.get('/v1/1/odmowa/1', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)
    if(req.query.Data11.includes("@") && req.query.Data11.includes(".")){
        sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+req.query.Data11+'", "System Fernn - Zgłoszenie do systemu", "Wniosek zostal odrzucony", current_timestamp(), NULL, "0");'
        GetOneData(sql)
    }

    res.send("ok")
})
app.get('/v1/1/odmowa/2', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.CID+'", "System Fernn - Przedłurzanie licencji", "Wniosek zostal odrzucony", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+req.query.Data11+'", "System Fernn - Przedłurzanie licencji", "Wniosek zostal odrzucony", current_timestamp(), NULL, "0");'
    GetOneData(sql)

    res.send("ok")
})
app.get('/v1/1/odmowa/3', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.CID+'", "System Fernn - Dodatkowe reklamacje", "Wniosek zostal odrzucony", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+req.query.Data11+'", "System Fernn - Dodatkowe reklamacje", "Wniosek zostal odrzucony", current_timestamp(), NULL, "0");'
    GetOneData(sql)

    res.send("ok")
})
app.get('/v1/1/odmowa/4', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "2", "'+req.query.CID+'", "System Fernn - Zmiana planu", "Wniosek zostal odrzucony", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+req.query.Data11+'", "System Fernn - Zmiana planu", "Wniosek zostal odrzucony", current_timestamp(), NULL, "0");'
    GetOneData(sql)

    res.send("ok")
})
app.get('/v1/1/odmowa/5', (req, res) => {
    req.query = JSON.parse(req.query.Info)
    console.log(req.query)

    let sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("1", "4", "'+req.query.CID+'", "System Fernn - Firma została zablokowana", "Wniosek zostal odrzucony", current_timestamp(), NULL, "1");'
    GetOneData(sql)

    sql = 'INSERT INTO `messages` (`Type`, `Sub_Type`, `Send_To`, `Title`, `Content`, `Send_date`, `End_date`, `Status`) VALUES ("2", NULL, "'+req.query.Data11+'", "System Fernn - Firma została zablokowana", "Wniosek zostal odrzucony", current_timestamp(), NULL, "0");'
    GetOneData(sql)

    sql = 'UPDATE `subscription` SET `Loock` = "1" WHERE `subscription`.`_ID` = "'+req.query.CID+'"'
    GetOneData(sql)
    res.send("ok")
})


app.get('/v1/1/listafirm', (req, res) => {
    let sql = 'SELECT * FROM `company`'
    res.send(GetData(sql))
})
app.get('/v1/1/todo', (req, res) => {
    let sql = 'SELECT COUNT(*), 1 FROM `operations` WHERE `Status`=1 AND `Type`=1 UNION SELECT COUNT(*), 2 FROM `operations` WHERE `Status`=1 AND `Type`=2 UNION SELECT COUNT(*), 3 FROM `operations` WHERE `Status`=1 AND `Type`=3 UNION SELECT COUNT(*), 4 FROM `operations` WHERE `Status`=1 AND `Type`=4 UNION SELECT COUNT(*), 5 FROM `operations` WHERE `Status`=1 AND `Type`=5;'
    const resu = GetData(sql)

    let retu = {
        1: resu[0]["COUNT(*)"],
        2: resu[1]["COUNT(*)"],
        3: resu[2]["COUNT(*)"],
        4: resu[3]["COUNT(*)"],
        5: resu[4]["COUNT(*)"]
    }
    res.send(retu)
})

app.get('/v1/1/companylicencja', (req, res) => {
    let sql = 'SELECT * FROM `subscription` WHERE `Start`<=CURRENT_TIMESTAMP() AND `End`>CURRENT_TIMESTAMP() AND `Company`="'+req.query._ID+'" '
    res.send(GetOneData(sql))
})
app.get('/v1/1/companywszystkielicencje', (req, res) => {
    let sql = 'SELECT * FROM `subscription` WHERE `Company`="'+req.query._ID+'" '
    let result = GetData(sql)

    for (let a = 0; a<result.length; a++) {
        result[a].Start = result[a].Start.slice(0, 10)
        result[a].End = result[a].End.slice(0, 10)
    }
    res.send(result)
})
app.get('/v1/1/danefirmy', (req, res) => {
    let sql = 'SELECT * FROM `company` WHERE _ID = "'+req.query._ID+'"'
    res.send(GetOneData(sql))
})
app.get('/v1/1/kontafirmy', (req, res) => {
    let sql = 'SELECT * FROM `accounts` WHERE Company="'+req.query.CID+'"'
    res.send(GetData(sql))
})
app.get('/v1/1/reklamacjefirmy', (req, res) => {
    let sql = 'SELECT c.*, m.Model AS "mModel", m.SKU AS "mSKU", m._ID AS "m_ID", ma._ID AS "ma_ID", ma.Manufacturer AS "maManufacter" FROM `complaints` AS c LEFT JOIN `models` AS m ON c.Model=m._ID LEFT JOIN `manufacturers` AS ma ON m.Manufacturer=ma._ID WHERE Company="'+req.query.CID+'" AND `Added_date`<="'+req.query.Since+'" AND `Added_date`>"'+req.query.To+'"'
    console.log(sql);
    res.send(GetData(sql))
})
app.get('/v1/1/sekcjefirmy', (req, res) => {
    let sql = 'SELECT * FROM `sections` WHERE `Company`="'+req.query.CID+'"'
    let result = GetData(sql)

    sql = 'SELECT * FROM `accounts` WHERE Company = "'+req.query.CID+'"'
    let allAccounts = GetData(sql)
    
    sql = 'SELECT d.Section AS DSID, a.* FROM `departments` AS d JOIN `accounts` AS a ON d.Account=a._ID WHERE d.`Company`="'+req.query.CID+'"'
    let departments = GetData(sql)
    
    for (let sekcja of result) {
        sekcja.input=""
        sekcja.include = []
        for (const department of departments) {
            if(department.DSID == sekcja._ID){ sekcja.include.push(department) }
        }

        sekcja.notInclude = []
        for (let account of allAccounts) {
            let is = false
            for(let include of sekcja.include){
                if(include._ID == account._ID){ is = true }
            }

            if(!is){ sekcja.notInclude.push(account) }
        }
    }
    res.send(result)
})
app.get('/v1/1/savelicencja', (req, res) => {
    let licencja = JSON.parse(JSON.parse(req.query.licencja))

    let sql = 'UPDATE `subscription` SET `Start` = "'+licencja.Start+'", `End` = "'+licencja.End+'", `Plan` = "'+licencja.Plan+'", `Account` = "'+licencja.Account+'", `Report` = "'+licencja.Report+'", `Attachment` = "'+licencja.Attachment+'", `Notifications` = "'+licencja.Notification+'", `Complaints` = "'+licencja.Complaints+'", `Loock` = "'+licencja.Loock+'" WHERE `subscription`.`_ID` = "'+licencja._ID+'";'
    GetData(sql)
    res.send("ok")
})
app.get('/v1/1/savedane', (req, res) => {
    let dane = JSON.parse(req.query.danefirmy)

    let sql = 'UPDATE `company` SET `Name` = "'+dane.Name+'", `NIP` = "'+dane.NIP+'", `Email` = "'+dane.Email+'", `Phone` = "'+dane.Phone+'", `Adress` = "'+dane.Adress+'", `Logo` = "'+dane.Logo+'", `Section` = "'+(dane.Section==0 ? dane.Section : "")+'" WHERE `company`.`_ID` = "'+dane._ID+'"'
    GetData(sql)
    res.send("ok")
})
app.get('/v1/1/savekonta', (req, res) => {
    let konto = JSON.parse(req.query.konto)
    console.log(konto);

    let sql = 'UPDATE `accounts` SET `Login` = "'+konto.Login+'", `Email` = "'+konto.Email+'", `Password` = "'+konto.Password+'", `Firstname` = "'+konto.Firstname+'", `Lastname` = "'+konto.Lastname+'", `Permissions` = "'+konto.Permissions+'", `Thumbnail` = "'+konto.Thumbnail+'", `Section` = "'+konto.Section+'" WHERE `accounts`.`_ID` = "'+konto._ID+'"'
    GetData(sql)
    res.send("ok")
})
app.get('/v1/1/delatekonta', (req, res) =>{
    let konto = JSON.parse(req.query.konto)

    let sql = '"DELETE FROM `accounts` WHERE `accounts`.`_ID` = "'+konto._ID+'""'
    GetData(sql)
    res.send("ok")
})
app.get('/v1/1/updatereklamacja', (req, res) => {
    let reklamacja = JSON.parse(req.query.reklamacja)
    
    let sql = ''
    res.send("ok")
})
app.get('/v1/1/delatereklamacja', (req, res) => {
    let reklamacja = JSON.parse(req.query.reklamacja)
    
    let sql = 'DELETE FROM `complaints` WHERE `complaints`.`_ID` = "'+reklamacja._ID+'"'
    GetData(sql)
    res.send("ok")
})
app.get('/v1/1/savesectionname', (req, res) => {
    res.send("ok")
})
app.get('/v1/1/changesectionaccount', (req, res) => {
    res.send("ok")
})
app.get('/v1/1/delatesection', (req, res) => {
    res.send("ok")
})
app.listen(8081)