const encode = require('nodejs-base64-encode')
var MySql = require('sync-mysql')
var url = require('url')
var nodemailer = require('nodemailer')

var con = new MySql({
    host: "5.39.95.160",
    user: "master",
    password: "Brtk123.",
    database: "fernn"
});

// konfiguracja poczyt
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    secure: true,
    auth: {
        user: 'robert.bogdanik13@gmail.com',
        pass: 'Brtk123.'
    }
})
const index = (req, res, sess) => {
    var sql='SELECT * FROM `status`  ORDER BY `status`.`Value` ASC'
    var status = con.query(sql)

    sql='SELECT * FROM `manufacturers`'
    var manufacturers = con.query(sql)

    sql='SELECT * FROM `company`'
    var pfirmy = con.query(sql)

    var result
    var firmy=[]
    for(var a=0; a<pfirmy.length;a++)
    {
        result=pfirmy[a]
        firmy[a]=new Object()
        firmy[a]._ID = result._ID
        firmy[a].Name = result.Name
        firmy[a].NIP=encode.decode(result.NIP, 'base64')
        firmy[a].Phone=encode.decode(result.Phone, 'base64')
        firmy[a].Email=encode.decode(result.Email, 'base64')
        firmy[a].Adress = encode.decode(result.Adress, 'base64')
    }

    sql='SELECT * FROM `messages`'
    var message = con.query(sql)
    for(var b=0; b<message.length;b++){ message[b].End_date=message[b].End_date.substr(0,10); }

    res.render('fboss/index', {
        "Company": firmy,
        "Status": status,
        "Manufacturers": manufacturers,
        "Message": message
    })
}

const ListModel = (req, res, sess) => {
    var sql='SELECT mo._ID, mo.Model, mo.State, ma.Manufacturer FROM `models` AS mo JOIN `manufacturers` AS ma ON mo.Manufacturer=ma._ID'
    var model = con.query(sql)
    res.render('fboss/list', {
        "Data": model,
        "model": true,
        "manufacter": false
    })
}

const ListManufacturer = (req, res, sess) => {
    var sql='SELECT * FROM `manufacturers`'
    var manufacturer = con.query(sql)
    res.render('fboss/list', {
        "Data": manufacturer,
        "model": false,
        "manufacter": true
    })
}

const InsertModel = (req, res, sess) => {
    var result
    var p = req.body.producent
    var m = req.body.nazwa

    var sql='SELECT COUNT(*) as ile FROM `manufacturers` WHERE `Manufacturer`="'+p+'"'
    var producent = con.query(sql)
    result=JSON.stringify(producent[0])
    result=JSON.parse(result)
    if(result.ile!=1)
    {
        sql='INSERT INTO `manufacturers` (`Manufacturer`, `State`) VALUES ("'+p+'", "0")'
        con.query(sql)
    }
    sql='SELECT `_ID` FROM `manufacturers` WHERE `Manufacturer`="'+p+'"'
    producent = con.query(sql)
    result=JSON.stringify(producent[0])
    result=JSON.parse(result)
    producent=result._ID

    sql='SELECT COUNT(*) AS ile FROM `models` WHERE `Manufacturer`="'+producent+'" AND `Model`="'+m+'"'
    var model = con.query(sql)
    result=JSON.stringify(model[0])
    result=JSON.parse(result)
    if(result.ile==0)
    {
        sql='INSERT INTO `models` (`_ID`, `Manufacturer`, `Model`, `State`) VALUES (NULL, "'+producent+'", "'+m+'", "0");'
        con.query(sql)
    }

    res.redirect('/f/list/model')
}

const InsertManufacturer = (req, res, sess) => {
    var result
    var p = req.body.producent

    var sql='SELECT COUNT(*) as ile FROM `manufacturers` WHERE `Manufacturer`="'+p+'"'
    var producent = con.query(sql)
    result=JSON.stringify(producent[0])
    result=JSON.parse(result)
    if(result.ile!=1)
    {
        sql='INSERT INTO `manufacturers` (`Manufacturer`, `State`) VALUES ("'+p+'", "0")'
        con.query(sql)
    }
    res.redirect('/f/list/manufacturers')
}

