var url = require('url');

var WEEKDAYCN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    WEEKDAYJP = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];

var SITE_REGEX = {
    'acfun'   : /acfun\.(cn|tv|tudou)/,
    'bilibili': /bilibili\.com/,
    'tucao'   : /tucao\.(tv|cc)/,
    'sohu'    : /sohu\.com/,
    'youku'   : /youku\.com/,
    'qq'      : /qq\.com/,
    'iqiyi'   : /iqiyi\.com/,
    'letv'    : /(le|letv)\.com/,
    'pptv'    : /pptv\.com/,
    'tudou'   : /tudou\.com/,
    'movie'   : /kankan\.com/,
    'mgtv'    : /mgtv\.com/,
    'netflix' : /netflix\.com/,
    'niconico': /nicovideo\.jp/
};

/**
 * 从主域名获得站点名称
 * @param  {string} urlString 网址
 * @param  {Object[]} sites 站点数组
 * @returns {Object}        站点信息
 */
function getLinkSite(urlString, sites){
    var host = url.parse(urlString).host;

    for (var siteKey in SITE_REGEX) {
        if (SITE_REGEX[siteKey].test(host)) {
            return sites[siteKey];
        }
    }

    return {};
}

/**
 * 格式化周天
 * @param {number} index 周天序号
 * @param {string} [country=cn] 国家代号 'cn' or 'jp'
 * @returns {string} 格式化后的周天
 */
function formatWeekDay(index, country){
    if(country && country.toLowerCase() === 'jp'){
        return WEEKDAYJP[index];
    }else{
        return WEEKDAYCN[index];
    }
}

/**
 * 格式化时间
 * @param {string} time 时间字符串 '1200'
 * @return {string} 格式化后的时间 '12:00'
 */
function formatTime(time){
    var text = '';

    if(time === -1){
        text = '(未知)';
    }else if(time){
        text = time.slice(0, 2) + ':' + time.slice(2);
    }else{
        text = '(预计)';
    }

    return text;
}

/**
 * 将内容储存在localstorage中
 * @param  {string} namespace 命名空间
 * @param  {array|object} data      待储存的内容
 * @return {array|object}           取到的内容
 */
function store(namespace, data){
    var s = null;
    if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
    }

    s = localStorage.getItem(namespace);
    return (s && JSON.parse(s)) || [];
}

/**
 * 月份转换为季度
 * @param {number} month 月份
 * @return {number} 季度 '1月 4月 7月 10月'
 */
function monthToSeason(month){
    switch (true) {
        case (month < 4):
            return 1;
        case (month < 7):
            return 4;
        case (month < 10):
            return 7;
        case (month <= 12):
            return 10;
        default:
            throw new Error('failed convrting to season');
    }
}

/**
 * 辅助生成className
 * @param  {object} obj className的key value对, value为true则输出
 * @return {string}     class string
 */
function classList(obj){
    var className = '',
        result = [];

    for(className in obj){
        if(obj[className] === true){
            result.push(className);
        }
    }

    return result.join(' ');
}

/**
 * 判断是否已开播
 * @param {string} dateStr 日期字符串 2004-10-01
 * @param {string} time 时间字符串 0830
 * return {boolean} 是否开播
 */
function hasOnair(dateStr, timeStr){
    var now = new Date(),
        showDate = new Date(dateStr.replace(/-/g, '/') + ' ' +
            timeStr.slice(0, 2) + ':' +
            timeStr.slice(2) +
            ' GMT+0800 (CST)');

    return now >= showDate;
}

/**
 * 判断是否已结束播放
 * @param  {string}  dateStr 日期字符串 2004-10-01
 * @param  {string}  timeStr 时间字符串 0830
 * @param  {number}  offset  延迟天数
 * @return {Boolean}         是否已结束放送
 */
function hasEnded(dateStr, timeStr, offset){
    var now = new Date(),
        endDate = new Date(dateStr.replace(/-/g, '/') + ' ' +
            timeStr.slice(0, 2) + ':' + timeStr.slice(2) +
            ' GMT+0800 (CST)');
    endDate.setDate(endDate.getDate() + (offset || 0))
    return now >= endDate;
}

module.exports = {
    getLinkSite: getLinkSite,
    formatWeekDay: formatWeekDay,
    formatTime: formatTime,
    store: store,
    monthToSeason: monthToSeason,
    classList: classList,
    hasOnair: hasOnair,
    hasEnded: hasEnded
};
