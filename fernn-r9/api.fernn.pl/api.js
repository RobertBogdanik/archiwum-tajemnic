// http://5.39.95.160/

// var crypto = require('crypto');
var MySql = require('sync-mysql');
const express = require('express');
const multer = require("multer")
const path = require('path');
// var bodyParser =require('body-parser');
const encode = require('nodejs-base64-encode');
const session = require('express-session');
const fs = require('fs');
// let cookieParser = require('cookie-parser')
const { promisify } = require('util')
var cors = require('cors');
const unlinkAsync = promisify(fs.unlink)
const app = express();
const bodyParser = require('body-parser');
const fileupload = require("express-fileupload");
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  secret: 'Huaktffsf8yHdAF43',
  saveUninitialized: false,
  resave: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var sess = {IMG: []}
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(express.static(path.join(__dirname, 'public')))
// app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }
// app.use(cors(corsOptions))



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

function GetOneData(sql){
  const result = con.query(sql)
  if( result.length==0 ){ return false }else{ return result[0] }
}
function GetData(sql){
  return con.query(sql)
}

function int(str){
  return parseInt(str)
}

// pozostałe
app.get('/v1/1/status', (req, res) => {
  if(req.query.API!=undefined){
    const sql='SELECT s._ID, s.Status AS Name, s.Value, s.Locking FROM `status` as s, `api` WHERE api.Key="'+req.query.API+'" ORDER BY s.Value ASC;'
    res.send(GetData(sql))
  }else{ res.send("e") }
})

// model i producent
app.get('/v1/1/manufacterinfo', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.RID!=undefined){
    const sql='SELECT m.* FROM `complaints` AS c JOIN `models` AS mo ON c.Model=mo._ID JOIN `manufacturers` AS m ON mo.Manufacturer=m._ID, `api` WHERE c._ID="'+req.query.RID+'" AND c.Company="'+req.query.CID+'" AND api.`Key`="'+req.query.API+'";'
    res.send(GetOneData(sql))
  }else{ console.log("e") }
})
app.get('/v1/1/searchmodels', (req, res) => {
  if(req.query.API!=undefined && req.query.query!=undefined){
    let sql='SELECT models._ID, models.`Model`, models.`SKU`, manufacturers.Manufacturer FROM `models` JOIN `manufacturers` ON models.Manufacturer=manufacturers._ID, api WHERE api.key="'+req.query.API+'"'
    
    const qWords = req.query.query.split(' ')
    for (const word of qWords) { sql+=" AND (models.Model LIKE '%"+word+"%' OR models.SKU LIKE '%"+word+"%' OR manufacturers.Manufacturer LIKE '%"+word+"%')" }

    sql+=" LIMIT 30"
    res.send(GetData(sql))
  }else{ res.send("e") }
})
app.get('/v1/1/searchmanufacters', (req, res) => {
  if(req.query.API!=undefined && req.query.query!=undefined){
    let sql='SELECT manufacturers._ID, manufacturers.Manufacturer FROM `manufacturers`, api WHERE '
    sql+=" api.key='"+req.query.API+"'"

    var qWords = req.query.query.split(' ')
    for (const word of qWords) { sql+=" AND manufacturers.Manufacturer LIKE '%"+word+"%'" }
    
    sql+=" LIMIT 30"
    res.send(GetData(sql))
  }else{ res.send("e") }
})


