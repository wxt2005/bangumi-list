var Dispacher    = require('../dispatcher/Dispatcher'),
    _            = require('../lib/lodash.custom'),
    Utils        = require('../mod/Utils'),
    EventEmitter = require('events').EventEmitter;

var now = new Date();

var _data = {};

var STORAGE_NAMESAPCE = 'bgmlist_data';

var BgmDataStore = _.assign({}, EventEmitter.prototype, {
    reset: function(){
        if(_.isEmpty(_data)){
            console.info('data store is empty');
            return;
        }else{
            _data = {};
            this.saveToStorage();
            console.info('data reseted');
        }
    },
    getData: function(){
        if(_.isEmpty(_data) && !this.readFromStorage()){
            console.info('data store is empty');
        }

        return _data;
    },
    saveData: function(data){
        if(!_.isObject(data)){
            console.warn('data format wrong');
            return;
        }

        if(data.version !== 0 && _data.path === data.path){
            console.info('data maerged');
            _data = _.merge(_data, data);
        }else{
            console.info('data replaced');
            _data = data;
        }


        this.saveToStorage();
    },
    toggle: function(id, hide){
        if(_.isEmpty(_data)){
            console.info('data store is empty');
            return;
        }

        _data.items[id].hide = !!hide;
        this.saveToStorage();
    },
    toggleAll: function(hide){
        if(_.isEmpty(_data)){
            console.info('data store is empty');
            return;
        }

        _.forIn(_data.items, function(item, id){
            hide = !!hide;
            if(hide){
                item.hide = hide;
            }else{
                delete item.hide;
            }
        });
        this.saveToStorage();
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
    readFromStorage: function(){
        var data = Utils.store(STORAGE_NAMESAPCE);
        if(!_.isEmpty(data)){
            _data = data;
            console.info('data read successed');
            return true;
        }else{
            console.info('data read failed');
            return false;
        }
    },
    saveToStorage: function(){
        Utils.store(STORAGE_NAMESAPCE, _data);
    }
});

Dispacher.register(function(action){
    var newConfig, toggleFlag, id, data;
    switch(action.actionType){
        case 'TOGGLE_ITEM':
            toggleFlag = action.toggleFlag;
            id = action.id;
            BgmDataStore.toggle(id, toggleFlag);
            BgmDataStore.emitChange();
            break;
        case 'DATA_RESET':
            BgmDataStore.reset();
            BgmDataStore.emitChange();
            break;
        case 'DATA_SAVE':
            data = action.data;
            BgmDataStore.saveData(data);
            break;
        case 'DATA_TOGGLE_ALL':
            toggleFlag = action.toggleFlag;
            BgmDataStore.toggleAll(toggleFlag);
            BgmDataStore.emitChange();
            break;
        default:
    }
});

module.exports = BgmDataStore;