const InsertStatus = (req, res, sess) => {
    var result
    var nazwa = req.body.nazwa
    var wartosc = req.body.wartosc

    var sql='SELECT COUNT(*) AS ile FROM `status` WHERE `Status`="'+nazwa+'"'
    var producent = con.query(sql)
    result=JSON.stringify(producent[0])
    result=JSON.parse(result)
    if(result.ile==0)
    {
        sql='INSERT INTO `status` (`Status`, `Value`) VALUES ("'+nazwa+'", "'+wartosc+'")'
        con.query(sql)
    }
    res.redirect('/f')
}

const InsertCompany = (req, res, sess) => {
    var nazwa = req.body.nazwa
    var nip = encode.encode(req.body.nip, 'base64')
    var tel = encode.encode(req.body.tel, 'base64')
    var email = encode.encode(req.body.email, 'base64')
    var adres = encode.encode(req.body.adres, 'base64')

    var sql='INSERT INTO `company` (`Name`, `NIP`, `Email`, `Phone`, `Adress`) VALUES ("'+nazwa+'", "'+nip+'", "'+email+'", "'+tel+'", "'+adres+'")'
    con.query(sql)

    // pibranie CID
    sql='SELECT `_ID` FROM `company` WHERE `NIP`="'+nip+'" AND `Email`="'+email+'"'
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
    sql='INSERT INTO `accounts` (`Login`, `Email`, `Password`, `Firstname`, `Lastname`, `Permissions`, `Company`) VALUES ("'+encode.encode(login, 'base64')+'", "'+encode.encode(req.body.email, 'base64')+'", "'+encode.encode(haslo, 'base64')+'", "'+encode.encode(req.body.imie, 'base64')+'", "'+encode.encode(req.body.nazwisko, 'base64')+'", "1", "'+firma+'")'
    con.query(sql)

    // dodawanie licencji
    var sql = 'INSERT INTO `subscription` (`Company`, `Start`, `End`, `Plan`, `Account`, `Report`, `Attachment`, `Notifications`, `Complaints`) VALUES ("'+firma+'", "'+req.body.start+'", "'+req.body.koniec+'", "'+req.body.plan+'", "'+req.body.konta+'", "'+req.body.raporty+'", "'+req.body.zalaczniki+'", "'+req.body.powiadomienia+'", "'+req.body.reklamacje+'")'
    con.query(sql)

    // wygenerowanie email z hasłen i loginem
    var html = '\
    <div style=" width: 600px; margin: auto;">\
        <div style="text-align: center;">\
            <img src="cid:logo" style="margin: 0 auto; width="300px;">\
            <h1 style="color: #1a6aba; font-size: 50px; ">Witamy w systemie Fernn</h1><br><br>\
            <p style="color: #212121; font-size: 25px; margin-top: 20px;">Firma '+req.body.nazwa+' została dodana pomyślnie. Poniżej znajdują się dane do logowania.</p>\
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

    res.redirect('/f')
}


// update
const UpdateStatus = (req, res, sess) => {
    var SID = req.body.SID
    var nazwa = req.body.nazwa
    var wartosc =req.body.wartosc

    var sql = 'UPDATE `status` SET `Status` = "'+nazwa+'", `Value` = "'+wartosc+'" WHERE `status`.`_ID` = "'+SID+'"'
    con.query(sql)
    res.redirect('/f')
}

const UpdateModel = (req, res, sess) => {
    var MID = req.body.MID
    var producent = req.body.producent
    var model = req.body.model
    var stan = req.body.stan

    var sql='SELECT COUNT(*) as ile FROM `manufacturers` WHERE `Manufacturer`="'+producent+'"'
    var result = con.query(sql)
    result=JSON.stringify(result[0])
    result=JSON.parse(result)
    if(result.ile!=1)
    {
        sql='INSERT INTO `manufacturers` (`Manufacturer`, `State`) VALUES ("'+producent+'", "0")'
        con.query(sql)
    }
    sql='SELECT `_ID` FROM `manufacturers` WHERE `Manufacturer`="'+producent+'"'
    result = con.query(sql)
    result=JSON.stringify(result[0])
    result=JSON.parse(result)
    producent=result._ID

    sql='UPDATE `models` SET `Manufacturer` = "'+producent+'", `Model` = "'+model+'", `State` = "'+stan+'" WHERE `models`.`_ID` = "'+MID+'"'
    con.query(sql)

    res.redirect('/f/list/model')
}