// logowanie
app.get('/v1/1/login', (req,res) => {
  if(req.query.API!=undefined && req.query.login!=undefined && req.query.password!=undefined){
    let secountParty = false, subscription = false
    // all
    var sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints, MAX(s.End) AS MAX, se.Name AS "SectionName" FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company JOIN `sections` AS se ON a.Section=se._ID WHERE (a.`Login`="'+encode.encode(req.query.login, 'base64')+'" OR a.`Email`="'+encode.encode(req.query.login, 'base64')+'") AND a.`Password`="'+encode.encode(req.query.password, 'base64')+'" AND CURRENT_DATE()>=s.Start AND CURRENT_DATE()<=s.End'
    var result = GetOneData(sql)
    if(result.PID!=null){ secountParty = true; subscription=true; }
    else{
      // nieaktywna z sekcją
      sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints, se.Name AS "SectionName" FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company JOIN `sections` AS se ON a.Section=se._ID WHERE (a.`Login`="'+encode.encode(req.query.login, 'base64')+'" OR a.`Email`="'+encode.encode(req.query.login, 'base64')+'") AND a.`Password`="'+encode.encode(req.query.password, 'base64')+'" AND s.End<CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
      result = GetOneData(sql)
      if(result.PID!=null){ secountParty=true }
      else{ 
        // aktywana bez sekcji
        sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE (a.`Login`="'+encode.encode(req.query.login, 'base64')+'" OR a.`Email`="'+encode.encode(req.query.login, 'base64')+'") AND a.`Password`="'+encode.encode(req.query.password, 'base64')+'" AND s.End>CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
        result = GetOneData(sql)
        if(result.PID!=null){ secountParty=true; subscription=true; }
        else{ 
          // nieaktywny bez sekcji
          sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE (a.`Login`="'+encode.encode(req.query.login, 'base64')+'" OR a.`Email`="'+encode.encode(req.query.login, 'base64')+'") AND a.`Password`="'+encode.encode(req.query.password, 'base64')+'" AND s.End<CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
          result = GetOneData(sql)
          if(result.PID!=null){ secountParty=true }
          else{ secountParty=false }
         }
      }
    }

    if(secountParty){
      var admin = false
      if(result.Permissions==1){ admin=true }

      var Thumbnail = "https://img.icons8.com/color/48/000000/user-male-circle--v1.png"
      if(result.Thumbnail!=null){ Thumbnail="http://localhost:8082/thumbnail/"+result.Thumbnail }

      var danger = true
      var warning = false
      var adaccounts = false
      var report = false
      var addattachment = false
      var unlimitedaccount = false
      var unlimitedattachments = false
      var notifications = false
      var addcomplaints = false

      if(subscription){
        sql='SELECT COUNT(*) AS quantity  FROM `accounts`  WHERE `Company`="'+result.CID+'"   UNION  SELECT COUNT(*) AS quantity  FROM `complaints` as c  WHERE Added_date>"'+result.Start+'" AND Added_date<="'+result.End+'" AND c.Company="'+result.CID+'"'
        var minires = GetData(sql)
        if(minires[0].quantity<result.Account){ adaccounts=true }
        if(minires[1].quantity<result.Complaints){ addcomplaints=true }

        if(result.Account==9999){ unlimitedaccount=true }
        if(result.Report==1){ report=true }
        if(result.Attachment>0){ addattachment=true }
        if(result.Attachment==9999){ unlimitedattachments=true }
        if(result.Notifications>0){ notifications=true }

        var data1=new Date(result.MAX)
        var data2=new Date(result.Today)
        var dni = data1 - data2
        dni = Math.floor(dni/(1000*60*60*24));
        if(dni <= 14 && dni >= 0){ warning=true }
      }

      sql='SELECT s._ID, s.Name FROM `departments` AS d JOIN `sections` AS s ON d.Section=s._ID WHERE d.Account="'+result.PID+'"'
      allWorkerSection = GetData(sql)

      var sess = new Object()
      sess.Authorization = true
      sess.PID = result.PID
      sess.Firstname = result.Firstname
      sess.Lastname = result.Lastname
      sess.Permissions = result.Permissions
      sess.Admin =  admin
      sess.Section = result.Section
      sess.SectionName = result.SectionName
      sess.AllWorkerSections = allWorkerSection
      sess.CID = result.CID
      sess.Name = result.Name
      sess.EndWarning = warning
      sess.EndDanger = danger
      sess.Account = result.Account
      sess.AddAccounts = adaccounts
      sess.UnlimitedAccount = unlimitedaccount
      sess.Reports = report
      sess.Attachments = result.Attachment
      sess.AddAttachments = addattachment
      sess.UnlimitedAttachments = unlimitedattachments
      sess.Notifications = notifications
      sess.Complaints = result.Complaints
      sess.AddComplaints = addcomplaints
      sess.Thumbnail = Thumbnail

      res.send(sess)
    }else{ res.send("e") }
  }
})
app.get('/v1/1/varifylogin', (req,res) => {
  if(req.query.API!=undefined && req.query.PID!=undefined && req.query.CID!=undefined && req.query.FirstName!=undefined){
    const sql='SELECT COUNT(*) AS COUNT FROM accounts, api WHERE accounts.`_ID`="'+req.query.PID+'" AND `Company`="'+req.query.CID+'" AND `Firstname`="'+req.query.FirstName+'" AND api.Key="'+req.query.API+'"'
    const result = GetData(sql)

    if(result[0].COUNT==1){ res.send({ "Aut": true }) }
    else{ res.send({ "Aut": false }) }
  }else{
    res.send({ "Aut": false })
  }
})
app.get('/v1/1/relogin', (req, res) => {
  if(req.query.API!=undefined && req.query.PID!=undefined && req.query.CID!=undefined){
    let secountParty = false, subscription = false

    let sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints, MAX(s.End) AS MAX, se.Name AS "SectionName" FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company JOIN `sections` AS se ON a.Section=se._ID WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND CURRENT_DATE()>=s.Start AND CURRENT_DATE()<=s.End'
    var result = GetOneData(sql)
    if(result.PID!=null){ secountParty = true; subscription=true; }
    else{
      // nieaktywna z sekcją
      sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints, se.Name AS "SectionName" FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company JOIN `sections` AS se ON a.Section=se._ID WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND s.End<CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
      result = GetOneData(sql)
      if(result.PID!=null){ secountParty=true }
      else{ 
        // aktywana bez sekcji
        sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND s.End>CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
        result = GetOneData(sql)
        if(result.PID!=null){ secountParty=true; subscription=true; }
        else{ 
          // nieaktywny bez sekcji
          sql='SELECT a._ID AS PID, a.Section, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND s.End<CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
          result = GetOneData(sql)
          if(result.PID!=null){ secountParty=true }
          else{ secountParty=false }
        }
      }
    }

    if(secountParty){
      var admin = false
      if(result.Permissions==1){ admin=true }

      var Thumbnail = "https://img.icons8.com/color/48/000000/user-male-circle--v1.png"
      if(result.Thumbnail!=null){ Thumbnail="http://localhost:8082/thumbnail/"+result.Thumbnail }

      var danger = true
      var warning = false
      var adaccounts = false
      var report = false
      var addattachment = false
      var unlimitedaccount = false
      var unlimitedattachments = false
      var notifications = false
      var addcomplaints = false

      if(subscription){
        sql='SELECT COUNT(*) AS quantity  FROM `accounts`  WHERE `Company`="'+result.CID+'"   UNION  SELECT COUNT(*) AS quantity  FROM `complaints` as c  WHERE Added_date>"'+result.Start+'" AND Added_date<="'+result.End+'" AND c.Company="'+result.CID+'"'
        var minires = GetData(sql)
        if(minires[0].quantity<result.Account){ adaccounts=true }
        if(minires[1].quantity<result.Complaints){ addcomplaints=true }

        if(result.Account==9999){ unlimitedaccount=true }
        if(result.Report==1){ report=true }
        if(result.Attachment>0){ addattachment=true }
        if(result.Attachment==9999){ unlimitedattachments=true }
        if(result.Notifications>0){ notifications=true }

        var data1=new Date(result.MAX)
        var data2=new Date(result.Today)
        var dni = data1 - data2
        dni = Math.floor(dni/(1000*60*60*24));
        if(dni <= 14 && dni >= 0){ warning=true }
      }

      sql='SELECT s._ID, s.Name FROM `departments` AS d JOIN `sections` AS s ON d.Section=s._ID WHERE d.Account="'+result.PID+'"'
      allWorkerSection = GetData(sql)

      var sess = new Object()
      sess.Authorization = true
      sess.PID = result.PID
      sess.Firstname = result.Firstname
      sess.Lastname = result.Lastname
      sess.Permissions = result.Permissions
      sess.Admin =  admin
      sess.Section = result.Section
      sess.SectionName = result.SectionName
      sess.AllWorkerSections = allWorkerSection
      sess.CID = result.CID
      sess.Name = result.Name
      sess.EndWarning = warning
      sess.EndDanger = danger
      sess.Account = result.Account
      sess.AddAccounts = adaccounts
      sess.UnlimitedAccount = unlimitedaccount
      sess.Reports = report
      sess.Attachments = result.Attachment
      sess.AddAttachments = addattachment
      sess.UnlimitedAttachments = unlimitedattachments
      sess.Notifications = notifications
      sess.Complaints = result.Complaints
      sess.AddComplaints = addcomplaints
      sess.Thumbnail = Thumbnail

      res.send(sess)
    }else{ res.send("e") }
  }
})

