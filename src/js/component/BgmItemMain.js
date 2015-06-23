var React       = require('react'),
    Utils       = require('../mod/Utils'),
    configStore = require('../store/BgmConfigStore'),
    ItemSites   = require('./ItemSites');

var BgmItemMain = React.createClass({
    propTypes: {
        handleExpandClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object.isRequired,
        config: React.PropTypes.object,
        supportSites: React.PropTypes.object
    },
    render: function(){
        var data = this.props.data;

        return (
            <div
                className="item-main"
                onClick={this.props.handleExpandClick}
            >
                <ItemTitle
                    titleJP={data.titleJP}
                    titleCN={data.titleCN}
                    jpTitle={this.props.config.jpTitle}
                />
                <ItemTimeDate
                    weekDay={data.weekDayJP}
                    time={data.timeJP}
                    flag="jp"
                />
                <ItemTimeDate
                    weekDay={data.weekDayCN}
                    time={data.timeCN}
                    flag="cn"
                />
                <ItemSites
                    supportSites={this.props.supportSites}
                    sites={data.onAirSite}
                    disableNewTab={this.props.config.disableNewTab}
                />
            </div>
        );
    }
});

var ItemTitle = React.createClass({
    propTypes: {
        titleJP: React.PropTypes.string,
        titleCN: React.PropTypes.string,
        jpTitle: React.PropTypes.bool
    },
    render: function(){
        if(this.props.jpTitle){
            return (
                <div className="title">
                    <span title={this.props.titleCN}>
                        {this.props.titleJP}
                    </span>
                </div>
            );
        }else{
            return (
                <div className="title">
                    <span title={this.props.titleJP}>
                        {this.props.titleCN}
                    </span>
                </div>
            );
        }
    }
});

var ItemTimeDate = React.createClass({
    propTypes: {
        weekDay: React.PropTypes.number.isRequired,
        time: React.PropTypes.string,
        flag: React.PropTypes.string
    },
    render: function(){
        var className = 'time-' + this.props.flag,
            flagCN = this.props.flag === 'jp' ? '日本' : '大陆',
            formatedTime = Utils.formatTime(this.props.time),
            formatedWeekDay = Utils.formatWeekDay(this.props.weekDay);

        return (
            <div className={className}>
                <span className="m-show">{flagCN}：</span>
                {formatedWeekDay}&nbsp;&nbsp;{formatedTime}
            </div>
        );
    }
});

module.exports = BgmItemMain;