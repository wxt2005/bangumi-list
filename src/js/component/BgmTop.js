var React = require('react');

var BgmTop = React.createClass({
    propTypes: {
        handleSearch: React.PropTypes.func.isRequired,
        month: React.PropTypes.number,
        year: React.PropTypes.number,
        count: React.PropTypes.number
    },
    render: function(){
        return (
            <div className="top">
                <div className="inner">
                    <h2>{this.props.year + '年' + this.props.month + '月番组'}</h2>
                    <div className="search-box">
                        <p>本季共 {this.props.count} 部番组</p>
                        <BgmSearcher handleSearch={this.props.handleSearch} />
                    </div>
                </div>
            </div>
        );
    }
});

var BgmSearcher = React.createClass({
    propTypes: {
        handleSearch: React.PropTypes.func.isRequired
    },
    handleInput: function(e){
        var val = React.findDOMNode(this.refs.searchInput).value.trim();
        this.props.handleSearch(val);
    },
    render: function(){
        return (
            <div className="searcher">
                <input
                    type="search"
                    placeholder="搜索当季番组"
                    ref="searchInput"
                    onChange={this.handleInput}
                />
                <div className="search-btn" title="搜索">搜索</div>
            </div>
        );
    }
});

module.exports = BgmTop;