const UpdateManufacturers = (req, res, sess) => {
    var MID = req.body.MID
    var producent = req.body.producent
    var stan = req.body.stan
    var sql='UPDATE `manufacturers` SET `Manufacturer` = "'+producent+'", `State` = "'+stan+'" WHERE `manufacturers`.`_ID` = "'+MID+'"'
    con.query(sql)
    res.redirect('/f/list/manufacturers')
}


// edit company
const EditCompany =(req, res, sess) => {
    let params = new URLSearchParams(url.parse(req.url, true).query)
    var cid = params.get('CID')

    var sql='SELECT * FROM `company` WHERE `_ID`="'+cid+'"'
    var result = con.query(sql)
    result=result[0]
    var basic=[]
    basic[0]=new Object
    basic[0]._ID = result._ID
    basic[0].Name = result.Name
    basic[0].NIP = encode.decode(result.NIP, 'base64')	
    basic[0].Email = encode.decode(result.Email, 'base64')
    basic[0].Phone = encode.decode(result.Phone, 'base64')
    basic[0].Adress = encode.decode(result.Adress, 'base64')

    sql='SELECT c._ID, c.Firstname, c.Lastname,c.Phone, c.Description, c.Serial_no, c.Purchase_number, c.Type, c.Comments, c.Code, c.`Pin`, c.Complaint_number, c.Purchase_date, c.Damage_date, s.Status, m.Model, ma.Manufacturer FROM `complaints` AS c JOIN `status` AS s ON c.Status=s._ID JOIN `models` AS m on c.Model=m._ID JOIN `manufacturers` as ma on m.Manufacturer=ma._ID WHERE `Company`="'+cid+'"'
    var kreklamacje = con.query(sql)
    var reklamacje=[]
    for(var a=0; a<kreklamacje.length; a++)
    {
        reklamacje[a]=new Object()
        reklamacje[a]._ID=kreklamacje[a]._ID
        reklamacje[a].Firstname=encode.decode(kreklamacje[a].Firstname, 'base64')
        reklamacje[a].Lastname=encode.decode(kreklamacje[a].Lastname, 'base64')
        reklamacje[a].Phone=encode.decode(kreklamacje[a].Phone, 'base64')
        reklamacje[a].Description=kreklamacje[a].Description
        reklamacje[a].Serial_no=kreklamacje[a].Serial_no
        reklamacje[a].Purchase_number=kreklamacje[a].Purchase_number
        reklamacje[a].Type=kreklamacje[a].Type
        reklamacje[a].Comments=kreklamacje[a].Comments
        reklamacje[a].Code=kreklamacje[a].Code
        reklamacje[a].Pin=kreklamacje[a].Pin
        reklamacje[a].Complaint_number=kreklamacje[a].Complaint_number
        reklamacje[a].Purchase_date=kreklamacje[a].Purchase_date
        reklamacje[a].Damage_date=kreklamacje[a].Damage_date
        reklamacje[a].Status=kreklamacje[a].Status
        reklamacje[a].Model=kreklamacje[a].Model
        reklamacje[a].Manufacturer=kreklamacje[a].Manufacturer
        reklamacje[a].CID=cid

        let m = reklamacje[a].Damage_date
        if(m!="" && m!=null){
            m=m.substr(0, 10)
            reklamacje[a].Damage_date=m
        }

        let n = reklamacje[a].Purchase_date
        if(n!="" && n!=null){
            let s=n.substr(0, 10)
            s+=" "
            s+=n.substr(11, 8)
            reklamacje[a].Purchase_date=s
        }
    }

    sql='SELECT * FROM `accounts` WHERE `Company`="'+cid+'"'    
    var kkonta = con.query(sql)
    var konta=[]
    for(var a=0; a<kkonta.length;a++)
    {
        konta[a]=new Object
        konta[a]._ID=kkonta[a]._ID
        konta[a].Login= encode.decode(kkonta[a].Login, 'base64')
        if(kkonta[a].Email!=null){ konta[a].Email= encode.decode(kkonta[a].Email, 'base64') }
        konta[a].Password= encode.decode(kkonta[a].Password, 'base64')
        konta[a].Firstname= encode.decode(kkonta[a].Firstname, 'base64')
        konta[a].Lastname= encode.decode(kkonta[a].Lastname, 'base64')
        konta[a].Permissions=kkonta[a].Permissions
        konta[a].CID=cid
    }
    
    sql='SELECT m.Model, ma.Manufacturer FROM `models` as m JOIN manufacturers as ma ON m.`Manufacturer`=ma._ID'    
    var modele = con.query(sql)
    
    sql='SELECT * FROM `status`'    
    var statusy = con.query(sql)

    sql='SELECT * FROM `subscription` WHERE `Company`="'+cid+'" ORDER BY `End` DESC'
    var okresy = con.query(sql)

    var kokresy = []
    for(var a =0; a<okresy.length; a++)
    {
        kokresy[a]=okresy[a]

        var start = okresy[a].Start
        var End = okresy[a].End
        kokresy[a].Start=start.substr(0, 10)
        kokresy[a].End=End.substr(0, 10)
    }
    res.render('fboss/company', {
        "Podastawowe": basic,
        "Reklamacje": reklamacje,
        "Konta": konta,
        "Modele": modele,
        "Status": statusy,
        "CID": cid,
        "Okresy": okresy
    })
}

