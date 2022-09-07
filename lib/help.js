module.exports = help = (type) => {
    switch (type) {
        case 'help': case 'menu':
            return `
*// PWNBOT*

*Command list :*
- help
- info
- tips
- note
- notes

*Tool list :*
- hash
- subdo
- hackertarget

`
        case 'tips':
            return `
*// PWNBOT*

- This bot runs like a terminal, if you send a message other than the bot command then this bot will run the command according to the message sent

- You can decrypt any hash by sending the hash you want to decrypt

- You can show CVEs by sending the CVE ID you want to show

`
        case 'hackertarget':
            return `
*// HACKERTARGET API*

- dnslookup
- reversedns
- hostsearch
- zonetransfer
- findshareddns
- geoip
- reverseiplookup
- subnetcalc
- aslookup
- bannerlookup
- httpheaders
- pagelinks

`
        case 'payload':
            return `
*// PAYLOAD LIST*

- xss

`
        case 'xss':
            return `
*// XSS PAYLOAD*

- angularjs
- classic
- consuming_tags
- content-types
- dangling_markup
- encodings
- events
- file_uploads
- frameworks
- impossible
- obfuscation
- polyglot
- protocols
- prototype-pollution
- response-content-types
- restricted_characters
- special_tags
- useful_tags
- vuejs
- waf_bypass_global_obj

`
    }
}