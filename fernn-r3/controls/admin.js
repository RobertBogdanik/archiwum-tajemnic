const encode = require('nodejs-base64-encode')
var MySql = require('sync-mysql')
var url = require('url')
var multer = require('multer')
var nodemailer = require('nodemailer')
const { table } = require('console')

// łączenie z MySQL
var con = new MySql({
    host: "5.39.95.160",
    user: "master",
    password: "Brtk123.",
    database: "fernn"
})

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

var MRID, MCID, Attachments, SACID, PID
var FilesError =false

// widok home
const Home = (req, res, sess) => {
    var NoMesage = false
    var pierwszy = new Object()
    var pozostale =[]

    var sql='SELECT `Date_add`, `Title`, `Content`, `Important`, `Warning` FROM `messages` WHERE `End_date`>CURRENT_TIMESTAMP() ORDER BY `Date_add` DESC LIMIT 5'
    var mes = con.query(sql)
    if(mes.length==0){
        NoMesage=true
    }else{
        for(var a =0; a<mes.length;a++){
            if(a==0){
                var data = new Date(mes[a].Date_add)
                pierwszy.Add=createdata(data)
                pierwszy.Title=mes[a].Title
                pierwszy.Content=mes[a].Content
                pierwszy.Important=mes[a].Important
                pierwszy.Warning=mes[a].Warning
            }else{
                var dl = pozostale.length
                pozostale[dl]=new Object()
                pozostale[dl]=new Object()
                var data = new Date(mes[a].Date_add)
                pozostale[dl].Add=createdata(data)
                pozostale[dl].Title=mes[a].Title
                pozostale[dl].Content=mes[a].Content
                pozostale[dl].Important=mes[a].Important
                pozostale[dl].Warning=mes[a].Warning
            }
        }
    }
    res.render('admin/home', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "Thumbnail": sess.Thumbnail,
        "First": pierwszy,
        "Pozostale": pozostale,
        "NoMesage": NoMesage
    })
}

const Message = (req, res, sess) => {
    var NoMesage = false
    var pierwszy = new Object()
    var pozostale =[]

    var sql='SELECT `Date_add`, `Title`, `Content`, `Important`, `Warning` FROM `messages` ORDER BY `Date_add` DESC'
    var mes = con.query(sql)
    if(mes.length==0){
        NoMesage=true
    }else{
        for(var a =0; a<mes.length;a++){
            if(a==0){
                var data = new Date(mes[a].Date_add)
                pierwszy.Add=createdata(data)
                pierwszy.Title=mes[a].Title
                pierwszy.Content=mes[a].Content
                pierwszy.Important=mes[a].Important
                pierwszy.Warning=mes[a].Warning
            }else{
                var dl = pozostale.length
                pozostale[dl]=new Object()
                var data = new Date(mes[a].Date_add)
                pozostale[dl].Add=createdata(data)
                pozostale[dl].Title=mes[a].Title
                pozostale[dl].Content=mes[a].Content
                pozostale[dl].Important=mes[a].Important
                pozostale[dl].Warning=mes[a].Warning
            }
        }
    }
    res.render('admin/message', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "Thumbnail": sess.Thumbnail,
        "First": pierwszy,
        "Pozostale": pozostale,
        "NoMesage": NoMesage
    })
}

// dodawanie reklamacji index
const Add = (req, res, sess) => {
    // analiza url
    var error = false
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('error')=="true"){ error=true; }

    // pobranie listy producentów
    // pobranie listy producentów
    var sql="SELECT models.Model, manufacturers.Manufacturer FROM models, manufacturers WHERE models.Manufacturer=manufacturers._ID"
    var model = con.query(sql)

    // pobranie listy statusów
    sql="SELECT `Status` FROM status ORDER BY status.Value ASC"
    var status = con.query(sql)

    // pobranie listy unikatowych imion
    sql="SELECT DISTINCT Firstname FROM complaints"
    var name = con.query(sql)

    // rozszyfrowanie imion
    for(var c=0; c < name.length; c++)
    {
        name[c].Firstname = encode.decode(name[c].Firstname, 'base64')
    }

    // wygenerowanie widoku
    res.render('admin/add', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Name": name,
        "Models": model,
        "Statusy": status,
        "AddComplaints": sess.AddComplaints,
        "Error": error,
        "Notifications": sess.Notifications,
        "AddAttachments": sess.AddAttachments,
        "Reports": sess.Reports,
        "Thumbnail": sess.Thumbnail
    })
}

// dodaniwe do bazy reklamacji
const Model = (req, res, sess) => {
    var CID = sess.CID
    var PID = sess.PID
    var SelectModel = false
    var File = false
    
    // wstępny insert
    var sql="INSERT INTO `complaints` (`Company`, `Added`, `Added_date`, `Modification`, `Status`, `Model`, `Firstname`, `Lastname`, `Phone`, `Description`, `Serial_no`, `Purchase_number`, `Type`, `Expectations`, `Comments`, `Code`, `Pin`, `Complaint_number`, `Purchase_date`, `Damage_date`, `Notification`) VALUES ('"+CID+"', '"+PID+"'"

    // data
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    var dates = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    sql+=", '"+dates+"', current_timestamp()"

    // status
    var status = req.body.status
    var msql="SELECT _ID FROM `status` WHERE `Status`='"+status+"'"
    status = con.query(msql)
    status=JSON.stringify(status[0])
    status=JSON.parse(status)
    status = status._ID
    sql+=", '"+status+"'"

    // model
    var model = req.body.model
    msql='SELECT m._ID, m.Model, ma.Manufacturer FROM `models` as m JOIN `manufacturers` as ma ON m.Manufacturer=ma._ID WHERE `Model` = "'+model+'"'
    var mmodel = con.query(msql)
    
    if(mmodel.length==1)
    {      
        mmodel=JSON.stringify(mmodel[0])
        mmodel=JSON.parse(mmodel)
        model=mmodel._ID 
        sql+=", '"+model+"'"
    }else{
        sql+=", null"
        SelectModel=true
    }

    // imie
    var imie = encode.encode(req.body.imie, 'base64')
    if(imie!=""){ sql+=", '"+imie+"', " }else{ sql+=", 'Ti9E', " }

    // nazwisko
    var nazwisko = encode.encode(req.body.nazwisko, 'base64')
    if(nazwisko!=""){ sql+="'"+nazwisko+"'," }else{ sql+="'Ti9E', " }

    // telefon
    var telefon = encode.encode(req.body.telefon, 'base64')
    if(telefon!=""){ sql+="'"+telefon+"', " }else{ sql+="'Ti9E', " }

    // opis
    var opis = req.body.opis
    if(opis!=""){ sql+="'"+opis+"', " }else{ sql+="NULL, " }

    // seryjny
    var seryjny = req.body.seryjny
    if(seryjny!=""){ sql+="'"+seryjny+"', " }else{ sql+="NULL, " }

    // dowud zakupu
    var dowodu = req.body.dowodu
    if(dowodu!=""){ sql+="'"+dowodu+"', " }else{ sql+="NULL, " }

    // rodzaj reklamacji
    var rodzaj = req.body.rodzaj        
    if(rodzaj=="Pogwarancyjna"){ rodzaj = "Pogwarancyjna do kwoty "+req.body.dokwoty }
    if(rodzaj!=""){ sql+="'"+rodzaj+"', "}else{ sql+="NULL, " }

    // oczekiwania
    if(req.body.oczekiwania){ sql+='"'+req.body.oczekiwania+'", '}else{ sql+='NULL, ' }

    // uwagi
    var uwagi = req.body.uwagi
    if(uwagi!=""){ sql+="'"+uwagi+"', "}else{ sql+="NULL, " }  

    // KOD
    var znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var kod =""
    for(var d=0; d<10; d++){
        kod+=znaki[getRandomInt(0,33)]
    }
    sql+="'"+kod+"', "

    // PIN
    var pin=""
    for(var d=0; d<4; d++){
        pin+=getRandomInt(0,9)
    }
    sql+="'"+pin+"', "

    // NR. rekla
    msql="SELECT COUNT(*) AS Complaint_number, RIGHT(LEFT(CURRENT_DATE(),4),2) AS DAT FROM `complaints` WHERE `Company`='"+CID+"'"
    var Complaint_number = con.query(msql)
    Complaint_number=Complaint_number[0]

    var dat = Complaint_number.DAT
    Complaint_number = Complaint_number.Complaint_number+1
    if(Complaint_number<10){Complaint_number="0"+Complaint_number}
    Complaint_number = Complaint_number+"/"+dat
    sql+="'"+Complaint_number+"', "
    
    // nr dowodu zakupu
    var zakupu = req.body.zakupu
    if(zakupu!=""){ sql+="'"+zakupu+"', " }else{ sql+="NULL, " }  

    // data powstania wady
    var wady = req.body.wady
    if(wady!=""){ sql+="'"+wady+"', " }else{ sql+="NULL, " }  

    // info o zmianie statusu
    if(req.body.zmianainfo){
        sql+='"1")'
    }else{
        sql+='"0")'
    }

    // wykonanie insert
    con.query(sql)
    
    // pobranie danych reklamacji
    sql='SELECT `_ID` FROM `complaints` WHERE `Pin`="'+pin+'" AND `Code`="'+kod+'"'
    var RID = con.query(sql)
    // RID=JSON.stringify(RID[0])
    // RID=JSON.parse(RID)
    RID=RID[0]
    RID = RID._ID

    // pobranie info o załącznikach
    if(req.body.file){ File=true }

    // rozdzielenie przekierowań
    if(SelectModel){
        // wybranie modelu
        res.redirect('/a/add/selectmodel?model='+model+'&file='+File+'&RID='+RID)
    }else{
        if(File){
            // dadanie załączników
            res.redirect('/a/add/file?RID='+RID)
        }else{
            // potwierdzenie dodania
            res.redirect('/a/add/confirm?RID='+RID)
        }
    }
}

