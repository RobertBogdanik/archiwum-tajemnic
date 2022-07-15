const express = require('express')
const path = require('path')
const PORT = 8080
const session = require('express-session')
var bodyParser = require('body-parser')

var login = require('./controls/login')
var fboss = require('./controls/fboss')
var admin = require('./controls/admin')
var public = require('./controls/public')
var games = require('./controls/games')

var app = express()
var sess = new Object

bodyParser = require('body-parser')
app.use(session({secret: 'Huaktffsf8yHdAF43'}))
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')


// strona główna
// home
// app.get('/', (req, res) =>{ res.render('public/index') })

app.get('/', (req, res) =>{ public.Home(req, res, sess) })

// odzyskiwanie hasła
// odzyskiwanie hasła dane
app.get('/login/forgotpassword', (req, res) =>{ public.GiveData(req, res, sess) })

// odzyskiwanie hasła wysyłanie mail
app.post('/login/forgotpassword', (req, res) =>{ public.SendEmail(req, res, sess) })

// odzyskiwanie hasła wybór firmy
app.get('/login/companypassword', (req, res) =>{ public.SelectCompany(req, res, sess) })

// odzyskiwanie hasła nowe dane
app.get('/login/restartpassword', (req, res) =>{ public.UpdateData(req, res, sess) })

// odzyskiwanie hasła zapis danych
app.get('/login/savepassword', (req, res) =>{ res.redirect('/login/forgotpassword?Error=true') })
app.post('/login/savepassword', (req, res) =>{ public.SaveData(req, res, sess) })

// sprawdzanie statusu
app.get('/status', (req, res) =>{ public.Status(req, res, sess) })

// uruchamianie systemu form
app.get('/start', (req, res) =>{ public.StartCompany(req, res, sess) })

// uruchamianie systemu
app.get('/start/insert', (req, res) => { res.redirect('/start?Error=true') })
app.post('/start/insert', (req, res) =>{ public.InsertCompany(req, res, sess) })

// regulamin i rodo
app.get('/regulations', (req, res) =>{ public.Regulations(req, res, sess) })

// login
app.get('/login', (req, res) => {
  res.render('public/login')
})
app.post('/login', (req, res) => {
  sess=req.session
  sess = login.Login(req, res, sess)
  switch(sess.Permissions)
  {
    case 0:
      res.redirect('/a/home')
    break;
    case 1:
      res.redirect('/a/home')
    break;
    case 2:
      res.redirect('/f')
    break;
    default:
        res.redirect('/login')
      break;
  }
})

// fboss
// fhome
app.get('/f', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.index(req, res, sess)}
  else{res.redirect('/login')}
})

// flist
app.get('/f/list/model', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.ListModel(req, res, sess)}
  else{res.redirect('/login')}
})
app.get('/f/list/manufacturers', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.ListManufacturer(req, res, sess)}
  else{res.redirect('/login')}
})

