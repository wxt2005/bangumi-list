var _every      = require('lodash/every'),
    _map        = require('lodash/map'),
    _           = require('lodash'),
    React       = require('react'),
    Utils       = require('../mod/Utils'),
    Mixins      = require('./Mixins'),
    Actions     = require('../action/Actions'),
    configStore = require('../store/BgmConfigStore'),
    dataStore   = require('../store/BgmDataStore'),
    sitesStore  = require('../store/BgmSitesStore');

var PanelSwitch = React.createClass({
    propTypes: {
        configName: React.PropTypes.string.isRequired,
        children: React.PropTypes.string.isRequired,
        value: React.PropTypes.bool,
        changeHandler: React.PropTypes.func
    },
    getDefaultProps: function(){
        return {
            value: false
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            value: nextProps.value
        });
    },
    getInitialState: function(){
        return {
            value: this.props.value
        };
    },
    _handleChange: function(e){
        this.setState({
            value: e.target.checked
        });
        this.props.changeHandler(this.props.configName, e.target.checked);
    },
    render: function(){
        var className = Utils.classList({
            check: true,
            on: this.state.value
        });

        return (
            <li>
                <label htmlFor={this.props.configName}>
                    {this.props.children}
                    <span className={className}></span>
                </label>
                <input
                    type="checkbox"
                    id={this.props.configName}
                    onChange={this._handleChange}
                    checked={this.state.value}
                />
            </li>
        );
    }
});

var NumberSelector = React.createClass({
    propTypes: {
        configName: React.PropTypes.string.isRequired,
        children: React.PropTypes.string.isRequired,
        value: React.PropTypes.number.isRequired,
        maxNumber: React.PropTypes.number,
        minNumber: React.PropTypes.number,
        changeHandler: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            value: this.props.value
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            value: nextProps.value
        });
    },
    _handleAddBtnClick: function(e){
        e.preventDefault();
        this._changeNumber(1);
    },
    _handleMinusBtnClick: function(e){
        e.preventDefault();
        this._changeNumber(-1);
    },
    _changeNumber: function(operate){
        var oldValue = this.state.value,
            maxNumber = this.props.maxNumber,
            minNumber = this.props.minNumber,
            newValue;

        switch(operate){
            case 1:
                newValue = oldValue >= maxNumber ? maxNumber : oldValue + 1;
                break;
            case -1:
                newValue = oldValue <= minNumber ? minNumber : oldValue - 1;
                break;
            default:
        }

        this.setState({
            value: newValue
        });

        this.props.changeHandler(this.props.configName, newValue);
    },
    render: function(){
        var minusBtnClassName = Utils.classList({
            'number-control-btn': true,
            'left-arrow': true,
            'disabled': this.state.value <= this.props.minNumber
        }),
            addBtnClassName = Utils.classList({
            'number-control-btn': true,
            'right-arrow': true,
            'disabled': this.state.value >= this.props.maxNumber
        });

        return (
            <li>
                <label htmlFor={this.props.configName}>{this.props.children}</label>
                <div className="number-selector">
                    <a
                        href="#"
                        className={minusBtnClassName}
                        onClick={this._handleMinusBtnClick}
                    >减小</a>
                    <input
                        type="number"
                        id={this.props.configName}
                        readOnly
                        value={this.state.value}
                    />
                    <a
                        href="#"
                        className={addBtnClassName}
                        onClick={this._handleAddBtnClick}
                    >增大</a>
                </div>
            </li>
        );
    }
});

var SelectList = React.createClass({
    propTypes: {
        configName: React.PropTypes.string.isRequired,
        children: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
        changeHandler: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            value: this.props.value
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            value: nextProps.value
        });
    },
    _handleChange: function(event) {
        var newValue = event.target.value;
        this.props.changeHandler(this.props.configName, newValue);
    },
    render: function() {
        var options = this.props.options.map(function(option) {
            return (
                <option
                    value={option.value}
                    key={option.value}
                >
                    {option.title || option.value}
                </option>
            );
        });

        return (
            <li>
                <label htmlFor={this.props.configName}>{this.props.children}</label>
                <select
                    className="select-list"
                    id={this.props.configName}
                    value={this.props.value}
                    onChange={this._handleChange}
                >
                    {options}
                </select>
            </li>
        );
    }
});

var BgmPreferences = React.createClass({
    mixins: [Mixins.configMixin, Mixins.sitesMixin],
    propTypes: {
        show: React.PropTypes.bool,
        toggleHandler: React.PropTypes.func
    },
    getInitialState: function(){
        return {
            config: configStore.getConfig(),
            supportSites: sitesStore.getSites(),
            show: this.props.show
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            show: nextProps.show
        });
    },
    _handleConfigChange: function(name, value){
        var configObj = {};
        configObj[name] = value;
        Actions.updateConfig(configObj);
    },
    _handleSiteChange: function(name, value){
        Actions.toggleSite(name.split('_')[1], value);
    },
    _handleSiteAll: function(e){
        e.preventDefault();
        Actions.toggleAllSites(!this._sitesAllEnabled());
    },
    _sitesAllEnabled: function(){
        return _every(this.state.supportSites, function(info, site){
            return info.enable;
        });
    },
    _handleConfirm: function(e){
        e.preventDefault();
        Actions.saveConfig();
        Actions.saveSites();
        this.props.toggleHandler(e);
    },
    _handleExport: function(e){
        var data, dn, blob;
        e.preventDefault();
        data = dataStore.getData();
        dn = this.refs.exportSetting.getDOMNode();
        blob = new Blob(
            [JSON.stringify(_.assign({}, {
                config: this.state.config,
                supportSites: this.state.supportSites,
                data: {
                    path: data.path,
                    version: data.version,
                    items: _.pickBy(data.items, function(val, key) {
                        return val.hide || val.highlight
                    })
                }
            }))],
            {type: "application/json"}
        );
        dn.href = URL.createObjectURL(blob);
        dn.click();
        this.props.toggleHandler(e);
    },
    _handleImport: function(e){
        e.preventDefault();
        var fileSelector = this.refs.importSetting.getDOMNode();
        fileSelector.onchange = function() {
            var files = fileSelector.files;
            if (files.length) {
                var reader = new FileReader();
                reader.onload = function () {
                    try {
                        var setting = JSON.parse(reader.result);
                        Actions.updateConfig(setting.config);
                        Actions.importSites(setting.supportSites);
                        Actions.importData(setting.data);
                    } catch (e) {
                        alert('无效');
                    }
                }
                reader.readAsText(files[0]);
            }
        };
        fileSelector.click();
    },
    _handleReset: function(e){
        e.preventDefault();
        Actions.showDialog(
            'warning',
            '重置不仅会清除您的设置，还会清除您对作品的关注/隐藏记录，请问您确定要重置吗？',
            [{
                text: '确定',
                callback: () => {
                    Actions.resetConfig();
                    Actions.resetSites();
                    Actions.resetData();
                    location.reload(true);
                }
            },{
                text: '取消',
                callback: () => {}
            }]
        );
    },
    render: function(){
        var SiteToggles = _map(this.state.supportSites, function(info, domain){
            return (
                <PanelSwitch
                    key={domain}
                    configName={'Site_' + domain}
                    changeHandler={this._handleSiteChange}
                    value={info.enable}
                >{info.name}</PanelSwitch>
            );
        }.bind(this));

        return (
            <div className={"setting-mask" + (this.state.show ? " show" : "")}>
                <div className="setting">
                    <div className="setting-col">
                        <div className="setting-left">
                            <h3>显示设置</h3>
                            <div className="setting-display setting-box">
                                <ul>
                                    <PanelSwitch
                                        configName="newOnly"
                                        changeHandler={this._handleConfigChange}
                                        value={this.state.config.newOnly}
                                    >只显示新番</PanelSwitch>
                                    <PanelSwitch
                                        configName="noAutoSwitch"
                                        changeHandler={this._handleConfigChange}
                                        value={this.state.config.noAutoSwitch}
                                    >关闭自动切换</PanelSwitch>
                                    <PanelSwitch
                                        configName="disableNewTab"
                                        changeHandler={this._handleConfigChange}
                                        value={this.state.config.disableNewTab}
                                    >当前页面打开</PanelSwitch>
                                    <PanelSwitch
                                        configName="jpTitle"
                                        changeHandler={this._handleConfigChange}
                                        value={this.state.config.jpTitle}
                                    >显示日文标题</PanelSwitch>
                                    <PanelSwitch
                                        configName="highlightOnly"
                                        changeHandler={this._handleConfigChange}
                                        value={this.state.config.highlightOnly}
                                    >只显示关注</PanelSwitch>
                                    <NumberSelector
                                        configName="dayDivide"
                                        changeHandler={this._handleConfigChange}
                                        value={this.state.config.dayDivide}
                                        maxNumber={30}
                                        minNumber={5}
                                    >转到次日</NumberSelector>
                                    <SelectList
                                        configName="bangumiDomain"
                                        value={this.state.config.bangumiDomain}
                                        options={
                                            [
                                                {value: 'bangumi.tv'},
                                                {value: 'bgm.tv'},
                                                {value: 'chii.in'},
                                            ]
                                        }
                                        changeHandler={this._handleConfigChange}
                                    >Bangumi域名</SelectList>
                                </ul>
                            </div>
                        </div>
                        <div className="setting-right">
                            <h3>站点过滤</h3>
                            <a
                                href="#"
                                className="check-all"
                                onClick={this._handleSiteAll}
                            >{this._sitesAllEnabled() ? '全不选' : '全选'}
                            </a>
                            <div className="setting-sites setting-box">
                                <ul>
                                    {SiteToggles}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <a
                        href="#"
                        className="setting-confirm"
                        onClick={this._handleConfirm}
                    >确定</a>
                    <a
                        href="#"
                        target="_blank"
                        className="setting-confirm"
                        onClick={this._handleExport}
                    >导出</a>
                    <a
                        href="#"
                        target="_blank"
                        className="setting-confirm"
                        onClick={this._handleImport}
                    >导入</a>
                    <a
                        href="#"
                        className="setting-reset"
                        onClick={this._handleReset}
                    >重置</a>
                    <input
                        type="file"
                        accept="json"
                        className="setting-import"
                        ref="importSetting"
                        style={{display: 'none'}}
                    />
                    <a
                        href="#"
                        target="_blank"
                        className="setting-export"
                        ref="exportSetting"
                        style={{display: 'none'}}
                        download="bgmlist-setting.json"
                    >导出</a>
                </div>
            </div>
        );
    }
});

module.exports = BgmPreferences;