// wybranie modelu
const SelectModel = (req, res, sess) => {
    // analiza url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')==null || params.get('RID')==""){ res.redirect('/a/add?error=true'); return false; }

    // pobranie danych
    var model = params.get('model')
    var file = params.get('file')
    var RID = params.get('RID')

    // weryfikacja uprawnień
    sql='SELECT `_ID` FROM `complaints` WHERE `_ID`="'+RID+'" AND `Company`="'+sess.CID+'"'
    if(con.query(sql).length!=1){ res.redirect("/a/add?error=true"); return false; }

    // pobranie listy producentów
    var sql='SELECT `Manufacturer` FROM `manufacturers`'
    var producent = con.query(sql)

    // pobranie pasujących modeli i producentów
    sql='SELECT m._ID, m.Model, ma.Manufacturer, "'+RID+'" AS RID, "'+file+'" as File FROM `models` as m JOIN `manufacturers` as ma ON m.Manufacturer=ma._ID WHERE m.Model LIKE "%'+model+'%"'
    var data = con.query(sql)

    // wygenerowanie widoku
    res.render("admin/selectmodel", {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Data": data,
        "Producent": producent,
        "RID": RID,
        "File": file,
        "Reports": sess.Reports,
        "Thumbnail": sess.Thumbnail
    })
}

// dodanie modelu
const InsertModel = (req, res, sess) => {
    // pobranie danych
    var RID = req.body.RID
    var type = req.body.type
    if(type=="select"){
        // wykonanie update jeśli model instnieje
        var sql='UPDATE complaints SET Model = "'+req.body.MID+'" WHERE _ID = "'+RID+'" AND Company="'+sess.CID+'"'
        con.query(sql)
    }else{
        // dodanie modelu
        if(type=="insert"){
            // pobranie _ID producenta
            var sql='SELECT `_ID` FROM `manufacturers` WHERE `Manufacturer`="'+req.body.producent+'"'
            var proid = con.query(sql)
            if(proid.length!=1)
            {
                // jeśli nieistniejo to dopisz
                sql='INSERT INTO `manufacturers` (`Manufacturer`, `State`) VALUES ("'+req.body.producent+'", 1)'
                con.query(sql)
                sql='SELECT `_ID` FROM `manufacturers` WHERE `Manufacturer`="'+req.body.producent+'"'
                proid = con.query(sql)
            }
            // proid=JSON.stringify(proid[0])
            // proid=JSON.parse(proid)
            proid = proid[0]
            proid = proid._ID

            // dodanie modelu
            sql='INSERT INTO `models` (`Manufacturer`, `Model`, `State`) VALUES ("'+proid+'", "'+req.body.model+'", "1")'
            con.query(sql)

            // pobranie _ID modelu
            sql='SELECT `_ID` FROM `models` WHERE `Manufacturer`="'+proid+'" AND `Model`="'+req.body.model+'" AND `State`=1'
            var model = con.query(sql)
            // model=JSON.stringify(model[0])
            // model=JSON.parse(model)
            model=model[0]
            model = model._ID

            // wykonanie update
            sql='UPDATE complaints SET Model = "'+model+'" WHERE _ID = "'+RID+'" AND Company="'+sess.CID+'"'
            con.query(sql)
        }else{ 
            // wygenerowanie błędu jeśli nierozpoznano operacji   
            res.redirect('/a/add?error=true')
        }
    }

    // przekierowani
    if(req.body.file=="true")
    {
        // dodawanie plików
        res.redirect('/a/add/file?RID='+RID)
    }else{
        // potwierdzenie
        res.redirect('/a/add/confirm?RID='+RID)
    }
}

// widok dodawanie plików
const AddAttachment = (req, res, sess) => {
    // analiza url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')==null || params.get('RID')==""){ res.redirect('/a/add?error=true'); return false; }

    // pobranie danych
    var RID = params.get('RID')

    // wygenerowanie widoku
    res.render("admin/addfiles", {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "RID": RID,
        "MaxAttachment": sess.Attachments,
        "Unlimited": sess.UnlimitedAttachments,
        "AddAttachments": !sess.AddAttachments,
        "Reports": sess.Reports,
        "Thumbnail": sess.Thumbnail
    })
}

// wgranie plików
const UploadAttachment = (req, res, sess) => {
    // pobranie danych
    let params = new URLSearchParams(url.parse(req.url, true).query)
    FilesError=false
    MRID = params.get('RID')
    MCID = sess.CID
    Attachments=sess.Attachments

    // weryfikacja uprawnień
    sql='SELECT `_ID` FROM `complaints` WHERE `_ID`="'+MRID+'" AND `Company`="'+sess.CID+'"'
    if(con.query(sql).length!=1){ res.redirect("/a/add?error=true"); return false; }

    // wgranie
    upload(req, res, function (err) {
        if (err) {
            // jeśli błąd
            return res.redirect('/a/add/file?RID='+MRID+'&Error=true');
        }
        if(FilesError)
        {
            // jeśli przekroczono dozwoloną ilośc plików
            res.redirect('/a/add/confirm?RID='+MRID+'&FilesError=true')
        }else{
            // przekierowanie do potwierdzenia
            res.redirect('/a/add/confirm?RID='+MRID)
        } 
        // wyczyszczenie zmiennych
        MRID = 0
        MCID = 0
        Attachments = 0
        FilesError=false
    })
}

