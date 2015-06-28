var _           = require('../lib/lodash.custom'),
    React       = require('react'),
    Utils       = require('../mod/Utils'),
    Actions     = require('../action/Actions'),
    BgmItemMain = require('./BgmItemMain'),
    BgmItemSub  = require('./BgmItemSub'),
    Mixins      = require('./Mixins'),
    configStore = require('../store/BgmConfigStore'),
    sitesStore  = require('../store/BgmSitesStore');

var BgmList = React.createClass({
    mixins: [
            Mixins.configMixin,
            Mixins.sitesMixin
        ],
    propTypes: {
        items: React.PropTypes.object,
        keyword: React.PropTypes.string,
        isHistory: React.PropTypes.bool
    },
    getInitialState: function(){
        return {
            config: configStore.getConfig(),
            supportSites: sitesStore.getSites()
        };
    },
    _decideShow: function(item){
        var showHour = +item.timeCN.slice(0, 2);

        if(this.props.keyword){
            return (item.titleJP + item.titleCN).toLowerCase().indexOf(this.props.keyword.toLowerCase()) !== -1;
        }

        if(this.props.tab === 7){
            return true;
        }else if(item.hide){
            return false;
        }else if(this.state.config.newOnly && !item.newBgm){
            return false;
        }

        if(item.weekDayCN === this.props.tab){
            if(showHour >= this.state.config.dayDivide){
                return false;
            }else{
                return true;
            }
        }

        if(this.props.tab - item.weekDayCN === 1 || this.props.tab - item.weekDayCN === -6){
            if(showHour < this.state.config.dayDivide){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }

        return true;
    },
    render: function(){
        var sortArr = (+this.props.tab === 7 ? ['weekDayJP', 'timeJP'] : ['weekDayCN', 'timeCN']),
            showCount = 0,
            listItems = _(this.props.items)
            .map(function(item, id){
                item.id = id;
                return item;
            })
            .sortByAll(sortArr)
            .map(function(item, i){
                var className = '',
                    tab = this.props.tab;

                if(item.newBgm){
                    className += ' new';
                }

                if(!Utils.hasOnair(item.showDate, item.timeJP)){
                    className += ' data-not-onair';
                }

                if(!this._decideShow(item)){
                    className += ' hide';
                }else{
                    showCount++;
                }

                if(item.hide){
                    className += ' data-hide';
                }

                if(item.highlight){
                    className += ' data-highlight';
                }


                return (
                    <BgmListItem
                        className={className}
                        data={item}
                        key={item.id}
                        config={this.state.config}
                        supportSites={this.state.supportSites}
                        isHistory={this.props.isHistory}
                    />
                );
            }.bind(this)).value();
            listItems.push(<li className={"empty-item" + (showCount <= 4 ? '' : ' hide')} key="empty"></li>);
        return (
            <div className="table-right data-list">
                <ul>{listItems}</ul>
            </div>
        );
    }
});

var BgmListItem = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        config: React.PropTypes.object,
        data: React.PropTypes.object.isRequired,
        supportSites: React.PropTypes.object,
        isHistory: React.PropTypes.bool
    },
    getInitialState: function(){
        return {expanded: false};
    },
    handleExpandClick: function(e){
        this.setState({expanded: !this.state.expanded});
    },
    handleHideChange: function(flag){
        Actions.toggleItem(this.props.data.id, flag);
    },
    handleHighlightChange: function(flag){
        Actions.highlightItem(this.props.data.id, flag);
    },
    render: function(){
        var classObj = {},
            className = '';
        classObj.expanded = this.state.expanded;
        classObj[this.props.className] = true;
        className = Utils.classList(classObj);

        return (
            <li className={className}>
                <div className="item-scroller">
                    <BgmItemMain
                        data={this.props.data}
                        handleExpandClick={this.handleExpandClick}
                        config={this.props.config}
                        supportSites={this.props.supportSites}
                    />
                    <BgmItemSub
                        data={this.props.data}
                        disableNewTab={this.props.config.disableNewTab}
                        handleHideChange={this.handleHideChange}
                        handleHighlightChange={this.handleHighlightChange}
                        isHistory={this.props.isHistory}
                    />
                </div>
            </li>
        );
    }
});

module.exports = BgmList;
