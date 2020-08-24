var _map  = require('lodash/map'),
    React = require('react');

var BgmHeader = React.createClass({
    propTypes: {
        archiveData: React.PropTypes.object,
        handleItemClick: React.PropTypes.func
    },
    render: function(){
        return (
            <header>
            <div className="inner">
                <h1><a href="/">番组放送</a></h1>
                <ul className="header-nav nav-left">
                    <ArchiveSelector
                        items={this.props.archiveData}
                        handleItemClick={this.props.handleItemClick}
                    />
                    <li>
                        <a
                            href="m&#97;i&#108;t&#111;:&#119;xt&#50;&#48;&#48;&#53;@gma&#105;l&#46;&#99;&#111;&#109;?subject=%e7%95%aa%e7%bb%84%e6%94%be%e9%80%81-%e9%94%99%e8%af%af%e6%8f%90%e4%ba%a4"
                            title="如果您发现数据错误，或者其它问题，请联系我">提交问题</a>
                    </li>
                </ul>
                <ul className="header-nav nav-right">
                    <li className="share-icon share-twitter">
                        <a target="_blank" href="https://twitter.com/share?url=http%3A%2F%2Fbgmlist.com%2F&text=%e6%96%b9%e4%be%bf%e5%bf%ab%e6%8d%b7%e7%9a%84%e7%89%88%e6%9d%83%e5%8a%a8%e7%94%bb%e6%92%ad%e6%94%be%e5%9c%b0%e5%9d%80%e8%81%9a%e5%90%88%e7%ab%99+-+%e7%95%aa%e7%bb%84%e6%94%be%e9%80%81">Twitter</a>
                    </li>
                    <li className="share-icon share-weibo">
                        <a target="_blank" href="http://service.weibo.com/share/share.php?title=%e6%96%b9%e4%be%bf%e5%bf%ab%e6%8d%b7%e7%9a%84%e7%89%88%e6%9d%83%e5%8a%a8%e7%94%bb%e6%92%ad%e6%94%be%e5%9c%b0%e5%9d%80%e8%81%9a%e5%90%88%e7%ab%99+-+%e7%95%aa%e7%bb%84%e6%94%be%e9%80%81&url=http%3A%2F%2Fbgmlist.com%2F">Weibo</a>
                    </li>
                    <li>
                        分享本站
                    </li>
                </ul>
            </div>
            </header>
        );
    }
});

var ArchiveSelector = React.createClass({
    propTypes: {
        items: React.PropTypes.object.isRequired,
        handleItemClick: React.PropTypes.func
    },
    getInitialState: function(){
        return {mainShow: false, subShow: false};
    },
    componentDidMount: function(){
        document.addEventListener("click", this.hideAll);
    },
    componentWillUnmount: function(){
        document.removeEventListener("click", this.hideAll);
    },
    _handleMainClick: function(e){
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({mainShow: !this.state.mainShow});
    },
    _handleSubClick: function(e){
        var subid = +e.target.getAttribute('data-subid');
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({subShow: subid});
    },
    _handleItemClick: function(e){
        e.preventDefault();
        this.props.handleItemClick(e.target.getAttribute('data-year'), e.target.getAttribute('data-month'));
        // console.log(e.target.getAttribute('href'));
    },
    hideAll: function(e){
        this.setState({mainShow: false, subShow: false});
    },
    render: function(){
        var _self = this,
            dropItems = _map(this.props.items, function(months, year){
                var monthItems = _map(months, function(path, month){
                    return (
                        <li key={month}>
                            <a
                                href="#"
                                data-year={year}
                                data-month={month}
                                onClick={_self._handleItemClick}
                            >
                                {month + '月'}
                            </a>
                        </li>
                    );
                });

                return (
                    <li key={year}>
                        <a href="#" data-subid={year} onClick={_self._handleSubClick} >{year + '年'}</a>
                        <ul className={"sub-menu" + (_self.state.subShow === +year ? " show" : "")}>
                            {monthItems}
                        </ul>
                    </li>
                );
            });

        return (
            <li className="drop">
                <a href="#" onClick={this._handleMainClick}>历史数据</a>
                <div className={"drop-menu" + (this.state.mainShow ? " show" : "")}>
                    <ul>
                        {dropItems}
                    </ul>
                </div>
            </li>
        );
    }
});

module.exports = BgmHeader;
