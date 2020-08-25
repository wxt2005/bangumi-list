var React        = require('react'),
    qwest        = require('qwest'),
    Actions      = require('../action/Actions'),
    Utils        = require('../mod/Utils'),
    configStore  = require('../store/BgmConfigStore'),
    ArchiveStore = require('../store/ArchiveStore'),
    BgmApp       = require('./BgmApp'),
    BgmHeader    = require('./BgmHeader'),
    Dialog       = require('./Dialog'),
    Dispacher    = require('../dispatcher/Dispatcher');

var App = React.createClass({
    getInitialState: function(){

        Dispacher.register(action => {
            switch(action.actionType){
                case 'SHOW_DIALOG':
                    this.setState({dialog: action.option}, ()=>this.refs.dialog.show());
                    break;
                default:
            }
        });
        var dateNow = new Date(),
            monthNow = dateNow.getMonth() + 1,
            yeartNow = dateNow.getFullYear(),
            seasonNow = Utils.monthToSeason(monthNow);

        return {
            yearNow: yeartNow,
            monthNow: seasonNow,
            archiveData: {},
            currentArchive: {},
            dialog:{
              type: 'info', // 'info', 'error', 'warning'
              content: '',
              buttons: [] // [{text:'OK', callback: function(){}}]
            }
        };
    },
    changeDataUrl: function(year, month){
        this.setState({
            currentArchive: ArchiveStore.getArchive(year, month),
            yearNow: +year,
            monthNow: +month
        });
    },
    componentDidMount: function(){
        ArchiveStore.addInitListener(function(){
            this.setState({
                archiveData: ArchiveStore.getArchiveData(),
                currentArchive: ArchiveStore.getArchive(this.state.yearNow, this.state.monthNow)
            });
        }.bind(this));
        ArchiveStore.init();
    },
    componentWillUnmount: function(){
        ArchiveStore.clearInitListener();
    },
    render: function(){
        var state = this.state;
        return (
            <div>
                <BgmHeader
                    archiveData={state.archiveData}
                    handleItemClick={this.changeDataUrl}
                />
                <BgmApp
                    currentArchive={state.currentArchive}
                    month={state.monthNow}
                    year={state.yearNow}
                />
                <footer>
                <p className="inner">©2014 - {state.yearNow}&nbsp;&nbsp;番组放送 | <a href="https://github.com/wxt2005/bangumi-list" title="欢迎提出宝贵的意见">GitHub 项目地址</a></p>
                </footer>
                <Dialog type={state.dialog.type} content={state.dialog.content} buttons={state.dialog.buttons} ref="dialog"/>
            </div>
        );
    }
});

function init(){
    React.initializeTouchEvents(true);

    React.render(
        <App />,
        document.getElementById('main')
    );
}

module.exports = {
    init: init
};
