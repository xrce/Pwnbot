const fs = require('fs')
const moment = require('moment-timezone')
const fetch = require('node-fetch')

const { spawn, exec } = require('child_process')
const { stdout, off } = require('process')

const color = require('./lib/color')
const help = require('./lib/help')
const refile = require('./lib/refile')
const logprint = require('./lib/log')

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = chat = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')

        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const senderid = sender.id.replace(/@c.us/g,'')
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''

        const ownerNumber = ["6281234567890@c.us"] // replace with your whatsapp number
        const restrictedCommands = ["cls","cmd","color","exit","hostname","pause","sudo","runas","shutdown","reboot","init","start","taskkill","tasklist","title","getmac","ftp","netsh","netstat","nslookup","ping","route ","systeminfo","telnet","tracert","attrib","comp ","compact ","copy ","xcopy ","diskcomp","diskcopy","erase ","del ","expand ","fc ","move ","rename ","replace","rmdir","rd","tree","type ","prompt","gpresult","gpupdate","perfmon","reg ","chkdsk","chkntfs","chk","defrag","diskpart","driverquery","format ","label","mode ","mount","mountvol","verify","vol ","assoc","cipher","fc","pathping","tracert","powercfg","sfc","schtasks","format ","cp","mv","init","lpr","alias","admin","basename","bat","batch","cksum","chgrp","command","compress","crontab","cut","dd","diff","dirname","env","user","child","kill","link","ln","lp","lp","make","grp","ps","read","strings","tty","tr","ulimit","umask","compress","expand","write","del","args","wait","vim","edit","nano","htop","uniq","call","call(","module(","read(","open(","sys.","os.","a2p","open3","open2","qq","qx","`","exec","system","stdout","subprocess","popen","Popen","run","system","sh","bash","rm","cat","ls","dir","chmod","chown","touch","mkdir","uname","ipconfig","ifconfig","pwd"]

        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isRestricted = restrictedCommands.includes(command)
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)

        if (isBlocked) return
        if (!isOwner) return

        switch (command) {
            case 'y': case 'yes':
                fs.readFile(`temp/to-${senderid}.txt`, 'utf8', function(err, mto) {
                    if (err) throw err;
                    if (mto == "Restricted command detected, continue (Y/N)?") {
                        fs.readFile(`temp/from-${senderid}.txt`, 'utf8', function(err, mfrom) {
                            if (err) throw err;
                            exec(mfrom, (error, stdout, stderr) => {
                                logprint('#', senderid, mfrom)
                                client.reply(from, `${stdout}`, id)
                            });
                            refile(senderid, mfrom, mto)
                        });
                    }
                });
                break
            case 'n': case 'no': break
            case 'help': case 'menu': case 'tips': case 'hackertarget':
                logprint('?', senderid, `Show ${commands}`)
                client.reply(from, help(command), id)
                break
            case 'info':
                exec(`neofetch --stdout --color_blocks off`, (error, stdout, stderr) => {
                    logprint('?', senderid, `Get System Information`)
                    client.reply(from, `${stdout}`, id)
                });
                break
            case 'hash':
                if (args.length === 1) return client.reply(from, `*Usage :* *${command}* string`, id)
                var teks = body.slice(5);
                var result = await fetch(`https://tools.helixs.id//API/hashgen?text=${teks}`)
                var json = await result.json()
                if (json.status == "success") {
                    logprint('?', senderid, `Get hashes for ${teks}`)
                    var hashes = `*Hashes for ${teks}*\n\n- MD2 : ${json.md2}\n- MD4 : ${json.md4}\n- MD5 : ${json.md5}\n- SHA1 : ${json.sha1}\n- SHA224 : ${json.sha224}\n- SHA256 : ${json.sha256}\n- SHA384 : ${json.sha384}\n- SHA512 : ${json.sha512}`
                    client.reply(from, hashes, id)
                }
                break
            case 'dnslookup': case 'reversedns': case 'hostsearch': case 'zonetransfer': case 'findshareddns': case 'geoip': case 'reverseiplookup': case 'subnetcalc': case 'aslookup': case 'bannerlookup': case 'httpheaders': case 'pagelinks':
                if (args.length === 1) return client.reply(from, `*Usage :* *${command}* target`, id)
                logprint('?', senderid, `Running ${command}, target : ${args[1]}`)
                var result = await fetch(`https://api.hackertarget.com/${command}/?q=${args[1]}`)
                .then(async res => {
                    const data = await res.text()
                    return data
                })
                client.reply(from, result, id)
                break
            case 'subdo': case 'sub': case 'subdomain':
                if (args.length === 1) return client.reply(from, `*Usage :* *${command}* target`, id)
                var result = await fetch(`https://sonar.omnisint.io/subdomains/${args[1]}`);
                var json = await result.json();
                json.splice(0, json.length, ...(new Set(json)));
                logprint('?', senderid, `Scan subdomains from ${args[1]}`)
                for (var i=0; i<json.length; i++) {
                    fs.appendFile(`temp/${senderid}-subdo-${args[1]}.txt`, `${json[i]}\n`, err => {
                        if (err) throw err;
                    })
                }
                fs.readFile(`temp/${senderid}-subdo-${args[1]}.txt`, 'utf8', function(err, data) {
                    if (err) throw err;
                    client.reply(from, data, id)
                });
                fs.unlink(`temp/${senderid}-subdo-${args[1]}.txt`, function (err) {
                    if (err) throw err;
                });
                break
            case 'payload': case 'pload':
                if (args.length === 1) return client.reply(from, help('payload'), id)
                if (!args[2]) return client.reply(from, help(args[1]), id)
                var payloadtype = args[2].toLowerCase()
                switch (args[1]) {
                    case 'xss':
                        if (!fs.existsSync(`payload/xss/json/${payloadtype}.json`)) return client.reply(from, `Can't find ${payloadtype} payload`, id)
                        fs.readFile(`payload/xss/json/${payloadtype}.json`, (err, data) => {
                            if (err) throw err;
                            let jsonData = JSON.parse(data);
                            var xssmess = ''
                            for (var i=0; i < jsonData.length; i++) {
                                if (jsonData[i]['description']) xssmess += `\n*${jsonData[i]['description']}*\n`
                                if (jsonData[i]['title']) xssmess += `\n*${jsonData[i]['title']}*\n`
                                if (jsonData[i]['library']) xssmess += `\n*${jsonData[i]['library']}*\n`
                                if (jsonData[i]['descriptionHTML']) xssmess += `\n${jsonData[i]['descriptionHTML']}\n`
                                if (jsonData[i]['version']) xssmess += `\n*Version :* \n${jsonData[i]['version']}*\n`
                                if (jsonData[i]['frameworkCode']) xssmess += `\n*Code :* \n${jsonData[i]['frameworkCode']}*\n`
                                if (jsonData[i]['code']) xssmess += `\n*Payload :* \n${jsonData[i]['code']}*\n`
                                if (jsonData[i]['payload']) xssmess += `\n*Payload :* \n${jsonData[i]['payload']}*\n`
                                if (jsonData[i]['content-type']) xssmess += `\n*Content-type :* \n${jsonData[i]['content-type']}*\n`
                                if (jsonData[i]['fingerprint']) xssmess += `\n*Fingerprint :* \n${jsonData[i]['fingerprint']}*\n`
                                if (jsonData[i]['browsers'][0]) {
                                    xssmess += `\n*Affected Browser :*\n`
                                    for (var j=0; j < jsonData[i]['browsers'].length; j++) {
                                        xssmess += `- ${jsonData[i]['browsers'][j]}\n`
                                    }
                                }
                                if (jsonData[i]['url']) xssmess += `Url : ${jsonData[i]['url']}*\n`
                            }
                            logprint('?', senderid, `Show XSS ${payloadtype} Payload`)
                            client.reply(from, xssmess, id)
                        });
                        break
                }
                break
            case 'note':
                if (args.length === 1) return client.reply(from, '*Usage :* *note* name action yournotes', id)
                if (!fs.existsSync(`notes/${senderid}`)) fs.mkdirSync(`notes/${senderid}`);
                var note = `notes/${senderid}/${args[1]}.txt`;
                if (args.length === 2) {
                    fs.readFile(note, 'utf8', function(err, data) {
                        if (err) throw err;
                        client.reply(from, data, id)
                    });
                } else {
                    var teks = body.slice(5);
                    var catatan = teks.split(`${args[2]}`)[1];
                    switch (args[2]) {
                        case 'add':
                            fs.appendFile(note, `${catatan}\n`, err => {
                                if (err) throw err;
                                client.reply(from, `Note *${args[1]}* added`, id)
                            })
                            break
                        case 'del':
                            fs.unlink(note, function (err) {
                                if (err) throw err;
                                client.reply(from, `Note *${args[1]}* removed`, id)
                            });
                            break
                    }
                }
                break
            case 'notes':
                if (!fs.existsSync(`notes/${senderid}`)) fs.mkdirSync(`notes/${senderid}`)
                var folder = fs.readdirSync(`notes/${senderid}/`);
                fs.appendFile(`temp/${senderid}-notes.txt`, `${folder}`, err => {
                    if (err) throw err;
                });
                fs.readFile(`temp/${senderid}-notes.txt`, 'utf8', function(err, data) {
                    if (err) throw err;
                    var data = data.replace(/.txt/g,'').replace(/,/g,'\n')
                    client.reply(from, `*Available Notes :*\n\n${data}`, id)
                });
                fs.unlink(`temp/${senderid}-notes.txt`, function (err) {
                    if (err) throw err;
                });
                break
            default:
                if (command.includes('cve')) {
                    if (command.includes('-')) {
                        var foundcve = 0
                        var cveid = command.toUpperCase()
                        var year = cveid.split('-')[1]
                        var folder = fs.readdirSync(`cvelist/${year}/`)
                        fs.appendFile(`temp/${senderid}-cve.txt`, `${folder}`, err => {
                            if (err) throw err;
                        });
                        fs.readFile(`temp/${senderid}-cve.txt`, 'utf8', function(err, data) {
                            if (err) throw err;
                            var data = data.replace(/,/g,'\n')
                            fs.appendFile(`temp/${senderid}-cvelist.txt`, `${data}`, err => {
                                if (err) throw err;
                            });
                        });
                        fs.readFileSync(`temp/${senderid}-cvelist.txt`, 'utf-8').split(/\r?\n/).forEach(function(line){
                            if (fs.existsSync(`cvelist/${year}/${line}/${cveid}.json`)) {
                                foundcve += 1
                                fs.readFile(`cvelist/${year}/${line}/${cveid}.json`, (err, data) => {
                                    if (err) throw err;
                                    let jsonData = JSON.parse(data);
                                    if (jsonData['CVE_data_meta']['STATE'] == 'RESERVED') {
                                        var cvemess = `*${jsonData['CVE_data_meta']['ID']} - ${jsonData['CVE_data_meta']['STATE']}*`
                                    } else if (jsonData['CVE_data_meta']['STATE'] == 'PUBLIC') {
                                        var cvemess = `*${jsonData['CVE_data_meta']['ID']} - ${jsonData['problemtype']['problemtype_data'][0]['description'][0]['value']}*`
                                        cvemess += `\n${jsonData['description']['description_data'][0]['value']}`
                                        cvemess += `\n\n*Affected Machines :*`
                                        for (var i=0; i < jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'].length; i++) {
                                            if (jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'][i]['version']['version_data'][0]['version_value'] == '' || jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'][i]['version']['version_data'][0]['version_value'] == 'n/a') {
                                                cvemess += `\n- ${jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'][i]['product_name']}`
                                            } else {
                                                for (var j=0; j < jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'][i]['version']['version_data'].length; j++) {
                                                    cvemess += `\n- ${jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'][i]['product_name']} ${jsonData['affects']['vendor']['vendor_data'][0]['product']['product_data'][i]['version']['version_data'][j]['version_value']}`
                                                }
                                            }
                                        }
                                        cvemess += `\n\n*References :*`
                                        for (var k=0; k < jsonData['references']['reference_data'].length; k++) {
                                            cvemess += `\n- ${jsonData['references']['reference_data'][k]['url']}`
                                        }
                                    }
                                    logprint('?', senderid, `Show ${cveid}`)
                                    client.reply(from, cvemess, id)
                                });
                            }
                        })
                        if (foundcve == 0) {
                            client.reply(from, `Can't find ${cveid}`, id)
                        }
                        fs.unlink(`temp/${senderid}-cve.txt`, function (err) {
                            if (err) throw err;
                        });
                        fs.unlink(`temp/${senderid}-cvelist.txt`, function (err) {
                            if (err) throw err;
                        });
                    } else {
                        client.reply(from, `Searching for CVEs? Send me CVE id`, id)
                    }
                    break
                }

                var email = "bransen.vikranth@logdots.com"
                var code = "49898fab6e014903"

                switch (command.length) {
                    case 32: var hashtype = "md5"; break
                    case 40: var hashtype = "sha1"; break
                    case 64: var hashtype = "sha256"; break
                    case 96: var hashtype = "sha384"; break
                    case 128: var hashtype = "sha512"; break
                    default:
                        if (isRestricted) {
                            fme = "Restricted command detected, continue (Y/N)?"
                            refile(senderid, commands, fme)
                            return client.reply(from, `${fme}`, id)
                        } else {
                            exec(commands, (error, stdout, stderr) => {
                                logprint('$', senderid, commands)
                                refile(senderid, commands, stdout)
                                return client.reply(from, `${stdout}`, id)
                            });
                        }
                        break
                }
                if (hashtype) {
                    var result = await fetch(`https://md5decrypt.net/en/Api/api.php?hash=${command}&hash_type=${hashtype}&email=${email}&code=${code}`)
                    .then(async res => {
                        const data = await res.text()
                        return data
                    })
                    if (!result) {
                        logprint('?', senderid, `Dehash ${command} (failed)`)
                        return client.reply(from, `Can't decrypt ${command}`, id);
                    } else {
                        if (result == 'ERROR CODE : 005') return
                        var result = result.split('\n')[0];
                        logprint('?', senderid, `Dehash ${command} : ${result}`)
                        return client.reply(from, result, id)
                    }
                }
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}