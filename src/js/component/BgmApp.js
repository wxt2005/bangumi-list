var _isEmpty     = require('lodash/isEmpty'),
    _forIn       = require('lodash/forIn'),
    _size        = require('lodash/size'),
    React       = require('react'),
    qwest       = require('qwest'),
    Actions     = require('../action/Actions'),
    configStore = require('../store/BgmConfigStore'),
    dataStore   = require('../store/BgmDataStore'),
    BgmTable    = require('./BgmTable'),
    BgmTop      = require('./BgmTop');

var now = new Date();

var BgmApp = React.createClass({
    getInitialState: function(){
        var config = configStore.getConfig();

        return {
            data: dataStore.getData(),
            tab: config.noAutoSwitch ? 7 : now.getDay(),
            isHistory: false,
            config: config,
            queryText: ''
        };
    },
    componentWillReceiveProps: function(nextProps){
        var request;
        if(!this.initUrl && nextProps.currentArchive.path){
            this.initUrl = nextProps.currentArchive.path;
        }

        if(_isEmpty(this.state.data) ||
                this.state.data.path !== nextProps.currentArchive.path ||
                typeof this.state.data.version === 'undefined' ||
                nextProps.currentArchive.version === 0 ||
                this.state.data.version !== nextProps.currentArchive.version ||
                nextProps.currentArchive.path !== this.initUrl
            ){
            qwest.get(nextProps.currentArchive.path)
                .then(function(response){
                    var data = {},
                        state = {};
                    data.path = nextProps.currentArchive.path;
                    data.version = nextProps.currentArchive.version;
                    data.items = _forIn(response, function(item, id){
                        item.id = id;
                    });

                    if(this.initUrl === nextProps.currentArchive.path){
                        state.tab = this.state.config.noAutoSwitch ? 7 : now.getDay();
                        Actions.saveData(data);
                        state.data = dataStore.getData();
                        state.isHistory = false;
                    }else{
                        state.tab = 7;
                        state.data = data;
                        state.isHistory = true;
                    }

                    this.setState(state);
                }.bind(this));
        }
    },
    componentDidMount: function(){
        configStore.addChangeListener(this.onConfigChange);
        dataStore.addChangeListener(this.onDataChange);
    },
    componentWillUnmount: function(){
        configStore.clearChangeListener();
        dataStore.clearChangeListener();
    },
    onDataChange: function(){
        this.setState({
            data: dataStore.getData()
        });
    },
    onConfigChange: function(){
        var config = configStore.getConfig(),
            state = {config: config};

        if(config.noAutoSwitch){
            state.tab = 7;
        }

        this.setState(state);
    },
    handleTabChange: function(tab){
        this.setState({
            tab: +tab
        });
    },
    handleSearch: function(query){
        this.setState({
            queryText: query
        });
    },
    render: function(){
        return (
            <div>
                <BgmTop
                    month={this.props.month}
                    year={this.props.year}
                    handleSearch={this.handleSearch}
                    count={_size(this.state.data.items)}
                />
                <BgmTable
                    data={this.state.data.items}
                    tab={this.state.tab}
                    isHistory={this.state.isHistory}
                    handleTabChange={this.handleTabChange}
                    keyword={this.state.queryText}
                />
            </div>
        );
    }
});

module.exports = BgmApp;
