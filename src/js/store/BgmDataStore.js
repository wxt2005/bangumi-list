var Dispacher    = require('../dispatcher/Dispatcher'),
    _isEmpty     = require('lodash/isEmpty'),
    _assign      = require('lodash/assign'),
    _isObject    = require('lodash/isObject'),
    _mergeWith   = require('lodash/mergeWith'),
    _forIn       = require('lodash/forIn'),
    Utils        = require('../mod/Utils'),
    EventEmitter = require('events').EventEmitter;

var now = new Date();

var _data = {};

var STORAGE_NAMESAPCE = 'bgmlist_data';

var BgmDataStore = _assign({}, EventEmitter.prototype, {
    reset: function(){
        if(_isEmpty(_data)){
            console.info('data store is empty');
            return;
        }else{
            _data = {};
            this.saveToStorage();
            console.info('data reseted');
        }
    },
    getData: function(){
        if(_isEmpty(_data) && !this.readFromStorage()){
            console.info('data store is empty');
        }

        return _data;
    },
    saveData: function(data){
        if(!_isObject(data)){
            console.warn('data format wrong');
            return;
        }

        if(data.version !== 0 && _data.path === data.path){
            (function() {
                var oldItems = {}, id;
                _data.version = data.version;
                oldItems = _data.items;
                _data.items = data.items;

                for (id in _data.items) {
                    if (id in oldItems) {
                        _data.items[id].hide = oldItems[id].hide || false;
                        _data.items[id].highlight = oldItems[id].highlight || false;
                    }
                }
            })();

            console.info('data maerged');
        }else{
            console.info('data replaced');
            _data = data;
        }


        this.saveToStorage();
    },
    importData: function(data) {
        if(!_isObject(data)){
            console.warn('data format wrong');
            return;
        }

        if(data.version !== 0 && _data.path === data.path){
            var items = data.items;
            _data.items = _assign(_data.items, items);
        }
        this.saveToStorage();
    },
    toggle: function(id, hide){
        if(_isEmpty(_data)){
            console.info('data store is empty');
            return;
        }

        _data.items[id].hide = !!hide;
        this.saveToStorage();
    },
    toggleAll: function(hide){
        if(_isEmpty(_data)){
            console.info('data store is empty');
            return;
        }

        _forIn(_data.items, function(item, id){
            hide = !!hide;
            if(hide){
                item.hide = hide;
            }else{
                delete item.hide;
            }
        });
        this.saveToStorage();
    },
    highlight: function(id, highlight){
        if(_isEmpty(_data)){
            console.info('data store is empty');
            return;
        }

        _data.items[id].highlight = !!highlight;
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
        if(!_isEmpty(data)){
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
        case 'HIGHLIGHT_ITEM':
            toggleFlag = action.toggleFlag;
            id = action.id;
            BgmDataStore.highlight(id, toggleFlag);
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
        case 'DATA_IMPORT':
            data = action.data;
            BgmDataStore.importData(data);
            BgmDataStore.emitChange();
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