// ustawienia kont
app.get('/v1/1/setdefaultthumbnail', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    var sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'UPDATE `accounts` SET `Thumbnail`=NULL WHERE `_ID`="'+req.query.PID+'" AND `Company`="'+req.query.CID+'"'
      GetData(sql)
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/editaccount', (req, res) => {
  console.log(req.query)
  if(
    req.query.API!=undefined && 
    req.query.CID!=undefined && 
    req.query.AID!=undefined && 
    req.query.Login!=undefined && 
    req.query.Email!=undefined && 
    req.query.Password!=undefined && 
    req.query.Firstname!=undefined && 
    req.query.Lastname!=undefined && 
    req.query.Section!=undefined && 
    req.query.Permissions!=undefined){
    console.log("ins")
    let sql = 'SELECT s._ID AS SectionID FROM `sections` AS s, `api`, `accounts` AS a WHERE s.`Name`="'+req.query.Section+'" AND s.`Company`="'+req.query.CID+'" AND api.Key="'+req.query.API+'" AND a._ID=1 AND a.Company="'+req.query.CID+'" AND s.Company=a.Company'
    const section = GetOneData(sql).SectionID
    
    sql='UPDATE `accounts` SET `Login` = "'+req.query.Login+'", `Email` = "'+req.query.Email+'", `Password` = "'+req.query.Password+'", `Firstname` = "'+req.query.Firstname+'", `Lastname` = "'+req.query.Lastname+'", `Permissions` = "'+req.query.Permissions+'", `Section` = "'+section+'" WHERE `accounts`.`_ID` = "'+req.query.AID+'" AND `accounts`.`Company`="'+req.query.CID+'"'
    GetData(sql)
    res.send("ok")
  }else { res.send("e"); console.log("e1"); }
})
app.get('/v1/1/accountslist', async (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    let sql = 'SELECT COUNT(*) AS COUNT FROM `accounts` AS a LEFT JOIN `sections` AS s ON a.Section=s._ID, `api` WHERE a._ID NOT IN ("'+req.query.PID+'") AND a.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    if(req.query.NextFrom!=undefined){ sql+=' AND a._ID>"'+req.query.NextFrom+'"' }
    const Quality = GetOneData(sql).COUNT
    
    sql='SELECT a._ID, a.Login, a.Email, a.Password, a.Firstname, a.Lastname, a.Permissions, s.Name AS Section FROM `accounts` AS a LEFT JOIN `sections` AS s ON a.Section=s._ID, `api` WHERE a._ID NOT IN ("'+req.query.PID+'") AND a.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    if(req.query.NextFrom!=undefined){ sql+=' AND a._ID>"'+req.query.NextFrom+'"' }
    sql+=' LIMIT 10'

    var result = await GetData(sql)
    for(let a = 0; a<result.length; a++) {
      sql='SELECT s.Name, s._ID FROM `departments` AS d JOIN `sections` AS s ON d.Section=s._ID WHERE d.Account="'+result[a]._ID+'" AND d.Company="'+req.query.CID+'" AND s.Name NOT IN ("'+result[a].Section+'")'
      result[a].sectionsList = GetData(sql)
    }

    if(Quality>10){
      result[0].NextFrom=result[result.length-1]._ID
      result[0].Next=true
    }else{ result[0].Next=false }

    res.send(result)
  }else{ res.send("e") }
})
app.get('/v1/1/addaccounts', (req, res) => {
  if(req.query.API!=undefined && req.query.PID!=undefined && req.query.CID!=undefined && req.query.Login!=undefined && req.query.Email!=undefined && req.query.Password!=undefined && req.query.permission!=undefined && req.query.section!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = `INSERT INTO \`accounts\` (\`Login\`, \`Email\`, \`Password\`, \`Firstname\`, \`Lastname\`, \`Permissions\`, \`Company\`, \`Thumbnail\`, \`Section\`) VALUES ("${req.query.Login}", "${req.query.Email}", "${req.query.Password}", ${(req.query.Firstname != "" ? '"'+req.query.Firstname+'"' : NULL)}, ${req.query.Lastname != "" ? '"'+req.query.Lastname+'"' : NULL}, "${req.query.permission}", "${req.query.CID}", NULL, "${req.query.section}");`
      GetData(sql)

      sql='SELECT _ID FROM `accounts` WHERE `Login`="'+req.query.Login+'" AND `Email`="'+req.query.Email+'" AND `Password`="'+req.query.Password+'" AND `Company`="'+req.query.CID+'" ORDER BY `_ID`DESC'
      sql = ' INSERT INTO departments (Section, Account, Company) VALUES ("'+req.query.section+'", "'+GetOneData(sql)._ID+'", "'+req.query.CID+'");'
      GetData(sql)

      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/accountinfo', (req, res) => {
  if(req.query.API !=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    var sql='SELECT `Login`, `Email`, `Firstname`, `Lastname` FROM `accounts`, `api` WHERE api.Key="'+req.query.API+'" AND accounts._ID="'+req.query.PID+'" AND `Company`="'+req.query.CID+'"'
    var result = GetOneData(sql)
    if(result.Login==null){ result.Login='' }
    if(result.Email==null){ result.Email='' }
    if(result.Firstname==null){ result.Firstname='' }
    if(result.Lastname==null){ result.Lastname='' }
    res.send(result)
  }else{ res.send("e") }
})
app.get('/v1/1/updateaccount', (req, res) => {
  if(req.query.API !=undefined && req.query.CID!=undefined && req.query.PID!=undefined && req.query.Login!=undefined && req.query.Email!=undefined && req.query.Password!=undefined && req.query.Firstname!=undefined && req.query.Lastname!=undefined){
    var sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      if(req.query.Password==''){ sql='UPDATE `accounts` SET `Login`="'+req.query.Login+'",`Email`="'+req.query.Email+'",`Firstname`="'+req.query.Firstname+'",`Lastname`="'+req.query.Lastname+'" WHERE `Company`="'+req.query.CID+'" AND `_ID`="'+req.query.PID+'"' }
      else{ sql='UPDATE `accounts` SET `Login`="'+req.query.Login+'",`Email`="'+req.query.Email+'",`Password`="'+req.query.Password+'",`Firstname`="'+req.query.Firstname+'",`Lastname`="'+req.query.Lastname+'" WHERE `Company`="'+req.query.CID+'" AND `_ID`="'+req.query.PID+'"' }
      GetData(sql)
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.post('/v1/1/uploadthumbnail', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    var sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      let sampleFile = req.files.file
      var fn = Date.now() + "_" +sampleFile.name
      sampleFile.mv('./public/thumbnail/'+fn, function(err) { if (err){ return res.status(500).send(err); } });
    
      let sql = 'SELECT `Thumbnail` FROM `accounts` WHERE `_ID`="'+req.query.PID+'" AND `Company`="'+req.query.CID+'"'
      const Thumbnail = GetOneData(sql).Thumbnail

      sql = 'UPDATE `accounts` SET `Thumbnail` = "'+fn+'" WHERE `_ID`="'+req.query.PID+'" AND  `Company`="'+req.query.CID+'"'
      GetData(sql)
      if(Thumbnail!=null){ fs.unlinkSync('./public/thumbnail/'+Thumbnail) }
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})

// dane firmy
app.get('/v1/1/copmanydata', (req, res) => {
  if(req.query.API!=undefined && req.query.PID!=undefined && req.query.CID!=undefined){
    var sql= ' SELECT c.Name, c.NIP, c.Email, c.Phone, c.Adress FROM `accounts` AS a JOIN `company` AS c ON a.Company=c._ID, `api` WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'

    res.send(GetOneData(sql))
  }else{ res.send("e") }
})
app.get('/v1/1/editcompany', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.NIP!=undefined && req.query.Email!=undefined && req.query.Phone!=undefined && req.query.Adress!=undefined && req.query.Section!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'UPDATE `company` SET `Name` = "'+req.query.Name+'", `NIP` = "'+req.query.NIP+'", `Email` = "'+req.query.Email+'", `Phone` = "'+req.query.Phone+'", `Adress` = "'+req.query.Adress+'", `Section` = "'+req.query.Section+'" WHERE `company`.`_ID` = "'+req.query.CID+'"';
      GetData(sql)
      res.send("ok")
    }
  }else{ res.send("e") }
})

// logo firmy
app.get('/v1/1/getcompanylogo', (req, res) => {
  if(req.query.API!=undefined && req.query.PID!=undefined && req.query.CID!=undefined){
    var sql='SELECT c.Logo FROM `accounts` AS a JOIN `company` AS c ON a.Company=c._ID, `api` WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND api.Key="'+req.query.API+'";'

    res.send("http://localhost:8082/logo/"+GetOneData(sql).Logo)
  }else{ res.send("e") }
})
app.post('/v1/1/uploadlogo', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    let sampleFile = req.files.file
    var fn = Date.now() + "_" +sampleFile.name
    sampleFile.mv('./public/logo/'+fn, function(err) { if (err){ return res.status(500).send(err); } });
    
    let sql = 'SELECT `Logo` FROM `company` AS c JOIN `accounts` AS a ON a.Company=c._ID, `api` WHERE c._ID="'+req.query.CID+'" AND a._ID="'+req.query.PID+'" AND api.Key="'+req.query.API+'"'
    const Logo = GetData(sql)
    if(Logo.length==1){
      sql = 'UPDATE `company` AS c JOIN `accounts` AS a ON a.Company=c._ID, `api` SET c.Logo="'+fn+'" WHERE c._ID="'+req.query.CID+'" AND a._ID="'+req.query.PID+'" AND api.Key="'+req.query.API+'"'
      GetData(sql)
      if(Logo[0].Logo!=null){ fs.unlinkSync('./public/logo/'+Logo[0].Logo) }
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})

