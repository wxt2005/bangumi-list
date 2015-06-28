var WEEKDAYCN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    WEEKDAYJP = ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'];

/**
 * 从主域名获得站点名称
 * @param  {string} domain 主域名
 * @param  {sites} array 站点数组
 * @return {string}        站点名称
 */
function getLinkSite(domain, sites){
    return sites[domain] ? sites[domain].name || sites[domain] : '未知';
}

/**
 * 格式化周天
 * @method formatWeekDay
 * @param {number} index 周天序号
 * @optional {string} country 国家代号 'cn' or 'jp'
 * @return {string} 格式化后的周天
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
 * @method formatTime
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
 * @method monthToSeason
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
 * 获取链接中的主域名
 * @method getDomain
 * @param {string} url 网址
 * @return {string} 主域名或者空字符串
 * @TODO 正确获取迅雷看看的域名，现在只用movie来代替
 */
function getDomain(url){
    var re = /^https{0,}:\/\/\w+\.(\w+)\.\w+/i;
    if (url !== '#') {
        return url.match(re)[1].toLowerCase();
    } else {
        return '';
    }
}

/**
 * 辅助生成className
 * @param  {object} obj className的key value对, value为true则输出
 * @return {string}     class string
 */
function classList(obj){
    var className = '',
        result = '';

    for(className in obj){
        if(obj[className] === true){
            result += ' ' + className;
        }
    }

    return result.trim();
}

/**
 * 判断是否已开播
 * @method hasOnair
 * @param {string} dateStr 日期字符串 2004-10-01
 * @param {string} time 时间字符串 0830
 * return {boolean} 是否开播
 */
function hasOnair(dateStr, timeStr) {
    var now = new Date(),
        showDate = new Date(dateStr.replace(/-/g, '/') + ' ' + timeStr.slice(0, 2) + ':' + timeStr.slice(2) + ' GMT+0800 (CST)');

    return now >= showDate;
}

module.exports = {
    getLinkSite: getLinkSite,
    formatWeekDay: formatWeekDay,
    formatTime: formatTime,
    store: store,
    monthToSeason: monthToSeason,
    getDomain: getDomain,
    classList: classList,
    hasOnair: hasOnair
};