// generowanie potwierdzenia
const AddConfirm = (req, res, sess) => {
    // analiza url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')==null || params.get('RID')==""){ res.redirect('/a/add?error=true'); return false; }
    
    var FilesError = false
    if(params.get('FilesError')=="true" || params.get('FilesError')==true){  FilesError=true; }

    RID = params.get('RID')

    // pobranie kodu reklamacji
    var sql='SELECT `Code` FROM `complaints` WHERE `_ID`="'+RID+'" AND `Company`="'+sess.CID+'"'
    var code = con.query(sql)
    if(code.length==1){ code = code[0].Code; }else{ res.redirect('/a/add?error=true'); return false; }

    // wygenerowanie widoku
    res.render('admin/addconfirm', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.Warning,
        "Danger": sess.Danger,
        "Admin": sess.Admin,
        "RID": RID,
        "Code": code,
        "CID": sess.CID,
        "FilesError": FilesError,
        "Thumbnail": sess.Thumbnail
    })
}

// lista reklamacji
const ComplaintsList = (req, res, sess) => {
    var WarningStatus = false
    var WarningLocking = false
    var WarningData=""

    var sql="SELECT complaints._ID, complaints.Complaint_number, complaints.Type, complaints.Firstname, complaints.Lastname, complaints.Code, complaints.Pin, manufacturers.Manufacturer, models.Model, status.Status, status.Locking	 FROM `complaints` JOIN `status` ON complaints.Status=status._ID LEFT JOIN `models` ON complaints.Model=models._ID LEFT JOIN `manufacturers` ON models.Manufacturer=manufacturers._ID WHERE complaints.Company='"+sess.CID+"'"

    let params = new URLSearchParams(url.parse(req.url, true).query)
    
    if(params.get('status')!=null && params.get('status')!="")
    {
        // jeśli otrzymano info o statusie

        if(params.get('status')==4){
            // reklamacje zamknięte
            sql+=' AND status.Locking = "1"'
            WarningLocking=true
        }else{
            if(params.get('status')==3){
                // reklamacje zamknięte
                sql+=' AND status.Locking = "2"'
                WarningLocking=true
            }else{
                // dopisanie do select
                sql+=' AND status._ID = "'+params.get('status')+'"'

                // pobranie info o statusie
                var msql='SELECT `Status` FROM `status` WHERE `_ID`="'+params.get('status')+'"'
                result = con.query(msql)
                // result=JSON.stringify(result[0])
                // result=JSON.parse(result)
                result = result[0]
                WarningData=result.Status
                WarningStatus=true
            }
        }
    }

    // analiza url
    var error = false
    if(params.get('error')=="true")
    { error=true }

    var delate = false
    if(params.get('delate')=="true"){ delate=true }

    // wykonanie select
    result = con.query(sql)

    // tworzenie zmiennych
    var tr=[]
    var presult

    // rozszyfrowanie listy
    for(var c=0; c < result.length; c++)
    {
        presult=JSON.stringify(result[c])
        presult=JSON.parse(presult)

        tr[c]=new Object
        tr[c].Firstname = encode.decode(presult.Firstname, 'base64')
        tr[c].Lastname = encode.decode(presult.Lastname, 'base64')
        tr[c]._ID = presult._ID
        tr[c].Complaint_number = presult.Complaint_number
        tr[c].Type = presult.Type
        if(presult.Manufacturer==null){ tr[c].Manufacturer = "Brak danych"; }else{ tr[c].Manufacturer = presult.Manufacturer; }
        if(presult.Model==null){ tr[c].Model = "Brak danych"; }else{ tr[c].Model = presult.Model; }
        tr[c].Status = presult.Status
        tr[c].Code = presult.Code
        tr[c].Pin = presult.Pin

        var edit = true
        if(presult.Locking==1){ edit=false }
        tr[c].Edit = edit
        tr[c].Admin = sess.Admin
    }
  
    // wygenerowanie widoku
    res.render('admin/complaints', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "WarningStatus": WarningStatus,
        "WarningData": WarningData,
        "ReklaList": tr,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "EditError": error,
        "Delate": delate,
        "WarningLocking": WarningLocking,
        "Thumbnail": sess.Thumbnail
    })
}

// szczeguły reklamacji
const Details = (req, res, sess) => {
    // analiza url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')==null || params.get('RID')==""){ res.redirect('/a/complaints?error=true'); return false; }

    // sprawdzenie uprawnień do odczytu
    var sql='SELECT _ID FROM `complaints` WHERE `Company`="'+sess.CID+'" AND `_ID`="'+params.get('RID')+'"'
    var wer = con.query(sql)
    if(wer.length!=1){ res.redirect('/a/complaints?error=true'); return false; }

    // informacje i błędy
    var SuccesAdd = false
    if(params.get('SuccesAdd')=="true"){ SuccesAdd=true; }

    var ErrorUpdate = false
    if(params.get('ErrorUpdate')=="true"){ ErrorUpdate=true; }

    var Notification = false
    if(params.get('notification')=="true"){ Notification=true; }

    // pobranie info o reklamacji
    var AddModel = false
    sql='SELECT c.`_ID`, c.`Firstname`, c.`Lastname`, c.`Phone`, c.`Description`, c.`Serial_no`, c.`Purchase_number`, c.`Type`, c.`Expectations`, c.`Comments`, c.Code, c.`Complaint_number`, c.`Purchase_date`, c.`Damage_date`, c.`Notification`, s.Status, s._ID as StatusID, s.Locking, m.Model, ma.Manufacturer FROM `complaints` as c JOIN `status` as s ON c.Status=s._ID JOIN `models` as m ON c.Model=m._ID JOIN `manufacturers` as ma on m.Manufacturer=ma._ID WHERE c.Company="'+sess.CID+'" AND c._ID="'+params.get('RID')+'"'
    var wyn = con.query(sql)

    if(wyn.length==0){
        // jeśli nieistnieje model pobierz dane bez niego
        sql='SELECT c.`_ID`, c.`Firstname`, c.`Lastname`, c.`Phone`, c.`Description`, c.`Serial_no`, c.`Purchase_number`, c.`Type`, c.`Comments`, c.Code, c.`Complaint_number`, c.`Purchase_date`, c.`Damage_date`, c.`Notification`, s.Status, s._ID as StatusID FROM `complaints` as c JOIN `status` as s ON c.Status=s._ID WHERE c.Company="'+sess.CID+'" AND c._ID="'+params.get('RID')+'"'
        wyn = con.query(sql)
        AddModel=true

    }

    // pobierdz listę statusów bez obecnego
    sql='SELECT `Status` FROM `status` WHERE Status NOT IN ("'+wyn[0].Status+'")'
    var statusy = con.query(sql)

    // pobierz listę producentów i modeli
    sql='SELECT m.`Model`, ma.`Manufacturer` FROM `models` as m JOIN `manufacturers` AS ma ON m.`Manufacturer`=ma._ID'
    var model = con.query(sql)

    // rozszyfrowanie informacji
    var LastName = encode.decode(wyn[0].Lastname, 'base64')
    var FirstName = encode.decode(wyn[0].Firstname, 'base64')
    var Phone = encode.decode(wyn[0].Phone, 'base64')

    // uzupełnienie informacji i błędów
    var StatusNotification = false
    if(wyn[0].Notification==1){StatusNotification=true}

    var Purchase_date = ""
    if(wyn[0].Purchase_date!=null){
        Purchase_date = wyn[0].Purchase_date.substr(0,16)
    }
    var Damage_date = ""
    if(wyn[0].Damage_date!=null){
        Damage_date = wyn[0].Damage_date.substr(0,10)
    }

    // uprawnienia do edycji
    var edit = true
    if(wyn[0].Locking==1){ edit = false }

    // rodzej reklamacji
    var Type = wyn[0].Type
    if(wyn[0].Expectations!=null){ Type=wyn[0].Type+" ("+wyn[0].Expectations+")"; }

    // wygenerowanie widoku
    res.render('admin/edit', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "Notifications": sess.Notifications,
        "StatusNotification": StatusNotification,
        "NotError": SuccesAdd,
        "Error": ErrorUpdate,
        "ActualStatus": wyn[0].Status,
        "Statusy": statusy,
        "Model": wyn[0].Model,
        "Manufacturer": wyn[0].Manufacturer,
        "AddModel": AddModel,
        "Models": model,
        "FirstName": FirstName,
        "LastName": LastName,
        "Phone": Phone,
        "Serial_no": wyn[0].Serial_no,
        "Purchase_number": wyn[0].Purchase_number,
        "Description": wyn[0].Description,
        "Comments": wyn[0].Comments,
        "Type": Type,
        "Purchase_date": Purchase_date,
        "Damage_date": Damage_date,        
        "Complaint_number": wyn[0].Complaint_number,
        "Code": wyn[0].Code,
        "RID": params.get('RID'),
        "CID": sess.CID,
        "Notification": Notification,
        "Edit": edit,
        "Thumbnail": sess.Thumbnail
    })
}