// sekcje
app.get('/v1/1/sectionlist', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined){
    sql='SELECT s.`Name`, s._ID FROM company AS c JOIN sections AS s ON c.Section=s._ID, api WHERE c._ID="'+req.query.CID+'" AND api.Key="'+req.query.API+'" UNION SELECT s.`Name`, s._ID FROM `sections` AS s, api WHERE `s`.`Company`="'+req.query.CID+'" AND s._ID NOT IN (SELECT `Section` FROM company WHERE _ID="'+req.query.CID+'") AND api.Key="'+req.query.API+'";'
    res.send(GetData(sql))
  }else{ res.send("e") }
})
app.get('/v1/1/workerinsection', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.SID!=undefined){
    let sql='SELECT a._ID, a.Firstname, a.Lastname, ( SELECT COUNT(*) FROM departments as de WHERE de.Account=a._ID AND de.Company="'+req.query.CID+'") AS instance FROM `departments` AS d JOIN accounts AS a ON d.Account=a._ID, api WHERE d.Section="'+req.query.SID+'" AND d.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    res.send(GetData(sql))
  }else{ res.send("e") }
})
app.get('/v1/1/workernotinsection', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.SID!=undefined){
    let sql='SELECT a._ID, a.Firstname, a.Firstname, ( SELECT COUNT(*) FROM departments as de WHERE de.Account=a._ID AND de.Company="'+req.query.CID+'") AS instance FROM `departments` AS d JOIN accounts AS a ON d.Account=a._ID, api WHERE d.Section="'+req.query.SID+'" AND d.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    const result = GetData(sql)

    sql='SELECT a._ID, a.Firstname, a.Firstname, ( SELECT COUNT(*) FROM departments as de WHERE de.Account=a._ID AND de.Company="'+req.query.CID+'") AS instance FROM `accounts` AS a, `api` WHERE `Company`="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    const allworker = GetData(sql)

    for (const iterator of result) {
      for(let a = 0; a<allworker.length; a++){
        if(allworker[a]._ID == iterator._ID){
          allworker.splice(a, 1)
        }
      }
    }

    res.send(allworker)
  }else{ res.send("e") }
})
app.get('/v1/1/addnewsecton', (req, res) => {
  if(req.query.CID!=undefined && req.query.Name!=undefined && req.query.API!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'INSERT INTO `sections` (`Name`, `Company`) VALUES ("'+req.query.Name+'", "'+req.query.CID+'");'
      GetData(sql)
      res.send("ok")
    }else { res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/delatesection', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.SID!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'DELETE FROM `sections` WHERE `_ID` = "'+req.query.SID+'" AND Company="'+req.query.CID+'"'
      GetData(sql)
      res.send("ok")
    }else { res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/editsectioname', (req, res) => {
  if(req.query.API!=undefined && req.query.Name!=undefined && req.query.CID!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'UPDATE `sections` SET `Name` = "'+req.query.Name+'" WHERE `_ID` = "'+req.query.SID+'";'
      GetData(sql)
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/updateworkerinsection', (req, res) => {
  if(req.query.API!=undefined && req.query.SID!=undefined && req.query.CID!=undefined && req.query.Changes!=undefined){
    let sql='SELECT a._ID, ( SELECT COUNT(*) FROM departments as de WHERE de.Account=a._ID AND de.Company="'+req.query.CID+'") AS instance FROM `departments` AS d JOIN accounts AS a ON d.Account=a._ID, api WHERE d.Section="'+req.query.SID+'" AND d.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    const inSection = GetData(sql)

    let out = []
    let add = []
    for (const change of req.query.Changes) {
      var stat = false
      for (const insideSection of inSection) {
        if(change==(insideSection._ID)){
          out.push(change)
          console.log("\ntrue")
          stat = true
        }
      }
      if(!stat){ add.push(change) }
    }

    if(add.length>0){
      sql = 'INSERT INTO `departments`(`Section`, `Account`, `Company`) VALUES '
      sql += '("'+req.query.SID+'","'+add[0]+'","'+req.query.CID+'")'

      if(add.length>1){
        for(let a = 1; a<add.length; a++){
          sql += ', ("'+req.query.SID+'","'+add[a]+'","'+req.query.CID+'")'
        }
      }
      GetData(sql)
    }

    if(out.length>0){
      sql = 'DELETE FROM `departments` WHERE `Account` IN ('+out+') AND `Company`="'+req.query.CID+'" AND `Section`="'+req.query.SID+'"'
      GetData(sql)
    }

    res.send("ok")
  }else{
    res.send("e")
  }
})
app.get('/v1/1/sectionslist', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    let sql='SELECT s.* FROM `accounts` AS a JOIN `company` AS c ON c._ID=a.Company JOIN `sections` AS s ON s.Company=c._ID, `api` WHERE a._ID="'+req.query.PID+'" AND c._ID="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    res.send(GetData(sql))
  }else{ res.send("e") }
})

// subskrypcja
app.get('/v1/1/getactualplan', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined){
    let sql = 'SELECT `Plan` FROM `subscription`, `api` WHERE `Company`="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    let Actual = GetOneData(sql).Plan
    let Other = ["Pro", "Custom", "Basic"]
    if(Other.indexOf(Actual)!=-1){ Other.splice(Other.indexOf(Actual), 1) }
    res.send({
      Actual: Actual,
      Other: Other,
      First: Actual
    })
  }else{ res.send("e") }
})
app.get('/v1/1/updateactualplan', (req, res) => {
  console.log(req.query);
  if(req.query.API!=undefined && req.query.PID!=undefined && req.query.CID!=undefined && req.query.Plan!=undefined && req.query.AccountsQuality!=undefined && req.query.AttachmentsQuality!=undefined && req.query.Notyfication!=undefined && req.query.Statistic!=undefined && req.query.Other!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'INSERT INTO `operations` (`Date`, `CID`, `PID`, `Type`, `Data1`, `Data2`, `Data3`, `Data4`, `Data5`, `Data6`, `Data7`, `Status`) VALUES (current_timestamp(), "'+req.query.CID+'", "'+req.query.PID+'", "2", "'+req.query.Plan+'", "'+req.query.AccountsQuality+'", "'+req.query.AttachmentsQuality+'", "'+req.query.Notyfication+'", "'+req.query.Statistic+'", "'+req.query.Other+'", NULL, "1")'
      GetOneData(sql)
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/extensionsubscription', (req, res) => { 
  if(req.query.API!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'INSERT INTO `operations` (`Date`, `CID`, `PID`, `Type`, `Data1`, `Data2`, `Data3`, `Data4`, `Data5`, `Data6`, `Data7`, `Status`) VALUES (current_timestamp(), "'+req.query.CID+'", "'+req.query.PID+'", "3", "'+req.query.Plan+'", "'+req.query.AccountsQuality+'", "'+req.query.AttachmentsQuality+'", "'+req.query.Notyfication+'", "'+req.query.Statistic+'", "'+req.query.Other+'", "'+req.query.ExtensionTime+'", "1")'
      GetOneData(sql)
      res.send("ok")
    }else{ res.send("e") }
  }
})
app.get('/v1/1/getfuturesubscription', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined){
    let sql = 'SELECT s.`_ID`, s.`Start` AS "From", s.`End` AS "To" FROM `subscription` AS s, `api` WHERE `End`>CURRENT_TIMESTAMP() AND `Company`="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    const result = GetData(sql)
    let final = []
    for (const item of result) {
      final.push({
        _ID: item._ID,
        From: item.From.slice(0, 10),
        To: item.To.slice(0, 10)
      })
    }
    res.send(final)
  }else{ res.send("e") }
})
app.get('/v1/1/getsubscription', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined){
    let sql = 'SELECT s.`_ID`, s.`Start` AS "From", s.`End` AS "To", s.Plan, s.Account, s.Report, s.Attachment, s.Notifications, s.Complaints, CURRENT_DATE() AS Today FROM `subscription` AS s, `api` WHERE `Company`="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    const result = GetData(sql)
    let final = []
    for (const item of result) {
      final.push({
        _ID: item._ID,
        From: item.From.slice(0, 10),
        To: item.To.slice(0, 10),
        Plan: item.Plan,
        AccountsQuality: item.Account,
        Statistic: item.Report,
        Notyfication: item.Notifications,
        AttachmentsQuality: item.Attachment,
        ComplaintsQuality: item.Complaints,
        Actual: (item.End>=item.Today && item.Start<item.Today ? true : false)
      })
    }
    console.log(final)
    res.send(final)
  }else{ res.send("e") }
})
app.get('/v1/1/addcomplaint', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.addComplaint!=undefined && req.query.SID!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql = 'INSERT INTO `operations` (`Date`, `CID`, `Type`, `Data1`, `Data2`) VALUES (current_timestamp(), "'+req.query.CID+'", 4, "'+req.query.SID+'", "'+req.query.addComplaint+'")'
      console.log(sql)
      GetData(sql)
      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})

