var Actions     = require('../action/Actions'),
    configStore = require('../store/BgmConfigStore'),
    sitesStore  = require('../store/BgmSitesStore');

var Mixins = {
    configMixin: {
        componentDidMount: function(){
            configStore.addChangeListener(this.onConfigChange);
        },
        componentWillUnmount: function(){
            configStore.clearChangeListener();
        },
        onConfigChange: function(){
            this.setState({
                config: configStore.getConfig()
            });
        }
    },
    sitesMixin: {
        componentDidMount: function(){
            sitesStore.addChangeListener(this.onSitesChange);
        },
        componentWillUnmount: function(){
            sitesStore.clearChangeListener();
        },
        onSitesChange: function(){
            this.setState({
                supportSites: sitesStore.getSites()
            });
        }
    }
};

module.exports = Mixins;