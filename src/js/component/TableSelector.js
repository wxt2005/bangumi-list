var _map  = require('lodash/map'),
    React = require('react'),
    Utils = require('../mod/Utils');

var now = new Date();

var TableSelector = React.createClass({
    propTypes: {
        onTabChange: React.PropTypes.func.isRequired,
        tab: React.PropTypes.number.isRequired,
        isInSearch: React.PropTypes.bool
    },
    _handleTabClick: function(event){
        var tabKey = +event.target.getAttribute('data-tab'),
            tabName = event.target.getAttribute('data-name');

        event.preventDefault();

        if(typeof tabKey === 'number'){
            this.props.onTabChange(tabKey, tabName);
        }
    },
    render: function(){
        var tabs = [
            {name: '周一', key: 1},
            {name: '周二', key: 2},
            {name: '周三', key: 3},
            {name: '周四', key: 4},
            {name: '周五', key: 5},
            {name: '周六', key: 6},
            {name: '周日', key: 0},
            {name: '全部', key: 7},
            // {name: '单次', key: 8}
        ];

        var _self = this,
            tabItems = _map(tabs, function(tab, i){
                var selectdTab = _self.props.isInSearch ? 7 : _self.props.tab,
                    className = Utils.classList({
                        'cur': tab.key === selectdTab
                    });

                return (
                    <li key={tab.key} className={className}>
                        <a href="#"
                            data-tab={tab.key}
                            data-name={tab.name}
                            onClick={_self._handleTabClick}
                        >{now.getDay() === tab.key ? '今天' : tab.name}</a>
                    </li>
                );
            });

        return (
            <div className="table-left selector">
                <ol>
                    {tabItems}
                </ol>
            </div>
        );
    }
});

module.exports = TableSelector;