// reklamacje
app.get('/v1/1/complaintaddmodel', (req, res) => {
  if(req.query.API!=undefined && req.query.RID!=undefined && req.query.RID!=undefined && req.query.CID!=undefined){
    var sql='SELECT models._ID FROM `models`, `api` WHERE models.`_ID`="'+req.query.RID+'" AND api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql='UPDATE `complaints` SET `Model`="'+req.query.RID+'" WHERE `_ID`="'+req.query.RID+'" AND `Company`="'+req.query.CID+'"'
      GetOneData(sql)

      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/complaintinfo', (req, res) => {
  console.log(req.query)
  if(req.query.API!=undefined && req.query.RID!=undefined && req.query.CID!=undefined && req.query.PID!=undefined){
    var sql='SELECT c._ID, c.Firstname, c.Lastname, c.Phone, c.Email, c.Description, c.Serial_no, c.Purchase_number, c.Type, c.ToAmount, c.Expectations, c.Comments, c.Code, c.Complaint_number, c.Purchase_date, c.Damage_date, c.Notification, s.Status, m.Model, m.SKU, ma.Manufacturer, se.Name AS Section FROM `complaints` AS c JOIN `status` AS s ON c.Status=s._ID LEFT JOIN `models` AS m ON c.Model=m._ID LEFT JOIN `manufacturers` AS ma ON m.Manufacturer=ma._ID JOIN accounts AS a ON c.Company=a.Company JOIN `sections` AS se ON c.Section=se._ID, `api` WHERE api.Key="'+req.query.API+'" AND c._ID="'+req.query.RID+'" AND c.Company="'+req.query.CID+'" AND a._ID="'+req.query.PID+'";'
    let response = GetOneData(sql)

    if(response.Firstname==null){ response.Firstname="" }
    if(response.Lastname==null){ response.Lastname="" }
    if(response.Phone==null){ response.Phone="" }
    if(response.Email==null){ response.Email="" }
    if(response.Description==null){ response.Description="" }
    if(response.Serial_no==null){ response.Serial_no="" }
    if(response.Purchase_number==null){ response.Purchase_number="" }
    if(response.Comments==null){ response.Comments="" }
    if(response.Notification==null){ response.Notification=0 }

    if(response.Type=="0"){ response.Type = "Gwarancyjna" }
    if(response.Type=="1"){ response.Type = "Pogwarancyjna do kwoty "+response.ToAmount }
    if(response.Type=="2"){ response.Type = "Wewnętrzna" }
    if(response.Type=="3"){ response.Type = "Rękojmia" }

    if(response.Expectations==null){ response.Expectations = "Brak" }
    if(response.Expectations=="0"){ response.Expectations = "Naprawa" }
    if(response.Expectations=="1"){ response.Expectations = "Wymiana" }
    if(response.Expectations=="2"){ response.Expectations = "Zwrot (gotówki)" }

    if(response.Damage_date!=null){ response.Damage_date = new Date(response.Damage_date); }
    if(response.Purchase_date!=null){ response.Purchase_date = new Date(response.Purchase_date) }
    
    res.send(response)
  }else{
    res.send("e")
  }
})
app.get('/v1/1/sendnotification', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.RID!=undefined){
    var sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql='UPDATE `complaints` SET `SendNotification`=1 WHERE `Company`="'+req.query.CID+'" AND `_ID`="'+req.query.RID+'"'
      GetOneData(sql)

      res.send("ok")
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/complaintupdate', (req, res) => {
  if(
    req.query.API!=undefined &&
    req.query.RID!=undefined &&
    req.query.CID!=undefined &&
    req.query.PID!=undefined &&
    req.query.Firstname!=undefined &&
    req.query.Lastname!=undefined &&
    req.query.Phone!=undefined &&
    req.query.Email!=undefined &&
    req.query.Description!=undefined &&
    req.query.Serial_no!=undefined &&
    req.query.Purchase_number!=undefined &&
    req.query.Purchase_date!=undefined &&
    req.query.Damage_date!=undefined &&
    req.query.Comments!=undefined &&
    req.query.Notification!=undefined &&
    req.query.Status!=undefined &&
    req.query.Section!=undefined
  ){
    var sql='SELECT `Company` FROM `accounts`, `api` WHERE accounts.`_ID`="'+req.query.PID+'" AND api.Key="'+req.query.API+'"'
    
    var resu = GetData(sql)
    if(resu.length==1 && resu[0].Company==req.query.CID){
      if(req.query.Notification=="true"){ req.query.Notification=1 }
      else{ req.query.Notification=0 }

      var sql = 'SELECT _ID FROM `status` WHERE `Status`="'+req.query.Status+'"'
      req.query.Status = GetOneData(sql)._ID
      
      sql='SELECT _ID FROM `sections` WHERE `Name`="'+req.query.Section+'" AND `Company`="'+req.query.CID+'"'
      req.query.Section = GetOneData(sql)._ID
      
      if(req.query.Firstname==""){ req.query.Firstname="Ti9E" }
      if(req.query.Lastname==""){ req.query.Lastname="Ti9E" }
      if(req.query.Phone==""){ req.query.Phone="Ti9E" }
      
      sql='UPDATE `complaints` SET `Status` = "'+req.query.Status+'", `Section` = "'+req.query.Section+'", `Firstname` = "'+req.query.Firstname+'", `Lastname` = "'+req.query.Lastname+'", `Phone` = "'+req.query.Phone+'", `Email` = "'+req.query.Email+'", `Description` = "'+req.query.Description+'", `Serial_no` = "'+req.query.Serial_no+'", `Purchase_number` = "'+req.query.Purchase_number+'", `Comments` = "'+req.query.Comments+'", `Purchase_date` = "'+req.query.Purchase_date+'", `Damage_date` = "'+req.query.Damage_date+'", `Notification` = "'+req.query.Notification+'"'

      var next = false
      if(req.query.Model!=null){
        msql='SELECT `Model` FROM `complaints`  WHERE `_ID` = "'+req.query.RID+'" AND `Company`="'+req.query.CID+'"'
        if(GetOneData(msql).Model==null){
          msql='SELECT _ID FROM `models` WHERE `Model`="'+req.query.Model.split(" => ")[0]+'"'
          if(GetData(msql).length==1){ sql+=', Model="'+GetOneData(msql)._ID+'"' }
          else{ next=true }
        }
      }

      sql+=' WHERE `complaints`.`_ID` = "'+req.query.RID+'" AND `complaints`.`Company`="'+req.query.CID+'"'

      GetOneData(sql)
      if(next){
        res.send({
          query: req.query.Model,
          navChangePosition: 12
        })
      }else{ res.send("ok") }
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.post('/v1/1/upload/addattachment', (req, res) => {
  if (req.files && req.query.RID!=undefined && req.query.CID!=undefined && req.query.PID!=undefined && req.query.API!=undefined){
    let sql = 'SELECT _ID FROM `api` WHERE `Key`="'+req.query.API+'" AND `Active`=1'
    if(GetData(sql).length==1){
      var po = req.files.file
      if(Array.isArray(po)){
        var uploadAll = true
        sql='SELECT s.Attachment FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company  WHERE a._ID="'+req.query.PID+'" AND a.Company="'+req.query.CID+'" AND s.Start<CURRENT_TIMESTAMP() AND s.End>=CURRENT_TIMESTAMP();'
        const result = GetOneData(sql)
        
        for(let a = 0; a<req.files.file.length; a++){
          if(a < result.Attachment){
            let sampleFile = req.files.file[a]
            var fn = Date.now() + "_" +sampleFile.name
            sampleFile.mv('./public/attachment/'+fn, function(err) { if (err){ return res.status(500).send(err); } });
            sql='INSERT INTO `attachment` (`Company`, `Date`, `Complaints`, `Path`) VALUES ("'+req.query.CID+'", current_timestamp(), "'+req.query.RID+'", "/attachment/'+fn+'");'
            GetData(sql)
          }else{
            uploadAll = false
          }
        }

        res.send("ok")
      }else{
        var uploadAll = false
        sql='SELECT s.Attachment FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company  WHERE a._ID="'+req.query.PID+'" AND a.Company="'+req.query.CID+'" AND s.Start<CURRENT_TIMESTAMP() AND s.End>=CURRENT_TIMESTAMP();'
        const result = GetData(sql)

        if(result[0].Attachment>=1){
          uploadAll = true
          let sampleFile = req.files.file
          var fn = Date.now() + "_" +sampleFile.name
          sampleFile.mv('./public/attachment/'+fn, function(err) { if (err){ return res.status(500).send(err); } });
          sql='INSERT INTO `attachment` (`_ID`, `Company`, `Date`, `Complaints`, `Path`) VALUES (NULL, "'+req.query.CID+'", current_timestamp(), "'+req.query.RID+'", "attachment/'+fn+'");'
          GetData(sql)
        }

        res.send("ok")
      }
    }else{ res.send("e")}
  }else{ res.send("e") }
})
app.post('/v1/1/upload/attachment', (req, res) => {
  if (req.files && req.query.RID!=undefined && req.query.CID!=undefined && req.query.PID!=undefined && req.query.Code!=undefined && req.query.API!=undefined && req.query.nextSteps!=undefined){
    var sql = 'SELECT _ID FROM `api` WHERE `Key`="'+req.query.API+'" AND `Active`=1'
    if(GetData(sql).length!=1){ res.send({succes: false, uploadAll: false, nextSteps: req.query.nextSteps}); }
    else{
      var po = req.files.file
      if(Array.isArray(po)){
        var uploadAll = true
        var sql='SELECT s.Attachment FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company  WHERE a._ID="'+req.query.PID+'" AND a.Company="'+req.query.CID+'" AND s.Start<CURRENT_TIMESTAMP() AND s.End>=CURRENT_TIMESTAMP();'
        const result = GetOneData(sql)
        
        for(let a = 0; a<req.files.file.length; a++){
          if(a < result.Attachment){
            let sampleFile = req.files.file[a]
            var fn = Date.now() + "_" +sampleFile.name
            sampleFile.mv('./public/attachment/'+fn, function(err) { if (err){ return res.status(500).send(err); } });
            sql='INSERT INTO `attachment` (`_ID`, `Company`, `Date`, `Complaints`, `Path`) VALUES (NULL, "'+req.query.CID+'", current_timestamp(), "'+req.query.RID+'", "/attachment/'+fn+'");'
            GetData(sql)
          }else{
            uploadAll = false
          }
        }

        res.send({ succes: true, uploadAll: uploadAll, nextSteps: req.query.nextSteps })
      }else{
        var uploadAll = false
        var sql='SELECT s.Attachment FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company  WHERE a._ID="'+req.query.PID+'" AND a.Company="'+req.query.CID+'" AND s.Start<CURRENT_TIMESTAMP() AND s.End>=CURRENT_TIMESTAMP();'
        const result = GetData(sql)

        if(result[0].Attachment>=1){
          uploadAll = true
          let sampleFile = req.files.file
          var fn = Date.now() + "_" +sampleFile.name
          sampleFile.mv('./public/attachment/'+fn, function(err) { if (err){ return res.status(500).send(err); } });
          sql='INSERT INTO `attachment` (`_ID`, `Company`, `Date`, `Complaints`, `Path`) VALUES (NULL, "'+req.query.CID+'", current_timestamp(), "'+req.query.RID+'", "/attachment/'+fn+'");'
          GetData(sql)
        }

        res.send({ succes: true, uploadAll: uploadAll, nextSteps: req.query.nextSteps })
      }
    }
  }else{
    res.send({ succes: false, uploadAll: false, nextSteps: req.query.nextSteps })
  }
})
app.get('/v1/1/EasyComplaintList', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.Type!=undefined && req.query.From!=undefined && req.query.Limit!=undefined){
    var msql='SELECT COUNT(*) AS COUNT FROM `complaints` AS c JOIN `status` AS s ON c.Status=s._ID, api WHERE c.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'" '
    
    sql='SELECT c._ID, c.Firstname, c.Lastname, c.Complaint_number, m.Model, ma.Manufacturer, se.Name, s.Status, s.Locking, s.ToPickUp FROM `complaints` AS c LEFT JOIN `models` as m ON c.Model=m._ID LEFT JOIN `manufacturers` AS ma ON m.Manufacturer=ma._ID JOIN `sections` AS se ON c.Section=se._ID JOIN `status` AS s ON c.Status=s._ID, api WHERE c.Company="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    if(req.query.From!=-1){
      sql+=' AND c._ID > '+req.query.From
      msql+=' AND c._ID > '+req.query.From
    }

    if(req.query.FromDate!=null){
      sql+=' AND c.Added_date >= "'+req.query.FromDate+'"'
      msql+=' AND c.Added_date >= "'+req.query.FromDate+'"'
    }
    if(req.query.ToDate!=null){
      sql+=' AND c.Added_date <= "'+req.query.ToDate+'"'
      msql+=' AND c.Added_date <= "'+req.query.ToDate+'"'
    }

    if(req.query.Type==1){ sql+=' AND s._ID IN (1)'; msql+=' AND s._ID IN (1)'; }
    if(req.query.Type==2){ sql+=' AND s._ID IN (2)'; msql+=' AND s._ID IN (2)'; }
    if(req.query.Type==3){ sql+=' AND s.ToPickUp=1'; msql+=' AND s.ToPickUp=1'; }
    if(req.query.Type==4){ sql+=' AND s.Locking=1'; msql+=' AND s.Locking=1'; }


    var Limit=false
    if(req.query.Limit!=-1){
      sql+=' LIMIT '+req.query.Limit
      Limit=true
    }else{ sql+=' LIMIT 100' }

    var cc = GetOneData(msql).COUNT
    var nextSelect = false

    console.log(sql)
    console.log(msql)

    if(Limit){
      if(cc>req.query.Limit){ nextSelect=true }
    }else{
      if(cc>100){ nextSelect=true }
    }

    const result = GetData(sql)
    if(nextSelect){
      res.send({
        Data: result,
        nextSelect: true,
        nextQuery: {
          API: "ABC",
          CID: +req.query.CID,
          Type: +req.query.Type,
          From: +result[result.length-1]._ID,
          Limit: +req.query.Limit,
          FromDate: req.query.FromDate,
          ToDate: req.query.ToDate
        }
      })
    }else{
      res.send({
        Data: GetData(sql),
        nextSelect: false,
        nextQuery: {}
      })
    }
  }
})
app.get('/v1/1/getattachments', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.RID!=undefined){
    let sql = 'SELECT attachment.`_ID`, `Path` FROM `attachment`, `api` WHERE `Complaints`="'+req.query.RID+'" AND `Company`="'+req.query.CID+'" AND api.Key="'+req.query.API+'"'
    console.log(sql)
    res.send(GetData(sql))
  }else{ res.send("e") }
})
app.get('/v1/1/editcreatemodel', (req, res) => {
  console.log(req.query)
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.RID!=undefined && req.query.Model!=undefined && req.query.Manufacter!=undefined && req.query.SKU!=undefined){
    sql = 'SELECT _ID FROM `manufacturers` WHERE `Manufacturer`="'+req.query.Manufacter+'"'
    let Manufacter = GetData(sql)
    if(Manufacter.length != 1){
      sql = 'INSERT INTO `manufacturers` (`Manufacturer`, `State`, `Curier`, `Servis`, `Complaint_card`, `Type`) VALUES ("'+req.query.Manufacter+'", "1", NULL, NULL, NULL, 0)'
      GetOneData(sql)
      
      sql = 'SELECT _ID FROM `manufacturers` WHERE `Manufacturer`="'+req.query.Manufacter+'"'
      Manufacter = GetOneData(sql)._ID
    }else{ Manufacter = Manufacter[0]._ID }

    sql = 'SELECT _ID FROM `models` WHERE `Manufacturer`="'+Manufacter+'" AND `Model`="'+req.query.Model+'"'
    let Model = GetData(sql)
    if(Model.length!=1){
      sql = 'INSERT INTO `models` (`Manufacturer`, `Model`, `SKU`, `State`) VALUES ("'+Manufacter+'", "'+req.query.Model+'", '+(req.query.SKU=="" ? "NULL" : '"'+req.query.SKU+'"')+', "1")'
      GetOneData(sql)

      sql = 'SELECT _ID FROM `models` WHERE `Manufacturer`="'+Manufacter+'" AND `Model`="'+req.query.Model+'"'
      Model = GetOneData(sql)._ID
    }else{ Model = Model[0]._ID }

    sql = 'UPDATE `complaints` SET `Model` = "'+Model+'" WHERE `_ID` = "'+req.query.RID+'"'
    GetOneData(sql)

    res.send("ok")
  }else{ res.send("e") }
})