// finsert
app.get('/f/insert/model', (req, res) => { res.redirect('/f') })
app.post('/f/insert/model', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertModel(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/insert/producent', (req, res) => { res.redirect('/f') })
app.post('/f/insert/producent', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertManufacturer(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/insert/status', (req, res) => { res.redirect('/f') })
app.post('/f/insert/status', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertStatus(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/insert/firma', (req, res) => { res.redirect('/f') })
app.post('/f/insert/firma', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertCompany(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/insert/message', (req, res) => { res.redirect('/f') })
app.post('/f/insert/message', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertMessage(req, res, sess)}
  else{res.redirect('/login')}
})

// fupdate
app.get('/f/update/status', (req, res) => { res.redirect('/f') })
app.post('/f/update/status', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateStatus(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/update/model', (req, res) => { res.redirect('/f') })
app.post('/f/update/model', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateModel(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/update/manufacturers', (req, res) => { res.redirect('/f') })
app.post('/f/update/manufacturers', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateManufacturers(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/update/message', (req, res) => { res.redirect('/f') })
app.post('/f/update/message', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateMessage(req, res, sess)}
  else{res.redirect('/login')}
})

// fedit
app.get('/f/edit', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.EditCompany(req, res, sess)}
  else{res.redirect('/login')}
})

// fedit update
app.get('/f/edit/company/update', (req, res) => { res.redirect('/f') })
app.post('/f/edit/company/update', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateCompany(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/edit/reklamacje/update', (req, res) => { res.redirect('/f') })
app.post('/f/edit/reklamacje/update', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateComplaint(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/edit/konta/update', (req, res) => { res.redirect('/f') })
app.post('/f/edit/konta/update', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// fedit insert
app.get('/f/edit/reklamacje/insert', (req, res) => { res.redirect('/f') })
app.post('/f/edit/reklamacje/insert', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertComplaint(req, res, sess)}
  else{res.redirect('/login')}
})

app.get('/f/edit/konta/insert', (req, res) => { res.redirect('/f') })
app.post('/f/edit/konta/insert', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// fedit delate
app.get('/f/edit/sccounts/delate', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.DelateAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// dodaj okres
app.get('/f/edit/okresy/insertt', (req, res) => { res.redirect('/f') })
app.post('/f/edit/okresy/insert', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.InsertSubscription(req, res, sess)}
  else{res.redirect('/login')}
})

// edytuj okres
app.get('/f/edit/okresy/update', (req, res) => { res.redirect('/f') })
app.post('/f/edit/okresy/update', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Permissions==2){fboss.UpdateSubscription(req, res, sess)}
  else{res.redirect('/login')}
})

// admin
// a-home
app.get('/a/home', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.Home(req, res, sess)}
  else{res.redirect('/login')}
})

// a- wiadomosci
app.get('/a/message', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.Message(req, res, sess)}
  else{res.redirect('/login')}
})

// a-add
app.get('/a/add', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Authorization)
  {
    if(sess.Permissions==1 || sess.Permissions==0){
      admin.Add(req, res, sess)
    }else{res.redirect('/login')}
  }else{res.redirect('/login')}
})

// a-model
app.get('/a/model', (req, res) => { res.redirect('/a/home') })
app.post('/a/model', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.Model(req, res, sess)}
  else{res.redirect('/login')}
})
app.get('/a/add/selectmodel', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.SelectModel(req, res, sess)}
  else{res.redirect('/login')}
})
app.get('/a/add/insertmodel', (req, res) => { res.redirect('/a/home') })
app.post('/a/add/insertmodel', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.InsertModel(req, res, sess)}
  else{res.redirect('/login')}
})

// a-file
app.get('/a/add/file', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.AddAttachment(req, res, sess)}
  else{res.redirect('/login')}
})
app.get('/a/add/uploadfile', (req, res) => { res.redirect('/a/home') })
app.post('/a/add/uploadfile', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.UploadAttachment(req, res, sess)}
  else{res.redirect('/login')}
})

// a-confirm
app.get('/a/add/confirm', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.AddConfirm(req, res, sess)}
  else{res.redirect('/login')}
})

// a-reklamacje
app.get('/a/complaints', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.ComplaintsList(req, res, sess)}
  else{res.redirect('/login')}
})

// a-szczeguly
app.get('/a/details', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.Details(req, res, sess)}
  else{res.redirect('/login')}
})

// a-update
app.get('/a/update', (req, res) => { res.redirect('/a/home') })
app.post('/a/update', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.UpdateComplaint(req, res, sess)}
  else{res.redirect('/login')}
})

// a-update selectmodel
app.get('/a/details/selectmodel', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.EditSelectModel(req, res, sess)}
  else{res.redirect('/login')}
})

// a-update insert model
app.get('/a/update', (req, res) => { res.redirect('/a/home') })
app.post('/a/details/editinsertmodel', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.EditInsertModel(req, res, sess)}
  else{res.redirect('/login')}
})

// a-update update model
app.get('/a/update', (req, res) => { res.redirect('/a/home') })
app.post('/a/details/editupdatemodel', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.EditUpdateModel(req, res, sess)}
  else{res.redirect('/login')}
})

// a-delate
app.get('/a/details/delate', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.DelateComplaint(req, res, sess)}
  else{res.redirect('/login')}
})

