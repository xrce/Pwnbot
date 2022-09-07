#

<div align="center">

```

┏                        
PWN_BOT
                        ┛

```
```
これは私のものです
```

</div>

#

## How to Install
Make sure you installed all dependencies
```sh
> npm i
```

## Usage
```sh
> node index
```

## Settings
+ [Owner Number](https://github.com/N1ght420/Pwnbot/blob/main/chat.js#L33)
+ [Restricted CLI Commands](https://github.com/N1ght420/Pwnbot/blob/main/chat.js#L34)
+ [Alternative User Agent](https://github.com/N1ght420/Pwnbot/blob/main/chat.js#L42)
+ [Bot Respond to Any Sender](https://github.com/N1ght420/Pwnbot/blob/main/chat.js#L46) (Comment the line)

#

## Add CVEs
Clone [cvelist](https://github.com/CVEProject/cvelist) repository to Pwnbot directory
```sh
> git clone https://github.com/CVEProject/cvelist
```

## Update CVEs
To update CVEs you can simply fetch update from [cvelist](https://github.com/CVEProject/cvelist) repository
```sh
> cd cvelist
> git pull
```

#

## Add Payload List
### XSS
Clone [XSS Cheatsheet](https://github.com/PortSwigger/xss-cheatsheet-data) repository to payload folder
```sh
> git clone https://github.com/PortSwigger/xss-cheatsheet-data payload/xss
```

#

## Troubleshooting
Fix stuck on linux, install google chrome stable :
```sh
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo dpkg -i google-chrome-stable_current_amd64.deb
```