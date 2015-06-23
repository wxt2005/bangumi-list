var React        = require('react'),
    qwest        = require('qwest'),
    Actions      = require('../action/Actions'),
    Utils        = require('../mod/Utils'),
    configStore  = require('../store/BgmConfigStore'),
    ArchiveStore = require('../store/ArchiveStore'),
    BgmApp       = require('./BgmApp'),
    BgmHeader    = require('./BgmHeader');

var App = React.createClass({
    getInitialState: function(){
        var dateNow = new Date(),
            monthNow = dateNow.getMonth() + 1,
            yeartNow = dateNow.getFullYear(),
            seasonNow = Utils.monthToSeason(monthNow);

        return {
            yearNow: yeartNow,
            monthNow: seasonNow,
            archiveData: {},
            currentArchive: {}
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
                    <p className="inner">©2015&nbsp;&nbsp;番组放送</p>
                </footer>
            </div>
        );
    }
});

function init(){
    React.initializeTouchEvents(true);

    React.render(
        <App />,
        document.body
    );
}

module.exports = {
    init: init
};