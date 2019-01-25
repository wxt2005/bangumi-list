var Dispacher    = require('../dispatcher/Dispatcher'),
    _isEmpty     = require('lodash/isEmpty'),
    _assign      = require('lodash/assign'),
    _isObject    = require('lodash/isObject'),
    Utils        = require('../mod/Utils'),
    EventEmitter = require('events').EventEmitter;

var now = new Date();

var _config = {};

var STORAGE_NAMESAPCE = 'bgmlist_configs';

var DEFAULT = {
    newOnly: false,
    highlightOnly: false,
    noAutoSwitch: false,
    disableNewTab: false,
    jpTitle: false,
    dayDivide: 24,
    bangumiDomain: 'bangumi.tv'
};

var BgmConfigStore = _assign({}, EventEmitter.prototype, {
    reset: function(){
        _config = DEFAULT;
        this.saveToStorage();
        console.info('config reseted');
    },
    getConfig: function(name){
        if(_isEmpty(_config) && !this.readFromStorage()){
            this.reset();
        }

        if(typeof name === 'string'){
            return _config[name];
        }else{
            return _config;
        }
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
    update: function(newConfg){
        if(!_isObject(newConfg)){
            console.warn('newConfg format wrong');
            return;
        }
        _config = _assign({}, _config, newConfg);
    },
    readFromStorage: function(){
        var data = Utils.store(STORAGE_NAMESAPCE);
        if(!_isEmpty(data)){
            this.update(data);
            console.info('config read successed');
            return true;
        }else{
            console.info('config read failed');
            return false;
        }
    },
    saveToStorage: function(){
        Utils.store(STORAGE_NAMESAPCE, _config);
    }
});

Dispacher.register(function(action){
    var newConfig = null;
    switch(action.actionType){
        case 'CONFIG_UPDATE':
            newConfig = action.newConfig;
            BgmConfigStore.update(newConfig);
            BgmConfigStore.emitChange();
            break;
        case 'CONFIG_RESET':
            BgmConfigStore.reset();
            BgmConfigStore.emitChange();
            break;
        case 'CONFIG_SAVE':
            BgmConfigStore.saveToStorage();
            break;

        default:
    }
});

module.exports = BgmConfigStore;