const UpdateCompany = (req, res, sess) => {
    var cid = req.body.CID
    var Name = req.body.Name
    var NIP = encode.encode(req.body.NIP, 'base64')
    var Email = encode.encode(req.body.Email, 'base64')
    var Phone = encode.encode(req.body.Phone, 'base64')
    var Adress = encode.encode(req.body.Adress, 'base64')

    var sql='UPDATE `company` SET `Name` = "'+Name+'", `NIP` = "'+NIP+'", `Adress` = "'+Adress+'", `Email` = "'+Email+'", `Phone` = "'+Phone+'" WHERE `company`.`_ID` = "'+cid+'";'
    con.query(sql)
    res.redirect('/f/edit?CID='+cid)
}

const UpdateComplaint = (req, res,sess) => {
    var rid = req.body.RID
    var cid = req.body.CID

    var status = req.body.Status
    var sql='SELECT `_ID` FROM `status` WHERE `Status`="'+status+'"'
    var result = con.query(sql)
    if(result.length!=1)
    {
        console.log("error status")
        res.redirect('/f')
    }
    result=result[0]
    status=result._ID

    var model = req.body.Model
    sql='SELECT `_ID` FROM `models` WHERE `Model`="'+model+'"'
    result = con.query(sql)
    
    if(result.length!=1)
    {
        console.log("error model")
        res.redirect('/f')
    }
    result=result[0]
    model=result._ID

    sql='UPDATE `complaints` SET '
    sql+='`Status` = "'+status+'"'
    sql+=', `Model` = "'+model+'"'

    var Firstname = encode.encode(req.body.Firstname, 'base64')
    if(Firstname!=""){sql+=', `Firstname` = "'+Firstname+'"'}
    
    var Lastname = encode.encode(req.body.Lastname, 'base64')
    if(Lastname!=""){sql+=', `Lastname` = "'+Lastname+'"'}

    var Phone = encode.encode(req.body.Phone, 'base64')
    if(Phone!=""){sql+=', `Phone` = "'+Phone+'"'}
    
    var Description = req.body.Description
    if(Description!=""){sql+=', `Description` = "'+Description+'"'}

    var Serial_no = req.body.Serial_no
    if(Serial_no!=""){sql+=', `Serial_no` = "'+Serial_no+'"'}

    var Purchase_number = req.body.Purchase_number
    if(Purchase_number!=""){sql+=', `Purchase_number` = "'+Purchase_number+'"'}

    var Type = req.body.Type
    sql+=', `Type` = "'+Type+'"'

    var Comments = req.body.Comments
    if(Comments!=""){sql+=', `Comments` = "'+Comments+'"'}

    var Code = req.body.Code
    sql+=', `Code`="'+Code+'"'

    var Pin = req.body.Pin
    sql+=', `Pin`="'+Pin+'"'

    var Complaint_number = req.body.Complaint_number
    if(Complaint_number!=""){sql+=', `Complaint_number` = "'+Complaint_number+'"'}

    var Purchase_date = req.body.Purchase_date
    if(Purchase_date!=""){sql+=', `Purchase_date` = "'+Purchase_date+'"'}

    var Damage_date = req.body.Damage_date
    if(Damage_date!=""){sql+=', `Damage_date` = "'+Damage_date+'"'}

    sql+=' WHERE `complaints`.`_ID` = "'+rid+'"'
    con.query(sql)
    res.redirect('/f/edit?CID='+cid)
}