// a-attachment
app.get('/a/details/attachments', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.EditAddNewAttachments(req, res, sess)}
  else{res.redirect('/login')}
})

// a-update update model
app.get('/a/details/uploadfile', (req, res) => { res.redirect('/a/home') })
app.post('/a/details/uploadfile', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.EditUploadNewAttachments(req, res, sess)}
  else{res.redirect('/login')}
})

// a-attachment
app.get('/a/details/sendnotification', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.SendNotification(req, res, sess)}
  else{res.redirect('/login')}
})
// a-statystyki
app.get('/a/statistics', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.Statistics(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia
app.get('/a/settings', (req, res) => {
  sess=req.session
  sess = login.Verification(req, res, sess)
  if(sess.Authorization)
  {
    if(sess.Permissions==1 || sess.Permissions==0){
      admin.Settings(req, res, sess)
    }else{res.redirect('/login')}
  }else{res.redirect('/login')}
})

// a-ustawienia aktualizacja aktualnego konta
app.get('/a/settings/updateactualaccount', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/updateactualaccount', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.UpdateActualAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia dodaj konto
app.get('/a/settings/addaccount', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/addaccount', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.AddAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia dodaj konto
app.get('/a/settings/updateaccount', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/updateaccount', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.UpdateAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia usuń konto
app.get('/a/settings/delateaccount/', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.DelateAccount(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia edycja planu
app.get('/a/settings/editpln', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/editpln', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.EditPlan(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia przedłurz licencje
app.get('/a/settings/extendlicense', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/extendlicense', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.ExtendLicense(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia dodatkowe reklamacje
app.get('/a/settings/addcomplaints', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/addcomplaints', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.AddComplaints(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia update danych firmy
app.get('/a/settings/updatecompany', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/updatecompany', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.UpdateCompany(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia update danych firmy
app.get('/a/settings/addlogo', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/addlogo', (req, res) => {
  sess=req.session
  if(sess.Permissions==1){admin.AddLogo(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia zmiana miniaturki
app.get('/a/settings/addthumbnail', (req, res) => { res.redirect('/a/home') })
app.post('/a/settings/addthumbnail', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.AddThumbnail(req, res, sess)}
  else{res.redirect('/login')}
})

// a-ustawienia domyslna miniaturka
app.get('/a/settings/resetthumbnail/', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){admin.ResetThumbnail(req, res, sess)}
  else{res.redirect('/login')}
})


// games
// list
app.get('/g', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){games.List(req, res, sess)}
  else{res.redirect('/login')}
})
// menadżer
app.get('/g/manager', (req, res) => { res.redirect('/a/home') })
app.post('/g/manager', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){games.Menager(req, res, sess)}
  else{res.redirect('/login')}
})

// kolory
app.get('/g/colors', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){ games.Colors(req, res, sess) }
  else{res.redirect('/login')}
})

// kulko i krzyzyk
app.get('/g/tictactoeauto', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){ games.TicTacToeAuto(req, res, sess) }
  else{res.redirect('/login')}
})

// zapisz wynik
app.get('/g/savescore', (req, res) => { res.redirect('/g') })
app.post('/g/savescore', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){ games.SaveScore(req, res, sess) }
  else{res.redirect('/login')}
})

// rezultaty
app.get('/g/result', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){ games.Result(req, res, sess) }
  else{res.redirect('/login')}
})

// rezultaty
app.get('/g/ranking', (req, res) => {
  sess=req.session
  if(sess.Permissions==1 || sess.Permissions==0){games.Ranking(req, res, sess)}
  else{res.redirect('/login')}
})

// logout
app.get("/logout", (req, res) => {
  sess=req.session
  sess.Permissions = -5
  req.session.destroy(err => {
      if (err) {
          return console.log(err)
      }
      res.redirect("/")
  })
})

// server
app.listen(PORT, () => {
  console.log(`Listening on ${ PORT }`)
})
  // var dan = encode.encode(data.login, 'base64') //kodowanie
  // var ddan = encode.decode(dan, 'base64') //dekodowanie