// dodawanie reklamacji
app.get('/v1/1/add/1', (req, res) => {
  if(req.query.API!=undefined && req.query.data!=undefined){
    const userData = JSON.parse(req.query.userData)
    const data = JSON.parse(req.query.data)

    var sql='INSERT INTO `complaints` (`Company`, `Added`, `Added_date`, `Modification`, `Status`, `Section`, `Model`, `Firstname`, `Lastname`, `Phone`, `Email`, `Description`, `Serial_no`, `Purchase_number`, `Type`, `ToAmount`, `Expectations`, `Comments`, `Code`, `Pin`, `Complaint_number`, `Purchase_date`, `Damage_date`, `Notification`, `SendNotification`) VALUES ("'
    sql+=userData.CID+'"'
    sql+=', "'+userData.PID+'"'
    sql+=', CURRENT_TIMESTAMP()'
    sql+=', current_timestamp()'

    var minSQL='SELECT _ID FROM `status` WHERE `Status`="'+data.Status+'"'
    var miniResult = GetData(minSQL)
    sql+=', '+miniResult[0]._ID

    minSQL='SELECT _ID FROM `sections` WHERE `Name`="'+data.Section+'" AND Company="'+userData.CID+'"'
    miniResult = GetData(minSQL)
    sql+=', '+miniResult[0]._ID
    
    let selectModel = true
    try{
      const model = data.Model.split(" => ")[0]
      const sku=(data.Model.split(" => ")[1].split(" (")[0] == "undefinedSKU" ? "mo.SKU IS NULL" : 'mo.SKU="'+data.Model.split(" => ")[1].split(" (")[0]+'"')
      const manufacter = data.Model.split(" => ")[1].split(" (")[1].split(")")[0]
      minSQL = 'SELECT mo._ID FROM `models` as mo JOIN manufacturers AS ma ON mo.Manufacturer=ma._ID WHERE mo.`Model`="'+model+'" AND '+sku+' AND ma.Manufacturer="'+manufacter+'"'
      miniResult = GetData(minSQL)
      sql+=', '+(miniResult.length==1 ? miniResult[0]._ID : null )
      selectModel=false
    }catch(e){
      sql+=', NULL'
    }
    
    const FirstName = encode.encode(data.FirstName, 'base64')
    sql+=', '+(FirstName=="" ? '"Ti9E"' : '"'+FirstName+'"')
    const LastName = encode.encode(data.LastName, 'base64')
    sql+=', '+(LastName=="" ? '"Ti9E"' : '"'+LastName+'"')
    const Phone = encode.encode(data.Phone, 'base64')
    sql+=', '+(Phone=="" ? '"Ti9E"' : '"'+Phone+'"')
    const Email = encode.encode(data.Email, 'base64')
    sql+=', '+(Email=="" ? '"Ti9E"' : '"'+Email+'"')

    sql+=', '+(data.Description=="" ? null : '"'+data.Description+'"')
    sql+=', '+(data.Serial_no=="" ? null : '"'+data.Serial_no+'"')
    sql+=', '+(data.Purchase_number=="" ? null : '"'+data.Purchase_number+'"')
    sql+=', '+data.Type
    sql+=', '+(data.ToAmountBool ? data.ToAmount : 0 )
    sql+=', '+data.Expectations
    sql+=', '+(data.Comments=="" ? null : '"'+data.Comments+'"')

    var znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var kod =""
    for(var d=0; d<10; d++){ kod+=znaki[getRandomInt(0,33)] }
    sql+=', "'+kod+'"'

    var pin=""
    for(var d=0; d<4; d++){ pin+=getRandomInt(0,9) }
    sql+=', '+pin

    minSQL='SELECT `Complaint_number` FROM `complaints` WHERE Company="'+userData.CID+'" ORDER BY `complaints`.`Added_date` DESC LIMIT 1'
    var nrComplaint = GetData(minSQL)
    if(nrComplaint.length!=1){
      minSQL='SELECT RIGHT(LEFT(CURRENT_DATE(),4),2) AS DAT'
      var dat = GetOneData(minSQL).DAT
      sql+=', "01/'+dat+'"'
    }else{
      nrComplaint = nrComplaint[0].Complaint_number
      nrComplaint = nrComplaint.split("/")
      minSQL='SELECT RIGHT(LEFT(CURRENT_DATE(),4),2) AS DAT'
      var dat = GetOneData(minSQL).DAT

      if(parseInt(dat)==parseInt(nrComplaint[1])){
        nrComplaint = parseInt(nrComplaint[0])+1
        sql+=', "'+nrComplaint+'/'+dat+'"'
      } else{ sql+=', "01/'+dat+'"' }
    }

    sql+=', '+(data.Purchase_date=="" ? null : '"'+data.Purchase_date+'"')
    sql+=', '+(data.Damage_date=="" ? null : '"'+data.Damage_date+'"')
    sql+=(data.Notyfication ? ', 1, 1' : ', 0, 0')
    sql+=')'

    console.log("---------------------------")
    console.log(sql)
    GetOneData(sql)
    sql='SELECT * FROM `complaints` WHERE `Code`="'+kod+'" AND `Pin`="'+pin+'"'
    const result = GetOneData(sql)

    var nextStep = []
    if(selectModel){ nextStep.push(3) } 
    if(data.Attachment){ nextStep.push(4) }
    if(data.Delivery){ nextStep.push(11) }
    nextStep.push(5)
    const resp = {
      nextStep: nextStep,
      Code: kod,
      RID: result._ID
    }
    console.log(resp)
    res.send(resp)
  }else{
    res.send("e")
  }
})
app.get('/v1/1/add/2', (req, res) => {
  if(req.query.API!=undefined && req.query.RID!=undefined && req.query.ID!=undefined && req.query.Code!=undefined && req.query.nextSteps!=undefined){
    let sql='SELECT _ID FROM `api`WHERE api.Key="'+req.query.API+'"'
    if(GetData(sql).length==1){
      sql='UPDATE `complaints` SET `Model`="'+req.query.ID+'" WHERE `_ID`="'+req.query.RID+'" AND `Code`="'+req.query.Code+'"'
      GetData(sql)
      const result = {
        nextStep: req.query.nextSteps,
        Code: req.query.Code,
        RID: req.query.RID
      }
      res.send(result)
    }else{ res.send("e") }
  }else{ res.send("e") }
})
app.get('/v1/1/addcreatemodel', (req, res) => {
  if(req.query.API!=undefined && req.query.CID!=undefined && req.query.PID!=undefined && req.query.RID!=undefined && req.query.Code!=undefined && req.query.nextSteps!=undefined && req.query.Model!=undefined && req.query.Manufacter!=undefined && req.query.SKU!=undefined){
    sql = 'SELECT _ID FROM `manufacturers` WHERE `Manufacturer`="'+req.query.Manufacter+'"'
    let Manufacter = GetData(sql)
    if(Manufacter.length != 1){
      sql = 'INSERT INTO `manufacturers` (`Manufacturer`, `State`, `Curier`, `Servis`, `Complaint_card`, `Type`) VALUES ("'+req.query.Manufacter+'", "1", NULL, NULL, NULL, 0)'
      GetOneData(sql)
      
      sql = 'SELECT _ID FROM `manufacturers` WHERE `Manufacturer`="'+req.query.Manufacter+'"'
      Manufacter = GetOneData(sql)._ID
    }else{ Manufacter = Manufacter[0]._ID }

    sql = 'SELECT _ID FROM `models` WHERE `Manufacturer`="'+Manufacter+'" AND `Model`="'+req.query.Model+'"'
    let Model = GetData(sql)
    if(Model.length!=1){
      sql = 'INSERT INTO `models` (`Manufacturer`, `Model`, `SKU`, `State`) VALUES ("'+Manufacter+'", "'+req.query.Model+'", '+(req.query.SKU=="" ? "NULL" : '"'+req.query.SKU+'"')+', "1")'
      console.log(sql)
      GetOneData(sql)

      sql = 'SELECT _ID FROM `models` WHERE `Manufacturer`="'+Manufacter+'" AND `Model`="'+req.query.Model+'"'
      Model = GetOneData(sql)._ID
    }else{ Model = Model[0]._ID }

    sql = 'UPDATE `complaints` SET `Model` = "'+Model+'" WHERE `_ID` = "'+req.query.RID+'" AND Company="'+req.query.CID+'" AND Code = "'+req.query.Code+'"'
    GetOneData(sql)

    res.send({
      nextStep: req.query.nextSteps,
      Code: req.query.Code,
      RID: req.query.RID
    })
  }else{ res.send("e") }
})

