const encode = require('nodejs-base64-encode')
var MySql = require('sync-mysql')

var con = new MySql({
    host: "5.39.95.160",
    user: "master",
    password: "Brtk123.",
    database: "fernn"
})

const Login = (req, res, sess) => {
    sess=req.session
    if(sess === undefined)
    {
        res.render('public/login')
        console.log("erre")
    }else{
        sess.login = req.body.login
        sess.haslo = req.body.password

        var sql="SELECT COUNT(*) AS quantity FROM `accounts` WHERE (`Login`='"+encode.encode(sess.login, 'base64')+"' OR `Email`='"+encode.encode(sess.login, 'base64')+"') AND `Password`='"+encode.encode(sess.haslo, 'base64')+"'"
        var result = con.query(sql)
        result=JSON.stringify(result[0])
        result=JSON.parse(result)

        if(result.quantity!=1){
            sess.Authorization = false
            return {
                "Authorization": false
            }
        }else{
            var licencja = true
            var sql='SELECT a._ID AS PID, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints, MAX(s.End) AS MAX FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE (a.`Login`="'+encode.encode(sess.login, 'base64')+'" OR a.`Email`="'+encode.encode(sess.login, 'base64')+'") AND a.`Password`="'+encode.encode(sess.haslo, 'base64')+'" AND CURDATE()>=s.Start AND CURDATE()<=s.End'
            var wyn = con.query(sql)
            
            if(wyn[0].MAX==null){
                var sql='SELECT a._ID AS PID, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE (a.`Login`="'+encode.encode(sess.login, 'base64')+'" OR a.`Email`="'+encode.encode(sess.login, 'base64')+'") AND a.`Password`="'+encode.encode(sess.haslo, 'base64')+'" AND s.End<CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
                wyn = con.query(sql)
                licencja = false
            }
            wyn = wyn[0]
            if(wyn.PID==null || wyn.CID==null){ 
                return {
                    "Authorization": false
                }
            }
            var admin = false
            if(wyn.Permissions==1){ admin=true }
            
            if(licencja){
                sql = 'SELECT COUNT(*) AS quantity  FROM `accounts`  WHERE `Company`="'+wyn.CID+'"'
                var miniwyn = con.query(sql)

                var adaccounts = false
                if(miniwyn[0].quantity<wyn.Account){ adaccounts=true }

                var unlimitedaccount = false
                if(wyn.Account==9999){ unlimitedaccount=true }
                
                var report = false
                if(wyn.Report==1){ report=true }

                var addattachment = false
                if(wyn.Attachment>0){ addattachment=true }

                var unlimitedattachments = false
                if(wyn.Attachment==9999){ unlimitedattachments=true }

                var notifications = false
                if(wyn.Notifications>0){ notifications=true }

                sql = 'SELECT COUNT(*) AS quantity  FROM `complaints` as c  WHERE Added_date>"'+wyn.Start+'" AND Added_date<="'+wyn.End+'" AND c.Company="'+wyn.CID+'"'
                miniwyn=con.query(sql)
                var addcomplaints = false
                if(miniwyn[0].quantity<wyn.Complaints){ addcomplaints=true }

                var danger = false
                var warning = false
                var data1=new Date(wyn.MAX)
                var data2=new Date(wyn.Today)
                var dni=data1 - data2
                dni = Math.floor(dni/(1000*60*60*24))
                if(dni <= 14 && dni >= 0)
                {
                    warning=true
                }
            }else{
                var danger = true
                var warning = false
                var adaccounts = false
                var report = false
                var addattachment = false
                var unlimitedaccount = false
                var unlimitedattachments = false
                var notifications = false
                var addcomplaints = false
            }
            var Thumbnail = "https://img.icons8.com/color/48/000000/user-male-circle--v1.png"
            if(wyn.Thumbnail!=null){ Thumbnail="/files/"+wyn.Thumbnail }

            sess.Authorization = true
            sess.PID = wyn.PID
            sess.Firstname = encode.decode(wyn.Firstname, 'base64')
            sess.Lastname = encode.decode(wyn.Lastname, 'base64')
            sess.Permissions = wyn.Permissions
            sess.Admin =  admin
            sess.CID = wyn.CID
            sess.Name = wyn.Name
            sess.NIP = encode.decode(wyn.NIP, 'base64')
            sess.Email = encode.decode(wyn.Email, 'base64')
            sess.Phone = encode.decode(wyn.Phone, 'base64')
            sess.End = wyn.End
            sess.EndWarning = warning
            sess.EndDanger = danger
            sess.Account = wyn.Account
            sess.AddAccounts = adaccounts
            sess.UnlimitedAccount = unlimitedaccount
            sess.Reports = report
            sess.Attachments = wyn.Attachment
            sess.AddAttachments = addattachment
            sess.UnlimitedAttachments = unlimitedattachments
            sess.Notifications = notifications
            sess.Complaints = wyn.Complaints
            sess.AddComplaints = addcomplaints
            sess.Thumbnail = Thumbnail
            return {
                "Authorization": true,
                "PID": wyn.PID,
                "Firstname": encode.decode(wyn.Firstname, 'base64'),
                "Lastname": encode.decode(wyn.Lastname, 'base64'),
                "Permissions": wyn.Permissions,
                "Admin": admin,
                "CID": wyn.CID,
                "Name": wyn.Name,
                "NIP": encode.decode(wyn.NIP, 'base64'),
                "Email": encode.decode(wyn.Email, 'base64'),
                "Phone": encode.decode(wyn.Phone, 'base64'),
                "End": wyn.End,
                "EndWarning": warning,
                "EndDanger": danger,
                "Account": wyn.Account,
                "AddAccounts": adaccounts,
                "UnlimitedAccount": unlimitedaccount,
                "Reports": report,
                "Attachments": wyn.Attachment,
                "AddAttachments": addattachment,
                "UnlimitedAttachments": unlimitedattachments,
                "Notifications": notifications,
                "Complaints": wyn.Complaints,
                "AddComplaints": addcomplaints,
                "Thumbnail": Thumbnail
            }
        }
    }
}