const InsertComplaint = (req, res,sess) => {
    var CID = req.body.CID

    var status = req.body.Status
    var sql='SELECT `_ID` FROM `status` WHERE `Status`="'+status+'"'

    var result = con.query(sql)
    if(result.length!=1)
    {
        console.log("error status")
        res.redirect('/f')
    }
    result=result[0]
    status=result._ID

    var model = req.body.Model
    sql='SELECT `_ID` FROM `models` WHERE `Model`="'+model+'"'
    result = con.query(sql)
    if(result.length!=1)
    {
        console.log("error model")
        res.redirect('/f')
    }
    result=result[0]
    model=result._ID

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    var dates = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    
    var znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    var Added = sess.PID

    sql="SELECT COUNT(*) AS Complaint_number, RIGHT(LEFT(CURRENT_DATE(),4),2) AS DAT FROM `complaints` WHERE `Company`='"+CID+"' ORDER BY `Complaint_number` DESC"
    var Complaint_number = con.query(sql)
    Complaint_number=JSON.stringify(Complaint_number[0])
    Complaint_number=JSON.parse(Complaint_number)
    var dat = Complaint_number.DAT
    Complaint_number = Complaint_number.Complaint_number+1
    Complaint_number = Complaint_number+"/"+dat

    sql='INSERT INTO `complaints` (`Company`, `Added`, `Added_date`, `Modification`, `Status`, `Model`, `Firstname`, `Lastname`, `Phone`, `Description`, `Serial_no`, `Purchase_number`, `Type`, `Comments`, `Code`, `Pin`, `Complaint_number`, `Purchase_date`, `Damage_date`) VALUES ('
    sql+='"'+CID+'"'
    sql+=', "'+Added+'"'
    sql+=', "'+dates+'"'
    sql+=', current_timestamp()' 
    sql+=', "'+status+'"' 
    sql+=', "'+model+'"' 

    var Firstname = encode.encode(req.body.Firstname, 'base64')
    if(Firstname!=""){
        sql+=', "'+Firstname+'"'
    }else{sql+=', "Ti9E"'}
    
    var Lastname = encode.encode(req.body.Lastname, 'base64')
    if(Lastname!=""){sql+=', "'+Lastname+'"'}else{sql+=', "Ti9E"'}

    var Phone = encode.encode(req.body.Phone, 'base64')
    if(Phone!=""){sql+=', "'+Phone+'"'}else{sql+=', "Ti9E"'}
    
    var Description = req.body.Description
    if(Description!=""){sql+=', "'+Description+'"'}else{sql+=', null'}

    var Serial_no = req.body.Serial_no
    if(Serial_no!=""){sql+=', "'+Serial_no+'"'}else{sql+=', null'}

    var Purchase_number = req.body.Purchase_number
    if(Purchase_number!=""){sql+=', "'+Purchase_number+'"'}else{sql+=', null'}

    var Type = req.body.Type
    sql+=', "'+Type+'"'

    var Comments = req.body.Comments
    if(Comments!=""){sql+=', "'+Comments+'"'}else{sql+=', null'}

    var kod =""
    var pin=""

    for(var d=0; d<10; d++){kod+=znaki[getRandomInt(0,33)]}
    for(var d=0; d<4; d++){pin+=getRandomInt(0,9)}

    sql+=', "'+kod+'"'
    sql+=', "'+pin+'"'
    sql+=', "'+Complaint_number+'"'

    var Purchase_date = req.body.Purchase_date
    if(Purchase_date!=""){sql+=', "'+Purchase_date+'"'}else{sql+=', null'}

    var Damage_date = req.body.Damage_date
    if(Damage_date!=""){sql+=', "'+Damage_date+'"'}else{sql+=', null'}

    sql+=')'

    con.query(sql)
    res.redirect('/f/edit?CID='+CID)
}