// update reklamacje
const UpdateComplaint = (req, res, sess) => {
    // analiza błędów
    if(req.body.RID==""){ res.redirect('/a/details?RID='); return 0; }

    // jeśli otrzymano model
    if(req.body.model){
        // pobranie id odelu
        var mql='SELECT `_ID` FROM `models` WHERE `Model` LIKE "%'+req.body.model+'%"'

        var mwyn = con.query(mql)

        // jeśli kilka lub nic
        if(mwyn.length!=1){ res.redirect('/a/details/selectmodel?RID='+req.body.RID+'&model='+req.body.model); return 0; }
        // mwyn=JSON.stringify(mwyn[0])
        // mwyn=JSON.parse(mwyn)
        mwyn= mwyn[0]
        var model = mwyn._ID
    }
    
    // pobranie _ID statusu
    var sql='SELECT `_ID` FROM `status` WHERE `Status`="'+req.body.status+'"'
    var wyn = con.query(sql)
    if(wyn.length!=1){ res.redirect('/a/details?RID='+req.body.RID+'&ErrorUpdate=true'); return 0; }
    // wyn=JSON.stringify(wyn[0])
    // wyn=JSON.parse(wyn)
    wyn = wyn[0]
    var status = wyn._ID

    // pobranie starego statusu
    var nwestatus = false
    sql='SELECT `Status` FROM `complaints` WHERE `Company`="'+sess.CID+'" AND `_ID`="'+req.body.RID+'"'
    var sstatus = con.query(sql)
    // sstatus=JSON.stringify(sstatus[0])
    // sstatus=JSON.parse(sstatus)
    sstatus = sstatus[0]
    if(sstatus.length==0){ res.redirect('/a/details?RID='+req.body.RID+'&ErrorUpdate=true'); return 0; }
    if(sstatus.Status!=status && req.body.zmianainfo=="on"){ nwestatus=true }

    // tworzenie update
    sql='UPDATE complaints SET '
    sql+='Status = "'+status+'", '
    if(req.body.model){ sql+='Model = "'+model+'", ' }
    sql+='Lastname = "'+encode.encode(req.body.nazwisko, 'base64')+'", '
    sql+='Firstname = "'+encode.encode(req.body.imie, 'base64')+'", '
    sql+='Phone = "'+encode.encode(req.body.telefon, 'base64')+'", '
    sql+='Serial_no = "'+req.body.seryjny+'", '
    sql+='Purchase_number="'+req.body.dowodu+'", '
    sql+='Description = "'+req.body.opis+'", '
    sql+='Comments="'+req.body.uwagi+'", '
    sql+='Damage_date="'+req.body.wady+'", '
    sql+='Purchase_date="'+req.body.zakupu+'"'
    if(req.body.zmianainfo){ sql+=', Notification="1"' }
    if(nwestatus){ sql+=', SendNotification="1"' }else{ sql+=', SendNotification="0"' }
    sql+=' WHERE _ID = "'+req.body.RID+'" AND Company = "'+sess.CID+'"'

    // wykonanie i przekierowanie
    con.query(sql)
    res.redirect('/a/details?RID='+req.body.RID+'&SuccesAdd=true')
}

// edycja - wybieranie modelu
const EditSelectModel = (req, res, sess) => {
    // analiza url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')=="" || params.get('model')==""){ res.redirect('/a/complaints?error=true'); return false }

    // pobranie producentów
    var producenci = con.query('SELECT `Manufacturer` FROM `manufacturers`')

    // pobranie pasujących modeli
    sql='SELECT m._ID, m.Model, ma.Manufacturer, "'+params.get('RID')+'" AS RID FROM `models` as m JOIN `manufacturers` as ma ON m.Manufacturer=ma._ID WHERE m.Model LIKE "%'+params.get('model')+'%"'
    var data = con.query(sql)

    // wygenerowanie widoku
    res.render('admin/edit_selectmodel', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "Producent": producenci,
        "Data": data,
        "RID": params.get('RID'),
        "Thumbnail": sess.Thumbnail
    })
}

// edit - dodaj model
const EditInsertModel = (req, res, sess) => {
    var RID = req.body.RID

    // sprawdzanie producenta
    var sql='SELECT `_ID` FROM `manufacturers` WHERE `Manufacturer`="'+req.body.producent+'"'
    var proid = con.query(sql)
    if(proid.length!=1)
    {
        // jeśli niema to dodaj
        sql='INSERT INTO `manufacturers` (`Manufacturer`, `State`) VALUES ("'+req.body.producent+'", 1)'
        con.query(sql)
        sql='SELECT `_ID` FROM `manufacturers` WHERE `Manufacturer`="'+req.body.producent+'"'
        proid = con.query(sql)
    }
    // proid=JSON.stringify(proid[0])
    // proid=JSON.parse(proid)
    proid = proid[0]
    proid = proid._ID

    // dodanie modelu
    sql='INSERT INTO `models` (`Manufacturer`, `Model`, `State`) VALUES ("'+proid+'", "'+req.body.model+'", "1")'
    con.query(sql)

    // podranie _ID modelu
    sql='SELECT `_ID` FROM `models` WHERE `Manufacturer`="'+proid+'" AND `Model`="'+req.body.model+'" AND `State`=1'
    var model = con.query(sql)
    // model=JSON.stringify(model[0])
    // model=JSON.parse(model)
    model= model[0]
    model = model._ID

    // update reklamacji
    sql='UPDATE complaints SET Model = "'+model+'" WHERE _ID = "'+RID+'" AND Company="'+sess.CID+'"'
    con.query(sql)

    // przekierowanie widoku
    res.redirect('/a/details?RID='+req.body.RID+'&SuccesAdd=true')
}