// main page
app.get('/v1/1/customercomplaintinfo', (req, res) => {
  let sql = 'SELECT c._ID, c.Added_date AS Reported, c.Modification AS Received, s.Status, s.Locking, s.ToPickUp, s.Stage, co.Adress, m.Model, ma.Manufacturer FROM `complaints` AS c JOIN `status` AS s ON c.Status=s._ID JOIN `company` AS co ON c.Company=co._ID JOIN `models` AS m ON c.Model=m._ID JOIN `manufacturers` AS ma ON m.Manufacturer=ma._ID, `api` WHERE c.Code="'+req.query.Code+'" AND c.Pin="'+req.query.Pin+'" AND api.Key="'+req.query.API+'"'
  res.send(GetOneData(sql))
})
app.get('/v1/1/complaintshistory', (req, res) => {
  let sql = 'SELECT `Date`, `PL` FROM `history`, `api` WHERE `Complaint`="'+req.query.COID+'" AND api.Key="'+req.query.API+'" ORDER BY `history`.`Date` DESC'
  res.send(GetData(sql))
})
app.get('/v1/1/startsubscription', (req, res) => {
  if(req.query.plan=="Basic (Bezpłatne 14 dni)"){
    console.log("basic 64")
    let sql = 'INSERT INTO `company` (`Name`, `NIP`, `Email`, `Phone`, `Adress`) VALUES ("'+req.query.name+'", "'+req.query.nip+'", "'+req.query.email+'", "'+req.query.phone+'", "'+req.query.adress+'")'
    console.log(sql)
    GetOneData(sql)

    sql = 'SELECT _ID FROM `company` WHERE `NIP`="'+req.query.nip+'" ORDER BY `company`.`_ID` DESC'
    console.log(sql)
    const CID = GetOneData(sql)._ID

    const znaki=['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let login = ""
    for(let d=0; d<6; d++){ login+=znaki[getRandomInt(0,33)] }
    let haslo = ""
    for(let d=0; d<10; d++){ haslo+=znaki[getRandomInt(0,33)] }

    sql = `INSERT INTO \`accounts\` (\`Login\`, \`Email\`, \`Password\`, \`Firstname\`, \`Lastname\`, \`Permissions\`, \`Company\`) VALUES ("${login}", "${req.query.email}", "${haslo}", "${req.query.firstname}", "${req.query.lastname}", "1", "${CID}");`
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

    sql = `INSERT INTO \`subscription\` (\`Company\`, \`Start\`, \`End\`, \`Plan\`, \`Account\`, \`Report\`, \`Attachment\`, \`Notifications\`, \`Complaints\`) VALUES (${CID}, CURRENT_DATE(), date_add(CURRENT_DATE(),interval 14 day), "${req.query.plan}", "${req.query.accounts}", "${req.query.statistics}", "${req.query.attachments}", "${req.query.notification}", "${req.query.complaints}" )`
    console.log(sql)
    GetData(sql)

    sql = 'SELECT _ID FROM `subscription` WHERE `Company`="'+CID+'"'
    console.log(sql)
    const SUB = GetOneData(sql)._ID

    sql = 'INSERT INTO `departments` (`Section`, `Account`, `Company`) VALUES ("'+SID+'", "'+PID+'", "'+CID+'")'
    console.log(sql)
    GetData(sql)

    res.send("Firma została utworzona. Na podany adres email zostanie wysłane potwierdzenie utworzenia firmy oraz dane do logowania.")
    
    sql = `INSERT INTO operations (\`CID\`, \`Date\`, \`Type\`, \`Data1\`, \`Data2\`, \`Data3\`, \`Data4\`) VALUES ("${CID}", current_timestamp(), 5,  "${CID}", "${PID}", "${SID}", "${SUB}")`
    console.log(sql)
    GetOneData(sql)
  }else{
    
    console.log("pozostale")
    let sql = `INSERT INTO \`operations\` (\`Date\`, \`Type\`, \`Data1\`, \`Data2\`, \`Data3\`, \`Data4\`, \`Data5\`, \`Data6\`, \`Data7\`, \`Data8\`, \`Data9\`, \`Data10\`, \`Data11\`, \`Data12\`, \`Data13\`, \`Data14\`) VALUES (current_timestamp(), 1, "${req.query.plan}", "${req.query.complaints}", "${req.query.accounts}", "${req.query.attachments}", "${req.query.notification}", "${req.query.statistics}", "${req.query.customization}", "${req.query.name}", "${req.query.firstname}", "${req.query.lastname}", "${req.query.email}", "${req.query.nip}", "${req.query.phone}", "${req.query.adress}")`

    GetOneData(sql)
    res.send("Zgłoszenie utworzenia firmy zostalo wysłane. Zostaie ono zatwierdzone w ciągu 24h.")
  }
})


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.listen(8082)