const UpdateAccount = (req, res,sess) => {
    var login = encode.encode(req.body.login, 'base64')
    var Email = encode.encode(req.body.email, 'base64')
    var password = encode.encode(req.body.password , 'base64')
    var imie = encode.encode(req.body.imie, 'base64')
    var nazwisko = encode.encode(req.body.nazwisko, 'base64')
    var uprawnienia = req.body.uprawnienia
    var PID = req.body.PID
    var CID = req.body.CID
    
    sql = 'UPDATE `accounts` SET `Login` = "'+login+'", `Email` = "'+Email+'", `Password` = "'+password+'", `Firstname` = "'+imie+'", `Lastname` = "'+nazwisko+'", `Permissions` = "'+uprawnienia+'" WHERE `accounts`.`_ID` = "'+PID+'"'

    con.query(sql)
    res.redirect('/f/edit?CID='+CID)
}

const InsertAccount = (req, res,sess) => {
    var login = encode.encode(req.body.login, 'base64')
    var Email = encode.encode(req.body.email, 'base64')
    var password = encode.encode(req.body.password , 'base64')
    var imie = encode.encode(req.body.imie, 'base64')
    var nazwisko = encode.encode(req.body.nazwisko, 'base64')
    var uprawnienia = req.body.uprawnienia
    var CID = req.body.CID
    
    sql = 'INSERT INTO `accounts` (`Login`, `Email`, `Password`, `Firstname`, `Lastname`, `Permissions`, `Company`) VALUES ("'+login+'"," '+Email+'", "'+password+'", "'+imie+'", "'+nazwisko+'", "'+uprawnienia+'", "'+CID+'");'
    con.query(sql)

    sql='SELECT `Name` FROM `company` WHERE `_ID`="'+CID+'"'
    var wyn = con.query(sql)

    switch(uprawnienia)
    {
        case "0":
            uprawnienia="Pracownik"
            break;
        case "1":
            uprawnienia="Administrator"
            break;
        case "2":
            uprawnienia="Administrator systemu"
            break;
    }

    var html = '\
    <div style=" width: 600px; margin: auto;">\
        <div style="text-align: center;">\
            <img src="cid:logo" style="margin: 0 auto; width="300px;">\
            <h1 style="color: #1a6aba; font-size: 50px; ">Witamy w systemie Fernn</h1><br><br>\
            <p style="color: #212121; font-size: 25px; margin-top: 10px;">Zostałeś dodany jako '+uprawnienia+' do firmy '+wyn[0].Name+'</p>\
            <p style="color: #212121; font-size: 24px;">Dane do logowania:</p>\
            <table border="1" style="margin: auto; font-size: 20px; olor: #212121;">\
                <tr>\
                    <th style="padding: 5px">Login</th>\
                    <td style="padding: 5px">'+req.body.login+'</td>\
                </tr>\
                <tr>\
                    <th style="padding: 5px">Hasło</th>\
                    <td style="padding: 5px">'+req.body.password+'</td>\
                </tr>\
            </table><br><br>\
            <p style=" color: #212121; font-size: 25px; margin-top: 10px;">Możesz zalogwać się teraz wchodząc na stronę www.fernn.pl/login lub klikając w poniższy przecisk.</p>\
            <a href="http://fernn.pl/login"><button style="text-decoration: none; padding: 10px; font-size: 25px; color: #fff; background-color: #0d6efd; border: 2px solid #0d6efd;">Zaloguj się teraz</button></a><br><br>\
            <p style=" color: #212121; font-size: 15px;">Jeśli nie jesteś związany z firmę '+wyn[0].Name+' zignoruj tę wiadomość. Ktoś najprawdopodobniej przypadkiem podał ten adres email.</p>\
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
    res.redirect('/f/edit?CID='+CID)
}