// edit - update model
const EditUpdateModel = (req, res, sess) => {
    var RID = req.body.RID

    // wykonanie update
    var sql='UPDATE complaints SET Model = "'+req.body.MID+'" WHERE _ID = "'+RID+'" AND Company="'+sess.CID+'"'
    con.query(sql)

    // przekierowanie
    res.redirect('/a/details?RID='+req.body.RID+'&SuccesAdd=true')
}

// usuwanie reklamacji
const DelateComplaint = (req, res, sess) => {
    // analiza url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')=="" || params.get('RID')==null){ res.redirect('/a/complaints?error=true'); return false; }

    // sprawdzenie uprawnień
    var sql='SELECT `Company` FROM `complaints` WHERE `_ID`="'+params.get('RID')+'"'
    var wyn = con.query(sql)
    if(wyn.length!=1 || wyn[0].Company!=sess.CID){ res.redirect('/a/complaints?error=true'); return false; }

    // pobranie podstawowych danych
    var sql='SELECT `Code`, `Pin`, `Complaint_number`, `Company`, `Model` FROM `complaints` WHERE _ID = "'+params.get('RID')+'" AND Company="'+sess.CID+'"'
    var wyn = con.query(sql)
    wyn=JSON.stringify(wyn[0])
    wyn=JSON.parse(wyn)

    // skopiowanie danych
    sql='INSERT INTO `delates` (`Company`, `Model`, `Complaint_number`, `Code`, `Pin`) VALUES ("'+wyn.Company+'", "'+wyn.Model+'", "'+wyn.Complaint_number+'", "'+wyn.Code+'", "'+wyn.Pin+'")'
    con.query(sql)

    // usunięcie
    sql='DELETE FROM complaints WHERE _ID = "'+params.get('RID')+'" AND Company="'+sess.CID+'"'
    con.query(sql)

    // przekierowanie
    res.redirect('/a/complaints?delate=true')
}

// dodawanie nowych załączników
const EditAddNewAttachments = (req, res, sess) => {
    // walidacja url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')=="" || params.get('RID')==null){ res.redirect('/a/complaints?error=true');  return false; }

    // sprawdzenie błędów
    if(params.get('FilesError')=="true" || params.get('FilesError')==true){ FilesError=true; }

    // pobranie firmy edytowanej reklamacji
    var sql='SELECT `Company` FROM `complaints` WHERE `_ID`="'+params.get('RID')+'"'
    var wyn = con.query(sql)
    if(wyn.length!=1 || wyn[0].Company!=sess.CID){ res.redirect('/a/complaints?error=true'); return false; }

    // pobranie ścierzek do istniejących zdjęć
    sql='SELECT `Path` FROM `attachment` WHERE `Company`="'+sess.CID+'" AND `Complaints`="'+params.get('RID')+'"'
    var Path = con.query(sql)
    
    // sprawdzenie czy są pliki
    var file = true
    if(Path.length==0){ file=false }

    // czy można jeszcze dodać
    var ilejeszcze = sess.Attachments-Path.length
    var AddNew = false
    if(ilejeszcze<=0){ AddNew=true }

    // wygenerowanie widoku
    res.render('admin/editaddfiles', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "AddAttachments": !sess.AddAttachments,
        "Unlimited": sess.UnlimitedAttachments,
        "MaxAddAttachment": sess.Attachments-Path.length,
        "MaxAttachment": sess.Attachments,
        "IleJeszcze": AddNew,
        "Path": Path,
        "RID": params.get('RID'),
        "File": file,
        "FilesError": FilesError,
        "Thumbnail": sess.Thumbnail
    })
}

// edit - nowe załączniki
const EditUploadNewAttachments = (req, res, sess) => {
    // pobranie danych
    let params = new URLSearchParams(url.parse(req.url, true).query)
    MRID = params.get('RID')
    MCID = sess.CID
    Attachments=sess.Attachments
    FilesError=false

    // wgranie
    upload(req, res, function (err) {
        if (err) {
            // jeśli błąd
            console.log(err)
            return res.redirect('/a/details/attachments?RID='+MRID+'&Error=true')
        }
        if(FilesError)
        {
            // jeśli za dłużo załączników
            res.redirect('/a/details/attachments?RID='+MRID+'&FilesError=true')
        }else{
            // jeśli wszystko ok
            res.redirect('/a/details/attachments?RID='+MRID)
        }

        // wyczyszczenie zmiennych
        MRID = 0
        MCID = 0
        Attachments = 0
        FilesError=false
    })
}

// ręczne wysyłanie sms
const SendNotification = (req, res, sess) => {
    // walidacja url
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('RID')=="" || params.get('RID')==null){ res.redirect('/a/complaints?error=true'); return false; }

    // pobranie danych
    var RID = params.get('RID')

    // update
    var sql='UPDATE `complaints` SET `SendNotification`=1 WHERE `_ID`="'+RID+'" AND `Company`="'+sess.CID+'"'
    con.query(sql)
    
    // przekierowanie
    res.redirect('/a/details?RID='+RID+'&notification=true')
}

const Statistics = (req, res,sess) => {
    res.render('admin/statistics', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "Thumbnail": sess.Thumbnail
    })
}

