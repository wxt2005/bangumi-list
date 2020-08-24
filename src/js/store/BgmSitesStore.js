var Dispacher    = require('../dispatcher/Dispatcher'),
    _assign      = require('lodash/assign'),
    _isEmpty     = require('lodash/isEmpty'),
    _isObject    = require('lodash/isObject'),
    _forIn       = require('lodash/forIn'),
    Utils        = require('../mod/Utils'),
    EventEmitter = require('events').EventEmitter;

var now = new Date();

var _sites = {};

var DEFAULT = {
        'acfun'   : { name: 'A站', enable: true },
        'bilibili': { name: 'B站', enable: true },
        'tucao'   : { name: 'C站', enable: true },
        'sohu'    : { name: '搜狐', enable: true },
        'youku'   : { name: '优酷', enable: true },
        'qq'      : { name: '腾讯', enable: true },
        'iqiyi'   : { name: '爱奇艺', enable: true },
        'letv'    : { name: '乐视', enable: true },
        'pptv'    : { name: 'PPTV', enable: true },
        'tudou'   : { name: '土豆', enable: true },
        'movie'   : { name: '迅雷', enable: true },
        'mgtv'    : { name: '芒果', enable: true },
        'netflix' : { name: '网飞', enable: true },
        'niconico': { name: 'N站', enable: true }
    };

var STORAGE_NAMESAPCE = 'bgmlist_sites';

var BgmSitesStore = _assign({}, EventEmitter.prototype, {
    reset: function(){
        _sites = DEFAULT;
        this.saveToStorage();
        console.info('sites reseted');
    },
    getSites: function(domain){
        if(_isEmpty(_sites) && !this.readFromStorage()){
            this.reset();
        }

        if(typeof domain === 'string'){
            return _sites[domain];
        }else{
            return _sites;
        }
    },
    toggleAll: function(enable){
        _forIn(_sites, function(info, domain){
            info.enable = enable;
        });
    },
    addChangeListener: function(callback){
        this.on('change', callback);
    },
    clearChangeListener: function(){
        this.removeAllListeners('change');
    },
    emitChange: function(){
        this.emit('change');
    },
    updateSite: function(domain, newConfg){
        _assign(_sites[domain], newConfg);
    },
    importSites: function (sites) {
        if(!_isObject(sites)){
            console.warn('sites format wrong');
            return;
        }
        _sites = _assign(_sites, sites);
    },
    updateAll: function(sitesConfg){
        _sites = _assign({}, DEFAULT, _sites, sitesConfg);
    },
    readFromStorage: function(){
        var data = Utils.store(STORAGE_NAMESAPCE);
        if(!_isEmpty(data)){
            this.updateAll(data);
            console.info('sites read successed');
            return true;
        }else{
            console.info('sites read failed');
            return false;
        }
    },
    saveToStorage: function(){
        Utils.store(STORAGE_NAMESAPCE, _sites);
    }
});

Dispacher.register(function(action){
    var newConfig, toggleFlag, domain;
    switch(action.actionType){
        case 'TOGGLE_SITE':
            toggleFlag = action.toggleFlag;
            domain = action.domain;
            BgmSitesStore.updateSite(domain, {enable: toggleFlag});
            BgmSitesStore.emitChange();
            break;
        case 'SITES_RESET':
            BgmSitesStore.reset();
            BgmSitesStore.emitChange();
            break;
        case 'SITES_SAVE':
            BgmSitesStore.saveToStorage();
            break;
        case 'SITES_IMPORT':
            BgmSitesStore.importSites(action.sites);
            BgmSitesStore.emitChange();
            break;
        case 'SITES_TOGGLE_ALL':
            toggleFlag = action.toggleFlag;
            BgmSitesStore.toggleAll(toggleFlag);
            BgmSitesStore.emitChange();
            break;
        default:
    }
});

module.exports = BgmSitesStore;