const Verification = (req, res, sess) => {
    if(sess.PID==undefined || sess.CID == undefined){
        return {
            "Authorization": false
        }
    }
    var licencja = true
    var sql='SELECT a._ID AS PID, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints, MAX(s.End) AS MAX FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE a._ID="'+sess.PID+'" AND a.Company="'+sess.CID+'" AND CURDATE()>=s.Start AND CURDATE()<=s.End'
    var wyn = con.query(sql)

    if(wyn[0].MAX==null){
        var sql='SELECT a._ID AS PID, a.Firstname, a.Lastname, a.Permissions, a.Thumbnail, c._ID AS CID, c.Name, c.NIP, c.Email, c.Phone, CURDATE() AS Today, s.Start, s.End, s.Account, s.Report, s.Attachment, s.Notifications , s.Complaints FROM `accounts` as a JOIN `company` as c ON a.Company=c._ID JOIN `subscription` as s ON a.Company=s.Company WHERE a._ID="'+sess.PID+'" AND a.Company="'+sess.CID+'" AND s.End<CURRENT_DATE() ORDER BY `End` DESC LIMIT 1'
        wyn = con.query(sql)
        licencja = false
    }
    wyn = wyn[0]

    var admin = false
    if(wyn.Permissions==1){ admin=true }


    sql = 'SELECT COUNT(*) AS quantity  FROM `accounts`  WHERE `Company`="1"   UNION  SELECT COUNT(*) AS quantity  FROM `complaints` as c  WHERE Added_date>"2021-04-09T22:00:00.000Z" AND Added_date<="2021-04-28T22:00:00.000Z" AND c.Company="1"'
    var miniwyn = con.query(sql)

    if(licencja){
        var adaccounts = false
        if(miniwyn[0].quantity<wyn.Account){ adaccounts=true }

        var unlimitedaccount = false
        if(wyn.Account==9999){ unlimitedaccount=true }
        
        var report = false
        if(wyn.Report==1){ report=true }

        var addattachment = false
        if(wyn.Attachment>0){ addattachment=true }

        var unlimitedattachments = false
        if(wyn.Attachment==9999){ unlimitedattachments=true }

        var notifications = false
        if(wyn.Notifications>0){ notifications=true }

        var addcomplaints = false
        if(miniwyn[1].quantity<wyn.Complaints){ addcomplaints=true }

        var danger = false
        var warning = false
        var data1=new Date(wyn.MAX)
        var data2=new Date(wyn.Today)
        var dni=data1 - data2
        dni = Math.floor(dni/(1000*60*60*24));
        if(dni <= 14 && dni >= 0)
        {
            warning=true
        }
    }else{
        var danger = true
        var warning = false
        var adaccounts = false
        var report = false
        var addattachment = false
        var unlimitedaccount = false
        var unlimitedattachments = false
        var notifications = false
        var addcomplaints = false
    }
    var Thumbnail = "https://img.icons8.com/color/48/000000/user-male-circle--v1.png"
    if(wyn.Thumbnail!=null){ Thumbnail="/files/"+wyn.Thumbnail }

    sess.Authorization = true
    sess.PID = wyn.PID
    sess.Firstname = encode.decode(wyn.Firstname, 'base64')
    sess.Lastname = encode.decode(wyn.Lastname, 'base64')
    sess.Permissions = wyn.Permissions
    sess.Admin =  admin
    sess.CID = wyn.CID
    sess.Name = wyn.Name
    sess.NIP = encode.decode(wyn.NIP, 'base64')
    sess.Email = encode.decode(wyn.Email, 'base64')
    sess.Phone = encode.decode(wyn.Phone, 'base64')
    sess.End = wyn.End
    sess.EndWarning = warning
    sess.EndDanger = danger
    sess.Account = wyn.Account
    sess.AddAccounts = adaccounts
    sess.UnlimitedAccount = unlimitedaccount
    sess.Reports = report
    sess.Attachments = wyn.Attachment
    sess.AddAttachments = addattachment
    sess.UnlimitedAttachments = unlimitedattachments
    sess.Notifications = notifications
    sess.Complaints = wyn.Complaints
    sess.AddComplaints = addcomplaints
    sess.Thumbnail = Thumbnail
    return {
        "Authorization": true,
        "PID": wyn.PID,
        "Firstname": encode.decode(wyn.Firstname, 'base64'),
        "Lastname": encode.decode(wyn.Lastname, 'base64'),
        "Permissions": wyn.Permissions,
        "Admin": admin,
        "CID": wyn.CID,
        "Name": wyn.Name,
        "NIP": encode.decode(wyn.NIP, 'base64'),
        "Email": encode.decode(wyn.Email, 'base64'),
        "Phone": encode.decode(wyn.Phone, 'base64'),
        "End": wyn.End,
        "EndWarning": warning,
        "EndDanger": danger,
        "Account": wyn.Account,
        "AddAccounts": adaccounts,
        "UnlimitedAccount": unlimitedaccount,
        "Reports": report,
        "Attachments": wyn.Attachment,
        "AddAttachments": addattachment,
        "UnlimitedAttachments": unlimitedattachments,
        "Notifications": notifications,
        "Complaints": wyn.Complaints,
        "AddComplaints": addcomplaints,
        "Thumbnail": Thumbnail
    }
}
module.exports = {
    Login,
    Verification
}