// ustawienia
const Settings = (req, res, sess) => {
    var errordate = new Object
    let params = new URLSearchParams(url.parse(req.url, true).query)

    // błąd długości
    var dataerror = false
    if(params.get('DataError')=="true"){ dataerror = true }

    // pomyślne dodanie
    var success = false
    if(params.get('Success')=="true"){ success = true }

    // błąd loginu dodawanie
    var addloginerror = false
    if(params.get('AddLoginError')=="true"){ 
        addloginerror = true 
        errordate=ErrorToObject(params)
    }

    // blad loginu updateactual
    var updateloginerror = false
    if(params.get('UpdateActualLoginError')=="true"){ 
        updateloginerror = true 
    }

    // blad ogólny
    var erro = false
    if(params.get('Error')=="true"){ erro = true }

    // blad ogólny
    var successsend = false
    if(params.get('SuccessSend')=="true"){ successsend = true }

    // aktualne konto
    var sql='SELECT * FROM `accounts` WHERE `_ID`="'+sess.PID+'" AND `Company`="'+sess.CID+'"'
    var aaccount = con.query(sql)
    var account = []
    account[0] = new Object()
    if(aaccount[0].Login!=null){ account[0].Login = encode.decode(aaccount[0].Login, 'base64') }else{ account[0].Login="" }
    account[0].Email = encode.decode(aaccount[0].Email, 'base64')
    account[0].Firstname = encode.decode(aaccount[0].Firstname, 'base64')
    account[0].Lastname = encode.decode(aaccount[0].Lastname, 'base64')

    // pozostałe konta
    sql='SELECT * FROM `accounts` WHERE `Company`="'+sess.CID+'" AND _ID NOT IN ("'+sess.PID+'")'
    var wyn = con.query(sql)
    var okwyn = []
    for(var a =0; a<wyn.length; a++){
        okwyn[a] = new Object
        okwyn[a]._ID = wyn[a]._ID
        okwyn[a].Login = encode.decode(wyn[a].Login, 'base64')
        if(wyn[a].Email!=null){okwyn[a].Email = encode.decode(wyn[a].Email, 'base64')}
        okwyn[a].Password = encode.decode(wyn[a].Password, 'base64')
        okwyn[a].Firstname = encode.decode(wyn[a].Firstname, 'base64')
        okwyn[a].Lastname = encode.decode(wyn[a].Lastname, 'base64')
        okwyn[a].Permissions = wyn[a].Permissions
    }

    // okresy rozliczeniowe
    sql='SELECT * FROM `subscription` WHERE `Company`="'+sess.CID+'" ORDER BY `End` DESC'
    var lic = con.query(sql)
    var licencja = []
    for(var a =0; a<lic.length;a++){
        licencja[a] = new Object
        licencja[a].Start = lic[a].Start.substr(0,10)
        licencja[a].End = lic[a].End.substr(0,10)
        licencja[a].Plan = lic[a].Plan
        licencja[a].Account = lic[a].Account
        licencja[a].Report = lic[a].Report
        licencja[a].Attachment = lic[a].Attachment
        licencja[a].Notifications = lic[a].Notifications
        licencja[a].Complaints = lic[a].Complaints
        if(licencja[a].End == sess.End.substr(0,10)){
            licencja[a].Actual = true
        }else{
            licencja[a].Actual = false
        }

        if(licencja[a].Account==9999){ licencja[a].UnlimitedAccount = true}else{ licencja[a].UnlimitedAccount = false }
    }

    // pozostałe okresy rozliczeniowe
    sql='SELECT Start, End FROM `subscription` WHERE `Company`="'+sess.CID+'" AND `End`>CURRENT_DATE()'
    var okr = con.query(sql)
    var okres = []
    for(var a = 0; a<okr.length; a++)
    {
        okres[a] = new Object
        okres[a].Start = okr[a].Start.substr(0,10)
        okres[a].End = okr[a].End.substr(0,10)
    }

    // obecny okres rozliczeniowy
    sql='SELECT Start, End, Plan, Account, Report, Attachment, Notifications FROM `subscription` WHERE `Company`="'+sess.CID+'" AND CURRENT_DATE()<`End`AND CURRENT_DATE()>=`Start`'
    var kobecny = con.query(sql)
    kobecny=kobecny[0]
    var obecny = new Object()
    obecny.Plan = kobecny.Plan
    obecny.Pplan=[]
    var plany=["Basic", "Standard", "Pro", "Custom"]
    for(var c=0; c<plany.length;c++){
        if(plany[c]!=obecny.Plan){ var dl=obecny.Pplan.length; obecny.Pplan[dl] = new Object(); obecny.Pplan[dl].Plan=plany[c]; }
    }
    obecny.Account=kobecny.Account
    obecny.Report=kobecny.Report
    obecny.Attachment=kobecny.Attachment
    obecny.Notifications=kobecny.Notifications
    obecny.Start=kobecny.Start
    obecny.End=kobecny.End

    // dane firmy
    sql='SELECT * FROM `company` WHERE `_ID`="'+sess.CID+'"'
    var firma = con.query(sql)
    firma.Name = firma[0].Name
    firma.NIP = encode.decode(firma[0].NIP, 'base64')
    firma.Email = encode.decode(firma[0].Email, 'base64')
    firma.Phone = encode.decode(firma[0].Phone, 'base64')
    firma.Adres = encode.decode(firma[0].Adress, 'base64')
    firma.Logo = firma[0].Logo

    if(firma.Logo==null){ firma.Logo="logo.png"; }

    // generowanie widoku
    res.render('admin/settings', {
        "Firstname": sess.Firstname,
        "Lastname": sess.Lastname,
        "Warning": sess.EndWarning,
        "Danger": sess.EndDanger,
        "Admin": sess.Admin,
        "Reports": sess.Reports,
        "Sesja": sess,
        "Accounts": okwyn,
        "Licencja": licencja,
        "ActualAccount": account,
        "DataError": dataerror,
        "Success": success,
        "AddLoginError": addloginerror,
        "UpdateActualLoginError": updateloginerror,
        "ErrorDate": errordate,
        "Error": erro,
        "successSend": successsend,
        "Okresy": okres,
        "Company": firma,
        "Logo": firma.Logo,
        "Thumbnail": sess.Thumbnail,
        "Obecny": obecny
    })
}

// update aktualne kąto
const UpdateActualAccount = (req, res, sess) => {
    // pobranie info o kącie
    sql='SELECT * FROM `accounts` WHERE `_ID`="'+sess.PID+'" AND `Company`="'+sess.CID+'"'
    var account = con.query(sql)

    // zaszyfrowanie danych
    var NewAccount = new Object
    NewAccount.Login = encode.encode(req.body.login, 'base64')
    NewAccount.Email = encode.encode(req.body.email, 'base64')
    NewAccount.Password = encode.encode(req.body.haslo, 'base64')
    NewAccount.Firstname = encode.encode(req.body.imie, 'base64')
    NewAccount.Lastname = encode.encode(req.body.nazwisko, 'base64')

    // sprawdzanie czy login wolny
    var sql = 'SELECT COUNT(*) AS quality FROM `accounts` WHERE `Login`="'+NewAccount.Login+'"'
    var wyn=JSON.stringify(con.query(sql)[0])
    wyn=JSON.parse(wyn)

    if(NewAccount.Login == account[0].Login){
        if(wyn.quality!=1){
            // błąd loginu
            res.redirect('/a/settings?UpdateActualLoginError=true#account')
            return false
        }
    }else{
        if(wyn.quality!=0){
            // błąd loginu
            res.redirect('/a/settings?UpdateActualLoginError=true#account')
            return false
        }
    }

    // generowanie update
    sql = 'UPDATE `accounts` SET `Company`="'+sess.CID+'"'
    if(NewAccount.Login != account[0].Login)
    {
        var login = req.body.login
        if(login.length >= 4){
            sql += ', `Login`="'+NewAccount.Login+'"'
        }else{
            res.redirect('/a/settings?DataError=true')
            return false
        }
    }
    if(NewAccount.Email != account[0].Email){ sql += ', `Email`="'+NewAccount.Email+'"' }
    if(NewAccount.Password != account[0].Password && NewAccount.Password!="")
    {
        var haslo  = req.body.haslo
        if(haslo.length >= 6){
            sql += ', `Password`="'+NewAccount.Password+'"'
        }else{
            res.redirect('/a/settings?DataError=true')
            return false
        }
    }
    if(NewAccount.Firstname != account[0].Firstname){ sql += ', `Firstname`="'+NewAccount.Firstname+'"' }
    if(NewAccount.Lastname != account[0].Lastname){ sql += ', `Lastname`="'+NewAccount.Lastname+'"' }
    sql+=' WHERE `Company` = "'+sess.CID+'" AND `_ID` = "'+sess.PID+'"'

    // wykonanie update i przekierowanie
    con.query(sql)
    res.redirect('/a/settings?Success=true')
}