const DelateAccount = (req, res, sess) => {
    let params = new URLSearchParams(url.parse(req.url, true).query)
    var CID = params.get('CID')
    var PID = params.get('PID')

    if(CID=="" || PID=="")
    {
        console.log("error delate")
        res.redirect('/f')
    }

    var sql='DELETE FROM `accounts` WHERE `accounts`.`_ID` = "'+PID+'" AND `accounts`.`Company` = "'+CID+'"'
    con.query(sql)
    res.redirect('/f/edit?CID='+CID)
}

const InsertSubscription = (req, res, sess) => {
    var sql = 'INSERT INTO `subscription` (`Company`, `Start`, `End`, `Plan`, `Account`, `Report`, `Attachment`, `Notifications`, `Complaints`) VALUES ("'+req.body.CID+'", "'+req.body.start+'", "'+req.body.koniec+'", "'+req.body.plan+'", "'+req.body.konta+'", "'+req.body.raporty+'", "'+req.body.zalaczniki+'", "'+req.body.powiadomienia+'", "'+req.body.reklamacje+'")'
    con.query(sql)

    sql= 'SELECT `Email` FROM `company` WHERE `_ID`="'+req.body.CID+'"'
    var email = encode.decode(con.query(sql)[0].Email, 'base64') 
    var html = '\
    <div style=" width: 500px; margin: auto;">\
        <div style="text-align: center;">\
            <img src="cid:logo" style="margin: 0 auto; width="300px;">\
            <h1 style="color: #1a6aba; font-size: 35px;">Dodany został nowy okres rozliczeniowy</h1>\
            <p style="color: #212121; font-size: 25px; margin-top: 20px;">Dane okresu rozliczeniowego:</p>\
            <table border="1" style="margin: auto; font-size: 18px;">\
                <tr><th style="padding: 10px;">Początek licencji</th><td style="padding: 10px;">'+req.body.start+'</td></tr>\
                <tr><th style="padding: 10px;">Konie licencji</th><td style="padding: 10px;">'+req.body.koniec+'</td></tr>\
                <tr><th style="padding: 10px;">Plan</th><td style="padding: 10px;">'+req.body.plan+'</td></tr>\
                <tr><th style="padding: 10px;">Ilość kont</th><td style="padding: 10px;">'+req.body.konta+'</td></tr>\
                <tr><th style="padding: 10px;">Ilość reklamacji</th><td style="padding: 10px;">'+req.body.reklamacje+'</td></tr>\
                <tr><th style="padding: 10px;">Ilość zalaczników na reklamację</th><td style="padding: 10px;">'+req.body.zalaczniki+'</td></tr>'

                if(req.body.powiadomienia==1){  html+='<tr><th style="padding: 10px;">Powiadomienia dla klienta</th><td style="padding: 10px;">Tak</td></tr>'; }
                else{ html+='<tr><th style="padding: 10px;">Powiadomienia dla klienta</th><td style="padding: 10px;">Nie</td></tr>'; }

                if(req.body.raporty==1){  html+='<tr><th style="padding: 10px;">Raporty</th><td style="padding: 10px;">Tak</td></tr>'; }
                else{ html+='<tr><th style="padding: 10px;">Raporty</th><td style="padding: 10px;">Nie</td></tr>'; }
                html+='\
            </table>\
        </div>\
    </div>'
    
    var mailOptions = {
        from: 'robert.bogdanik13@gmail.com',
        to: email,
        subject: 'Dodano nowy plan',
        html: html,
        attachments: [{
            filename: 'image.png',
            path: './public/img/logo.png',
            cid: 'logo' 
        }]
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        }
    })

    res.redirect('/f/edit?CID='+req.body.CID)
}
const UpdateSubscription = (req, res, sess) => {
    var sql = 'UPDATE `subscription` SET `Start` = "'+req.body.start+'", `End` = "'+req.body.koniec+'", `Plan` = "'+req.body.plan+'", `Account` = "'+req.body.konta+'", `Report` = "'+req.body.raporty+'", `Attachment` = "'+req.body.zalaczniki+'", `Notifications` = "'+req.body.powiadomienia+'", `Complaints` = "'+req.body.reklamacje+'" WHERE `subscription`.`_ID` = "'+req.body.OID+'"'
    con.query(sql)

    sql= 'SELECT `Email` FROM `company` WHERE `_ID`="'+req.body.CID+'"'
    var email = encode.decode(con.query(sql)[0].Email, 'base64') 
    var html = '\
    <div style=" width: 500px; margin: auto;">\
        <div style="text-align: center;">\
            <img src="cid:logo" style="margin: 0 auto; width="300px;">\
            <h1 style="color: #1a6aba; font-size: 35px;">Plan został zmieniony</h1>\
            <p style="color: #212121; font-size: 25px; margin-top: 20px;">Nowe dane okresu rozliczeniowego:</p>\
            <table border="1" style="margin: auto; font-size: 18px;">\
                <tr><th style="padding: 10px;">Początek licencji</th><td style="padding: 10px;">'+req.body.start+'</td></tr>\
                <tr><th style="padding: 10px;">Konie licencji</th><td style="padding: 10px;">'+req.body.koniec+'</td></tr>\
                <tr><th style="padding: 10px;">Plan</th><td style="padding: 10px;">'+req.body.plan+'</td></tr>\
                <tr><th style="padding: 10px;">Ilość kont</th><td style="padding: 10px;">'+req.body.konta+'</td></tr>\
                <tr><th style="padding: 10px;">Ilość reklamacji</th><td style="padding: 10px;">'+req.body.reklamacje+'</td></tr>\
                <tr><th style="padding: 10px;">Ilość zalaczników na reklamację</th><td style="padding: 10px;">'+req.body.zalaczniki+'</td></tr>'

                if(req.body.powiadomienia==1){  html+='<tr><th style="padding: 10px;">Powiadomienia dla klienta</th><td style="padding: 10px;">Tak</td></tr>'; }
                else{ html+='<tr><th style="padding: 10px;">Powiadomienia dla klienta</th><td style="padding: 10px;">Nie</td></tr>'; }

                if(req.body.raporty==1){  html+='<tr><th style="padding: 10px;">Raporty</th><td style="padding: 10px;">Tak</td></tr>'; }
                else{ html+='<tr><th style="padding: 10px;">Raporty</th><td style="padding: 10px;">Nie</td></tr>'; }
                html+='\
            </table>\
        </div>\
    </div>'
    
    var mailOptions = {
        from: 'robert.bogdanik13@gmail.com',
        to: email,
        subject: 'Zmiana planu',
        html: html,
        attachments: [{
            filename: 'image.png',
            path: './public/img/logo.png',
            cid: 'logo' 
        }]
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        }
    })

    res.redirect('/f/edit?CID='+req.body.CID)
}

