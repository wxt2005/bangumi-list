var _           = require('lodash'),
    React       = require('react'),
    Utils       = require('../mod/Utils'),
    Actions     = require('../action/Actions'),
    BgmItemMain = require('./BgmItemMain'),
    BgmItemSub  = require('./BgmItemSub'),
    Mixins      = require('./Mixins'),
    configStore = require('../store/BgmConfigStore'),
    sitesStore  = require('../store/BgmSitesStore'),
    getPinyin   = require('../mod/getPinyin');

var BgmList = React.createClass({
    mixins: [
        Mixins.configMixin,
        Mixins.sitesMixin
    ],
    propTypes: {
        items: React.PropTypes.object,
        keyword: React.PropTypes.string,
        isHistory: React.PropTypes.bool,
        tab: React.PropTypes.number
    },
    getInitialState: function(){
        return {
            config: configStore.getConfig(),
            supportSites: sitesStore.getSites()
        };
    },
    _thirtyHours: function(item){
        if(this.state.config.dayDivide <= 24) return item;
        // 相当于前一天的几时
        var asPrevDayCN = (+item.timeCN) + 2400;
        // 如果这样算没跨过分日线则修正为前一天的日期时间
        var fixCN = (item.timeCN && asPrevDayCN < this.state.config.dayDivide * 100)?{
            weekDayCN: (item.weekDayCN === 0) ? 6 : (item.weekDayCN - 1),
            timeCN: asPrevDayCN.toString()
        }:{};
        // 同上对 *JP 操作
        var asPrevDayJP = (+item.timeJP) + 2400;
        var fixJP = (item.timeJP && asPrevDayJP < this.state.config.dayDivide * 100)?{
            weekDayJP: (item.weekDayJP === 0) ? 6 : (item.weekDayJP - 1),
            timeJP: asPrevDayJP.toString()
        }:{};
        // 并入法修正
        return _.assign({}, item, fixCN, fixJP);
    },
    _decideShow: function(item){
        var useCNTime = item.timeCN || item.weekDayCN !== item.weekDayJP;
        var showHour = +(useCNTime ? item.timeCN : item.timeJP).slice(0, 2);

        // 有搜索词且匹配中日文，直接显示
        if(this.props.keyword){
            if (this.props.keyword.match(/^[a-zA-Z]+$/)) {
                return getPinyin(item.titleJP + item.titleCN).toLowerCase().indexOf(this.props.keyword.toLowerCase()) !== -1;
            }
            return (item.titleJP + item.titleCN).toLowerCase().indexOf(this.props.keyword.toLowerCase()) !== -1;
        }

        // 非历史模式，有结束日期并且已经结束一周,则不显示
        if(!this.props.isHistory && typeof item.endDate !== 'undefined' &&
            Utils.hasEnded(item.endDate, item.timeJP, 7)){
            return false;
        }

        // 非历史模式，设定只显示关注项目则隐藏其他所以项目
        if(!this.props.isHistory && this.state.config.highlightOnly && !item.highlight){
            return false;
        }


        // 如为全部tab,显示
        if(this.props.tab === 7){
            return true;
        // 被设置为隐藏
        }else if(item.hide){
            return false;
        // 只显示新番设置下不显示旧番
        }else if(this.state.config.newOnly && !item.newBgm){
            return false;
        }

        // 选中周天
        if(item.weekDayCN === this.props.tab){
            // 日期分割之后的不显示
            if(showHour >= this.state.config.dayDivide){
                return false;
            // 其余显示
            }else{
                return true;
            }
        }

        // 选中的前一天
        if(this.props.tab - item.weekDayCN === 1 || this.props.tab - item.weekDayCN === -6){
            // 日期分割之前的不显示
            if(showHour < this.state.config.dayDivide){
                return false;
            // 其余显示
            }else{
                return true;
            }
        }else{
            // 其它周天直接不显示
            return false;
        }

        // 默认显示
        return true;
    },
    render: function(){
        var sortArr = (this.props.tab === 7 ? // 如果tab为全部，则以日本时间排序。否则以大陆时间排序
                ['weekDayJP', 'timeJP'] : ['weekDayCN', 'timeCN']),
            listItems = _(this.props.items)
                // 转换 30 小时制
                .map(function(item, id){
                    return this._thirtyHours(item);
                }.bind(this))
                // 过滤掉不显示的番组
                .filter(function(item, id){
                    return this._decideShow(item);
                }.bind(this))
                // 排序
                .sortBy(sortArr)
                // 生成列表
                .map(function(item, i){
                    var className = Utils.classList({
                        'new': item.newBgm, // 新番
                        'end': (typeof item.endDate !== 'undefined' &&
                            Utils.hasEnded(item.endDate, item.timeJP, 0)), // 已完结
                        'data-hide': item.hide, // 用户隐藏
                        'data-highlight': item.highlight, // 用户关注
                        'data-not-onair': !Utils.hasOnair(item.showDate, item.timeJP) // 还未放送
                    });

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

            // 如果可显示的番组数小于等于4，显示一个图片占位
            if(listItems.length <= 4){
                listItems.push(<li className="empty-item" key="empty"></li>);
            }
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
                        bangumiDomain={this.props.config.bangumiDomain}
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