// dodawanie kąta
const AddAccount = (req, res, sess) => {
    var haslo  = req.body.haslo
    if(haslo.length < 6){ res.redirect('/a/settings?DataError=true'); return false; }

    var login  = req.body.login
    if(login.length < 4){ res.redirect('/a/settings?DataError=true'); return false; }

    var NewAccount = new Object
    NewAccount.Login = encode.encode(req.body.login, 'base64')
    NewAccount.Password = encode.encode(req.body.haslo, 'base64')
    NewAccount.Firstname = encode.encode(req.body.imie, 'base64')
    NewAccount.Lastname = encode.encode(req.body.nazwisko, 'base64')
    
    var sql = 'SELECT COUNT(*) AS quality FROM `accounts` WHERE `Login`="'+NewAccount.Login+'"'
    var wyn=con.query(sql)
    if(wyn.quality!=0){
        res.redirect('/a/settings?AddLoginError=true&Login='+req.body.login+'&Email='+req.body.email+'&Haslo='+req.body.haslo+'&Imie='+req.body.imie+'&Nazwisko='+req.body.nazwisko+'#AddAccount')
        return false
    }

    var uprawnienia = 0
    if(req.body.uprawnienia == "Administrator"){ uprawnienia = 1 }

    if(req.body.email!=""){
        NewAccount.Email = encode.encode(req.body.email, 'base64')
        sql='INSERT INTO `accounts` (`Login`, `Email`, `Password`, `Firstname`, `Lastname`, `Permissions`, `Company`) VALUES ("'+NewAccount.Login+'", "'+NewAccount.Email+'", "'+NewAccount.Password+'", "'+NewAccount.Firstname+'", "'+NewAccount.Lastname+'", "'+uprawnienia+'", "'+sess.CID+'")'
        con.query(sql)

        // wygenerowanie email z hasłen i loginem
        var html = '\
        <div style=" width: 600px; margin: auto;">\
            <div style="text-align: center;">\
                <img src="cid:logo" style="margin: 0 auto; width="300px;">\
                <h1 style="color: #1a6aba; font-size: 50px; ">Witamy w systemie Fernn</h1><br><br>\
                <p style="color: #212121; font-size: 25px; margin-top: 10px;">Zostałeś dodany jako '+req.body.uprawnienia+' do firmy '+sess.Name+'</p>\
                <p style="color: #212121; font-size: 24px;">Dane do logowania:</p>\
                <table border="1" style="margin: auto; font-size: 20px; olor: #212121;">\
                    <tr>\
                        <th style="padding: 5px">Login</th>\
                        <td style="padding: 5px">'+req.body.login+'</td>\
                    </tr>\
                    <tr>\
                        <th style="padding: 5px">Hasło</th>\
                        <td style="padding: 5px">'+req.body.haslo+'</td>\
                    </tr>\
                </table><br><br>\
                <p style=" color: #212121; font-size: 25px; margin-top: 10px;">Możesz zalogwać się teraz wchodząc na stronę www.fernn.pl/login lub klikając w poniższy przecisk.</p>\
                <a href="http://fernn.pl/login"><button style="text-decoration: none; padding: 10px; font-size: 25px; color: #fff; background-color: #0d6efd; border: 2px solid #0d6efd;">Zaloguj się teraz</button></a><br><br>\
                <p style=" color: #212121; font-size: 15px;">Jeśli nie jesteś związany z firmę '+sess.Name+' zignoruj tę wiadomość. Ktoś najprawdopodobniej przypadkiem podał ten adres email.</p>\
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
    }else{
        sql='INSERT INTO `accounts` (`Login`, `Email`, `Password`, `Firstname`, `Lastname`, `Permissions`, `Company`) VALUES ("'+NewAccount.Login+'", NULL, "'+NewAccount.Password+'", "'+NewAccount.Firstname+'", "'+NewAccount.Lastname+'", "'+uprawnienia+'", "'+sess.CID+'")'
        con.query(sql)
    }
    
    res.redirect('/a/settings?Success=true')
}

const UpdateAccount = (req, res, sess) => {
    sql='SELECT * FROM `accounts` WHERE `_ID`="'+req.body.PID+'" AND `Company`="'+sess.CID+'"'
    var account = con.query(sql)

    var NewAccount = new Object
    NewAccount.Login = encode.encode(req.body.login, 'base64')
    NewAccount.Email = encode.encode(req.body.email, 'base64')
    NewAccount.Password = encode.encode(req.body.haslo, 'base64')
    NewAccount.Firstname = encode.encode(req.body.imie, 'base64')
    NewAccount.Lastname = encode.encode(req.body.nazwisko, 'base64')

    var sql = 'SELECT COUNT(*) AS quality FROM `accounts` WHERE `Login`="'+NewAccount.Login+'"'
    var wyn=JSON.stringify(con.query(sql)[0])
    wyn=JSON.parse(wyn)

    if(NewAccount.Login == account[0].Login){
        if(wyn.quality!=1){
            res.redirect('/a/settings?UpdateLoginError=true#account')
            return false
        }
    }else{
        if(wyn.quality!=0){
            res.redirect('/a/settings?UpdateActualLoginError=true#account')
            return false
        }
    }

    sql = 'UPDATE `accounts` SET `Company`="'+sess.CID+'"'
    if(NewAccount.Login != account[0].Login)
    {
        var login = req.body.login
        if(login.length >= 4){
            sql += ', `Login`="'+NewAccount.Login+'"'
        }else{
            res.redirect('/a/settings?DataError=true')
            return false
        }
    }
    if(NewAccount.Email != account[0].Email){ sql += ', `Email`="'+NewAccount.Email+'"' }
    if(NewAccount.Password != account[0].Password && NewAccount.Password!="")
    {
        var haslo  = req.body.haslo
        if(haslo.length >= 6){
            sql += ', `Password`="'+NewAccount.Password+'"'
        }else{
            res.redirect('/a/settings?DataError=true')
            return false
        }
    }
    if(NewAccount.Firstname != account[0].Firstname){ sql += ', `Firstname`="'+NewAccount.Firstname+'"' }
    if(NewAccount.Lastname != account[0].Lastname){ sql += ', `Lastname`="'+NewAccount.Lastname+'"' }

    var uprawnienia = 0
    if(req.body.uprawnienia == "Administrator"){ uprawnienia = 1 }
    sql+=', Permissions="'+uprawnienia+'"'

    sql+=' WHERE `Company` = "'+sess.CID+'" AND `_ID` = "'+req.body.PID+'"'

    con.query(sql)
    res.redirect('/a/settings?Success=true')
}

const DelateAccount = (req, res, sess) => {
    let params = new URLSearchParams(url.parse(req.url, true).query)

    if(params.get('PID')=="" || params.get('PID')==null){
        res.redirect('/a/settings?Error=true')
        return false
    }
    var sql = 'DELETE FROM `accounts` WHERE `accounts`.`_ID` = "'+params.get('PID')+'" AND Company = "'+sess.CID+'"'
    con.query(sql)
    res.redirect('/a/settings?Success=true')
}

// update aktual plan
const EditPlan = (req, res, sess) => {
    var html = '<h1>Edycja licencji</h1><table>'
    html+='<tr><th>Początek licencji</th><td>'+req.body.Start+'</td></tr>'
    html+='<tr><th>Konie licencji</th><td>'+req.body.End+'</td></tr>'
    html+='<tr><th>Plan</th><td>'+req.body.plan+'</td></tr>'
    
    if(req.body.plan=="Custom"){
        html+='<tr><th>Ilość kont</th><td>'+req.body.ilekont+'</td></tr>'
        html+='<tr><th>Ilość zalacznikow</th><td>'+req.body.ilezalacznikow+'</td></tr>'
        html+='<tr><th>Powiadomienia dla klienta</th><td>'+req.body.powiadomienia+'</td></tr>'
        html+='<tr><th>Raporty</th><td>'+req.body.raporty+'</td></tr>'
        html+='<tr><th>Inne</th><td>'+req.body.dodatkowo+'</td></tr>'
    }
    html+='<tr><th>CID</th><td>'+req.body.CID+'</td></tr>'
    html+='</table>'
    
    var mailOptions = {
        from: 'robert.bogdanik13@gmail.com',
        to: 'loxu.help@gmail.com',
        subject: 'Edycja licencji',
        html: html
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            res.redirect('/a/settings?SuccessSend=true')
        }
    })
}


