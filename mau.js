const { IP2Location } = require("ip2location-nodejs");

const ip2location = new IP2Location();
const ip2locationV6 = new IP2Location();

ip2location.open("/home/puname/src/library/IPV4.BIN");
ip2locationV6.open("/home/puname/src/library/IPV6.BIN");

function GetBotIP(ip) {
    const isV6 = ip.indexOf(":");
    if (isV6 > -1) {
        return ip2locationV6.getAll(ip);
    } else {
        return ip2location.getAll(ip);
    }

}
function blockAgent(agent2) {
    const agent = agent2.toLowerCase();
    const listBlock = 'google,facebook,avast';
    const words = listBlock.split(',');
    words.forEach((element) => {
        if (agent.indexOf(element) > -1) {
            return true;
        }
    });
    return false;
}
function blockISP(value2) {
    const value = value2.toLowerCase();
    const listBlock = 'google,google bot,facebook,facebot,chrome,microsoft,amazon,avast';
    const words = listBlock.split(',');
    words.forEach((element) => {
        if (value.indexOf(element) > -1) {
            return true;
        }
    });
    return false;
}


const ipinfo = GetBotIP(ip)
const agent = req.headers['user-agent'];
let block = false;
if (agent) { block = blockAgent(agent); }
if (!block && ipinfo.isp) { block = blockISP(ipinfo.isp); }
if (!block && ipinfo.domainName) { block = blockISP(ipinfo.domainName); }
if (block) {
    console.error("BOT " + agent);
    res.status(404).end("<html>\n<head><title>404 Not Found</title></head>\n<body bgcolor=\"white\">\n<center><h1>404 Not Found</h1></center>\n<hr><center>nginx/1.14.0 (Ubuntu)</center>\n</body>\n</html>\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n");
}