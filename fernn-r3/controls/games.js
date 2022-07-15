const encode = require('nodejs-base64-encode')
var MySql = require('sync-mysql')
var url = require('url')

// łączenie z MySQL
var con = new MySql({
    host: "5.39.95.160",
    user: "master",
    password: "Brtk123.",
    database: "fernn"
})

const List  = (req, res, sess) => {
    res.render('games/list', {
        "Sesja": sess
    })
}


const Menager = (req, res, sess) => {
    var nick = req.body.nick

    if(nick=="Własna nazwa"){ nick = req.body.customnick }

    switch(req.body.gamename){
        case 'Graj w Colors':
            res.redirect('/g/colors?nick='+nick)
            break;
        case 'Graj w kołko i krzyzyk z maszyna':
            res.redirect('/g/tictactoeauto')
            break;
    }
}

const Colors = (req, res, sess) => {
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('nick')==null || params.get('nick')==""){ res.redirect('/g/?error=true'); return false; }

    res.render('games/colors', {
        "Sesja": sess,
        "Nick": params.get('nick')
    })
}

const TicTacToeAuto = (req, res, sess) => {
    res.render('games/tictactoeauto')
}

const SaveScore = (req, res, sess) => {
    var sql='INSERT INTO `break` (`Company`, `Accounts`, `Nick`, `Game`, `Score`, `Date`) VALUES ("'+sess.CID+'", "'+sess.PID+'", "'+encode.encode(req.body.nick, 'base64')+'", "'+req.body.game+'", "'+req.body.score+'", CURRENT_TIMESTAMP())'
    con.query(sql)
    sql='SELECT * FROM `break` WHERE `Nick`= "'+encode.encode(req.body.nick, 'base64')+'" AND `Company`="'+sess.CID+'" AND `Accounts`="'+sess.PID+'" AND `Score`="'+req.body.score+'" AND `Game`="'+req.body.game+'" ORDER BY `Date` DESC'
    var wyn = con.query(sql)
    res.redirect('/g/result?SID='+wyn[0]._ID)
}

const Result = (req, res, sess) => {
    let params = new URLSearchParams(url.parse(req.url, true).query)
    if(params.get('SID')==null || params.get('SID')==""){ res.redirect('/g/?error=true'); return false; }

    var sql = 'SELECT * FROM `break` WHERE `_ID`="'+params.get('SID')+'"'
    var mwyn = con.query(sql)
    mwyn = mwyn[0]

    sql='SELECT `Score` FROM `break` WHERE `_ID`="'+params.get('SID')+'" AND `Game`="'+mwyn.Game+'"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var Score = wyn.Score

    sql='SELECT MAX(`Score`) AS Score FROM `break` WHERE `Accounts`="'+sess.PID+'" AND `Game`="'+mwyn.Game+'"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var PrivateRecords = wyn.Score

    sql='SELECT MAX(`Score`) AS Score FROM`break` WHERE `Company`="'+sess.CID+'" AND `Game`="'+mwyn.Game+'"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var CompanyRecords = wyn.Score

    sql='SELECT MAX(`Score`) AS Score FROM`break` WHERE `Game`="'+mwyn.Game+'"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var AllRecords = wyn.Score

    var CompanyScore=[]
    var TopScore=[]
    var PrivateScore=[]
    sql='SELECT `Nick`, `Score`, `Date` FROM `break` WHERE `Company`="'+sess.CID+'" AND `Game`="'+mwyn.Game+'" ORDER BY Score DESC LIMIT 10'
    var CopyCompanyScore = con.query(sql)
    for(var a = 0; a < CopyCompanyScore.length; a++){
        CompanyScore[a]=CopyCompanyScore[a]
        CompanyScore[a].Nick=encode.decode(CopyCompanyScore[a].Nick, 'base64')
        CompanyScore[a].Date=(CopyCompanyScore[a].Date).substr(0, 10) 
    }

    sql='SELECT `Nick`, `Score`, `Date`, c.Name FROM `break` AS b JOIN `company` AS c ON b.Company=c._ID WHERE `Game`="'+mwyn.Game+'" ORDER BY `Score` DESC LIMIT 10'
    var CopyTopScore = con.query(sql)
    for(var a =0; a<CopyTopScore.length; a++){
        TopScore[a]=CopyTopScore[a]
        TopScore[a].Nick=encode.decode(CopyTopScore[a].Nick, 'base64')
        TopScore[a].Date=(CopyTopScore[a].Date).substr(0, 10)
    }

    sql='SELECT `Nick`, `Score`, `Date` FROM `break` WHERE `Accounts`="'+sess.PID+'" AND `Game`="'+mwyn.Game+'" ORDER BY `Score` DESC LIMIT 10'
    var CopyPrivateScore = con.query(sql)
    for(var a =0; a<CopyPrivateScore.length; a++){
        PrivateScore[a]=CopyPrivateScore[a]
        PrivateScore[a].Nick=encode.decode(CopyPrivateScore[a].Nick, 'base64')
        PrivateScore[a].Date=(PrivateScore[a].Date).substr(0, 10)
    }

    res.render('games/result', {
        "Score": Score,
        "PrivateRecords": PrivateRecords,
        "CompanyRecords": CompanyRecords,
        "AllRecords": AllRecords,
        "CompanyScore": CompanyScore,
        "TopScore": TopScore,
        "PrivateScore": PrivateScore
    })
}

const Ranking = (req, res, sess) => {
    var TopScore=[]
    var sql='SELECT `Nick`, `Score`, `Date`, c.Name FROM `break` AS b JOIN `company` AS c ON b.Company=c._ID WHERE  `Game`="Colors" ORDER BY `Score` DESC LIMIT 10'
    var CopyTopScore = con.query(sql)
    for(var a =0; a<CopyTopScore.length; a++){
        TopScore[a]=CopyTopScore[a]
        TopScore[a].Nick=encode.decode(CopyTopScore[a].Nick, 'base64')
        TopScore[a].Date=(CopyTopScore[a].Date).substr(0, 10)
    }

    sql='SELECT MAX(`Score`) AS Score FROM `break` WHERE `Accounts`="'+sess.PID+'" AND `Game`="Colors"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var PrivateRecords = wyn.Score

    sql='SELECT MAX(`Score`) AS Score FROM`break` WHERE `Company`="'+sess.CID+'" AND `Game`="Colors"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var CompanyRecords = wyn.Score

    sql='SELECT MAX(`Score`) AS Score FROM`break` WHERE `Game`="Colors"'
    wyn = con.query(sql)
    wyn = wyn[0]
    var AllRecords = wyn.Score

    res.render('games/ranking', {
        "PrivateRecords": PrivateRecords,
        "CompanyRecords": CompanyRecords,
        "AllRecords": AllRecords,
        "TopScore": TopScore
    })
}

module.exports = {
    List,
    Menager,
    Colors,
    TicTacToeAuto,
    SaveScore,
    Result,
    Ranking
}