const InsertMessage = (req, res, sess) => {
    sql='INSERT INTO `messages` (`Add_ID`, `Date_add`, `End_date`, `Title`, `Content`, `Important`, `Warning`) VALUES ("'+sess.PID+'", CURRENT_TIMESTAMP(), "'+req.body.do+'", "'+req.body.Temat+'", "'+req.body.Tresc+'", "'+req.body.Important+'", "'+req.body.Warning+'")'
    con.query(sql)

    res.redirect('/f')
}

const UpdateMessage = (req, res, sess) => {
    sql='UPDATE `messages` SET `End_date` = "'+req.body.do+'", `Title` = "'+req.body.Temat+'", `Content` = "'+req.body.Tresc+'", `Important` = "'+req.body.Important+'", `Warning` = "'+req.body.Warning+'" WHERE `_ID` = "'+req.body.id+'"'
    con.query(sql)

    res.redirect('/f')
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

module.exports = {
    index,
    ListModel,
    ListManufacturer,
    InsertModel,
    InsertManufacturer,
    InsertStatus,
    InsertCompany,
    UpdateStatus,
    UpdateModel,
    UpdateManufacturers,
    EditCompany,
    UpdateCompany,
    UpdateComplaint,
    InsertComplaint,
    UpdateAccount,
    InsertAccount,
    DelateAccount,
    InsertSubscription,
    UpdateSubscription,
    InsertMessage,
    UpdateMessage
}