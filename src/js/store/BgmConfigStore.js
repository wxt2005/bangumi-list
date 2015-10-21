var Dispacher    = require('../dispatcher/Dispatcher'),
    _            = require('../lib/lodash.custom'),
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
    dayDivideMax: 24,
    dayDivideMin: 20
};

var BgmConfigStore = _.assign({}, EventEmitter.prototype, {
    reset: function(){
        _config = DEFAULT;
        this.saveToStorage();
        console.info('config reseted');
    },
    getConfig: function(name){
        if(_.isEmpty(_config) && !this.readFromStorage()){
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
        _config = _.assign({}, _config, newConfg);
    },
    readFromStorage: function(){
        var data = Utils.store(STORAGE_NAMESAPCE);
        if(!_.isEmpty(data)){
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
