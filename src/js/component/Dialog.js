var 
//_           = require('../lib/lodash.custom'),
    React       = require('react');
//    Utils       = require('../mod/Utils'),
//    Mixins      = require('./Mixins'),
//    Actions     = require('../action/Actions'),
//    configStore = require('../store/BgmConfigStore'),
//    sitesStore  = require('../store/BgmSitesStore');



var Dialog = React.createClass({
    propTypes: {
        type: React.PropTypes.oneOf('info','error','warning'),
        content: React.PropTypes.string,
        buttons: React.PropTypes.arrayOf(React.PropTypes.shape({
            text: React.PropTypes.string,
            callback: React.PropTypes.func
        }))
    },
    getInitialState: function(){
        return {
            show: false,
            buttons: this.props.buttons.length ? this.props.buttons : [{text: '确定', callback: ()=>{}}]
        };
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            buttons: nextProps.buttons.length ? nextProps.buttons : [{text: '确定', callback: ()=>{}}]
        });
    },
    show: function(){
        this.setState({show: true});
    },
    _buttonClick: function(index){
        this.setState({show: false});
        this.state.buttons[index].callback();
    },
    render: function(){
        return (
            <div className={"dialog-mask" + (this.state.show ? " show" : "")}>
                <div className={"dialog " + this.props.type}>
                    <div className="title">
                      <h3>{{info:'提醒', warning:'警告', error:'错误'}[this.props.type]}</h3>
                    </div>
                    <div className="content">
                      <p>{this.props.content}</p>
                    </div>
                    <div className="footer">
                    {this.state.buttons.map((button,index) => <a href="#" className="button" onClick={this._buttonClick.bind(this, index)}>{button.text}</a>)}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Dialog;
// vim: set expandtab ts=4 sw=4:
