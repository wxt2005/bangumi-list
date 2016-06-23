var _           = require('lodash'),
    React       = require('react'),
    Utils       = require('../mod/Utils'),
    configStore = require('../store/BgmConfigStore'),
    sitesStore  = require('../store/BgmSitesStore');

var ItemSites = React.createClass({
    propTypes: {
        sites: React.PropTypes.array.isRequired,
        supportSites: React.PropTypes.object,
        disableNewTab: React.PropTypes.bool
    },
    _handleClick: function(e){
        e.stopPropagation();
    },
    render: function(){
        var siteItems = _(this.props.sites)
            .filter(function(url){
                return Utils.getLinkSite(url, this.props.supportSites).enable;
            }.bind(this))
            .sortBy(function(url){
                return Utils.getLinkSite(url, this.props.supportSites).name;
            }.bind(this))
            .map(function(url, i){
                var siteName = Utils.getLinkSite(url, this.props.supportSites).name;
                return (
                    <li key={i}>
                        <a
                            href={encodeURI(decodeURI(url))}
                            onClick={this._handleClick}
                            target={this.props.disableNewTab ? '_self' : '_blank'}
                        >{siteName}</a>
                    </li>
                );
            }.bind(this)).value();

        if(!siteItems.length){
            if(this.props.sites && this.props.sites.length){
                siteItems.push(<li key={0}><span className="empty">过滤</span></li>);
            }else{
                siteItems.push(<li key={0}><span className="empty">暂无</span></li>);
            }
        }

        return (
            <div className="sites">
                <ul>
                    {siteItems}
                </ul>
            </div>
        );
    }
});

module.exports = ItemSites;
