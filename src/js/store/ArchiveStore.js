var _            = require('../lib/lodash.custom'),
    qwest        = require('qwest'),
    EventEmitter = require('events').EventEmitter;

var now = new Date();

var _archive = {};

var ArchiveStore = _.assign({}, EventEmitter.prototype, {
    getArchive: function(year, month){
        if(_.isEmpty(_archive)){
            this.init();
        }

        if(!(year in _archive)){
            console.log('missing year ' + year);
            return '';
        }else if(!(month in _archive[year])){
            console.log('missing month ' + month + ' in year ' + year);
            return '';
        }else{
            return _archive[year][month];
        }
    },
    getArchiveData: function(){
        if(_.isEmpty(_archive)){
            this.init();
        }

        return _archive;
    },
    init: function(){
        qwest.get('json/archive.json')
            .then(function(response){
                _archive = response.data;
                this.emitInit();
            }.bind(this));
    },
    addInitListener: function(callback){
        this.on('init', callback);
    },
    clearInitListener: function(callback){
        this.removeAllListeners('init');
    },
    emitInit: function(){
        this.emit('init');
    }
});

module.exports = ArchiveStore;