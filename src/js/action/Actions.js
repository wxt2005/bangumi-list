var Dispatcher = require('../dispatcher/Dispatcher');

var Actions = {
    updateConfig: function(newConfig){
        Dispatcher.dispatch({
          actionType: 'CONFIG_UPDATE',
          newConfig: newConfig
        });
    },
    resetConfig: function(){
        Dispatcher.dispatch({
          actionType: 'CONFIG_RESET'
        });
    },
    saveConfig: function(){
        Dispatcher.dispatch({
          actionType: 'CONFIG_SAVE'
        });
    },
    toggleAllSites: function(toggleFlag){
        Dispatcher.dispatch({
            actionType: 'SITES_TOGGLE_ALL',
            toggleFlag: toggleFlag
        });
    },
    toggleSite: function(domain, toggleFlag){
        Dispatcher.dispatch({
            actionType: 'TOGGLE_SITE',
            toggleFlag: toggleFlag,
            domain: domain
        });
    },
    resetSites: function(){
        Dispatcher.dispatch({
            actionType: 'SITES_RESET'
        });
    },
    saveSites: function(){
        Dispatcher.dispatch({
            actionType: 'SITES_SAVE'
        });
    },
    importSites: function (sites) {
        Dispatcher.dispatch({
            actionType: 'SITES_IMPORT',
            sites: sites
        });
    },
    toggleItem: function(id, toggleFlag){
        Dispatcher.dispatch({
            actionType: 'TOGGLE_ITEM',
            toggleFlag: toggleFlag,
            id: id
        });
    },
    highlightItem: function(id, toggleFlag){
        Dispatcher.dispatch({
            actionType: 'HIGHLIGHT_ITEM',
            toggleFlag: toggleFlag,
            id: id
        });
    },
    resetData: function(){
        Dispatcher.dispatch({
            actionType: 'DATA_RESET'
        });
    },
    saveData: function(data){
        Dispatcher.dispatch({
            actionType: 'DATA_SAVE',
            data: data
        });
    },
    importData: function(data){
        Dispatcher.dispatch({
            actionType: 'DATA_IMPORT',
            data: data
        });
    },
    toggleAllItems: function(toggleFlag){
        Dispatcher.dispatch({
            actionType: 'DATA_TOGGLE_ALL',
            toggleFlag: toggleFlag
        });
    },
    showDialog: function(type, content, buttons){
        Dispatcher.dispatch({
            actionType: 'SHOW_DIALOG',
            option: {
                type: type,
                content: content,
                buttons: buttons || ''
            }
        });
    }
};

module.exports = Actions;