const ExtendLicense = (req, res, sess) => {
    var html = '<h1>Przedłużenie licencji</h1><table>'
    html+='<tr><th>Czas przedłurzenia</th><td>'+req.body.trwanie+'</td></tr>'
    html+='<tr><th>Plan</th><td>'+req.body.plan+'</td></tr>'
    
    if(req.body.plan=="Custom"){
        html+='<tr><th>Ilość reklamacji</th><td>'+req.body.ilereklamacji+'</td></tr>'
        html+='<tr><th>Ilość kont</th><td>'+req.body.ilekont+'</td></tr>'
        html+='<tr><th>Ilość zalacznikow</th><td>'+req.body.ilezalacznikow+'</td></tr>'
        html+='<tr><th>Powiadomienia dla klienta</th><td>'+req.body.powiadomienia+'</td></tr>'
        html+='<tr><th>Raporty</th><td>'+req.body.raporty+'</td></tr>'
        html+='<tr><th>Inne</th><td>'+req.body.dodatkowo+'</td></tr>'
    }
    html+='<tr><th>CID</th><td>'+req.body.CID+'</td></tr>'
    html+='</table>'
    
    var mailOptions = {
        from: 'robert.bogdanik13@gmail.com',
        to: 'loxu.help@gmail.com',
        subject: 'Przedłurzenie licencji',
        html: html
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            res.redirect('/a/settings?SuccessSend=true')
        }
    })
}

const AddComplaints = (req, res, sess) => {
    var html = '<h1>Dodatkowe reklamacje</h1><table>'
    html+='<tr><th>Okres licencji</th><td>'+req.body.okres+'</td></tr>'
    html+='<tr><th>Ilość reklamacji</th><td>'+req.body.ile+'</td></tr>'
    html+='<tr><th>CID</th><td>'+req.body.CID+'</td></tr>'
    html+='</table>'
    
    var mailOptions = {
        from: 'robert.bogdanik13@gmail.com',
        to: 'loxu.help@gmail.com',
        subject: 'Dodatkowe reklamacje',
        html: html
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            res.redirect('/a/settings?SuccessSend=true')
        }
    })
}

const UpdateCompany = (req, res, sess) => {
    var nip = encode.encode(req.body.nip, 'base64')
    var email = encode.encode(req.body.email, 'base64')
    var telefon = encode.encode(req.body.telefon, 'base64')
    var adres = encode.encode(req.body.adres, 'base64')
    var sql='UPDATE company SET Name = "'+req.body.nazwa+'", NIP = "'+nip+'", Email = "'+email+'", Phone = "'+telefon+'", Adress="'+adres+'" WHERE _ID = "'+sess.CID+'"'
    con.query(sql)
    res.redirect('/a/settings?Success=true')
}

const AddLogo = (req, res, sess) => {
    SACID=sess.CID

    uploadlogo(req, res, function (err) {
        if (err) { return res.redirect('/a/settings?Error=true'); }
        res.redirect('/a/settings?Success=true')
        SACID=""
    })
}

const AddThumbnail = (req, res, sess) => {
    PID=sess.PID

    uploadthumbnail(req, res, function (err) {
        if (err) { return res.redirect('/a/settings?Error=true'); }
        res.redirect('/a/settings?Success=true')
        PID=""
    })
}

const ResetThumbnail = (req,res, sess) => {
    var sql='UPDATE `accounts` SET `Thumbnail` = NULL WHERE `_ID` = "'+sess.PID+'"'
    con.query(sql)
    res.redirect('/a/settings?Success=true')
}

var  createdata = (datawej) => {
    var data = new Date(datawej)
    var ddata = data.getFullYear()+"-"
    if(data.getMonth()<10){ ddata+="0"+data.getMonth()+"-"; }else{ ddata+=data.getMonth()+"-"; }
    if(data.getDay()<10){ ddata+="0"+data.getDay()+" "; }else{ ddata+=data.getDay()+" "; }
    if(data.getHours()<10){ ddata+="0"+data.getHours()+":"; }else{ ddata+=data.getHours()+":"; }
    if(data.getMinutes()<10){ ddata+="0"+data.getMinutes(); }else{ ddata+=data.getMinutes(); }

    return ddata
}

var ErrorToObject = (params) => {
    return {
        "Login": params.get('Login'),
        "Email": params.get('Email'),
        "Haslo": params.get('Haslo'),
        "Imie": params.get('Imie'),
        "Nazwisko": params.get('Nazwisko')
    }
}

var AddFile = (fn) => {
    var sql = 'SELECT COUNT(*) AS ile FROM `attachment` WHERE `Complaints`="'+MRID+'"'
    var wyn = con.query(sql)
    if(wyn[0].ile<Attachments)
    {
        var sql = 'INSERT INTO `attachment` (`Company`, `Complaints`, `Path`) VALUES ("'+MCID+'", "'+MRID+'", "'+fn+'")'
        con.query(sql)
    }else{
        FilesError=true
    }
}

var SettingsAddLogo = (CID, fn) => {
    var sql='UPDATE `company` SET `Logo`="'+fn+'" WHERE `_ID`="'+CID+'"'
    con.query(sql)
}

var SettingsAddThumbnail = (PID, fn) => {
    var sql='UPDATE `accounts` SET `Thumbnail` = "'+fn+'" WHERE `_ID` = "'+PID+'"'
    con.query(sql)
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
        var fn = file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1]
        AddFile(fn)
        cb(null, fn)
    }
})

var storagelogo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
        var fn = file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1]
        SettingsAddLogo(SACID, fn)
        cb(null, fn)
    }
})

var storagethumbnail = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/files/')
    },
    filename: function (req, file, cb) {
        var fn = file.fieldname + '-' + Date.now()+'.'+file.mimetype.split('/')[1]
        SettingsAddThumbnail(PID, fn)
        cb(null, fn)
    }
})

var upload = multer({ storage : storage }).array('attachment',Attachments);

var uploadlogo = multer({ storage : storagelogo }).array('logo',Attachments);

var uploadthumbnail = multer({ storage : storagethumbnail }).array('thumbnail',Attachments);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
    Home,
    Message,
    Add,
    Model,
    SelectModel,
    InsertModel,
    AddAttachment,
    UploadAttachment,
    AddConfirm,
    ComplaintsList,
    Details,
    UpdateComplaint,
    EditSelectModel,
    EditInsertModel,
    EditUpdateModel,
    DelateComplaint,
    EditAddNewAttachments,
    EditUploadNewAttachments,
    SendNotification,
    Statistics,
    Settings,
    UpdateActualAccount,
    AddAccount,
    UpdateAccount,
    DelateAccount,
    ExtendLicense,
    AddComplaints,
    UpdateCompany,
    AddLogo,
    AddThumbnail,
    ResetThumbnail,
    EditPlan
}