import React, { Fragment } from 'react';
import { useTracker } from "meteor/react-meteor-data";

class NavBarBrand extends React.Component {
    render() {
      return <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" href="#">{this.props.brand}</a>
      </div>;
    }
  };
  
  class NavBarNavLeft extends React.Component{
    render(){
      return <ul className="nav navbar-nav"></ul>
  // <ul className="nav navbar-nav">
  //             <li className="active"><a href="#">Home</a></li>
  //             <li><a href="#about">About</a></li>
  //             <li><a href="#contact">Contact</a></li>
  //             <li className="dropdown">
  //               <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
  //               <ul className="dropdown-menu">
  //                 <li><a href="#">Action</a></li>
  //                 <li><a href="#">Another action</a></li>
  //                 <li><a href="#">Something else here</a></li>
  //                 <li role="separator" class="divider"></li>
  //                 <li className="dropdown-header">Nav header</li>
  //                 <li><a href="#">Separated link</a></li>
  //                 <li><a href="#">One more separated link</a></li>
  //               </ul>
  //             </li>
  //           </ul>
        }
  }
  
  class LoginForm extends React.Component{
    constructor(props){
      super(props)

      this.state = {isLogin: true, username: "", password: "", secondPassword: "", email: ""};
      this.toggleRegister = this.toggleRegister.bind(this);
      this.onSubmitLogin = this.onSubmitLogin.bind(this);
    }

    toggleRegister(){
      this.setState(state => ({isLogin: !state.isLogin}));
    }

    setEmail(){
      this.setState(state => ({email: state}))
    }

    onSubmitLogin(e) {
      Meteor.loginWithPassword(this.state.email, this.state.password);
    };

    render(){
      let loginButton;
      let checkBoxRemember;
      let userName;
      let secondPassword;
      if (this.state.isLogin){
        loginButton = <button type="submit" className="btn btn-primary" onClick={()=>this.onSubmitLogin()}>Log in</button>;

        checkBoxRemember = <div className="form-check">
        <input type="checkbox" className="form-check-input" id="dropdownCheck2" />
        <label className="form-check-label" htmlFor="dropdownCheck2">
          Remember me
        </label>
        </div>;
        userName = "";
        secondPassword = "";
      }else {
        loginButton = <button type="submit" className="btn btn-primary">Sign in</button>;
        checkBoxRemember = "";

        userName = <div className="form-group">
          <label htmlFor="FormUserName">Name</label>
          <input type="text" className="form-control" id="FormUserName" placeholder="Name" onChange={()=>this.setState({username: this.value})}/>
        </div>;

        secondPassword = <div className="form-group">
            <label htmlFor="FormConfirmPassword">Confirm-password</label>
            <input type="password" className="form-control" id="FormConfirmPassword" placeholder="confirm password" onChange={()=>this.setState({secondPassword: this.value})}/>
          </div>;
      }

      return <Fragment> 
        <form className="dropdown-menu" style={{padding: "15px", paddingBottom: "10px", minWidth: "240px"}}>
        <ul className="nav nav-pills">
          <li role="presentation" className={this.state.isLogin?("active"):("")}><a onClick={this.toggleRegister}>Login</a>
          </li>
          <li role="presentation" className={this.state.isLogin?(""):("active")}><a onClick={this.toggleRegister}>Register</a>
          </li>
        </ul>
          {userName}
          <div className="form-group">
            <label htmlFor="FormEmail">Email address</label>
            <input type="email" className="form-control" id="FormEmail" placeholder="email@example.com" required onChange={()=>this.setState({email: this.value})} />
          </div>
          <div className="form-group">
            <label htmlFor="FormPassword">Password</label>
            <input type="password" className="form-control" id="FormPassword" placeholder="Password" required onChange={()=>this.setState({password: this.value})} />
          </div>
          {secondPassword}
          {checkBoxRemember}
          {loginButton}
        </form>
        </Fragment>
    }
  }
  
  class LoginButton extends React.Component{
    render(){
      return <li className="dropdown">
          <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Войти <span className="caret"></span></a>
          <LoginForm />
        </li>
    }
  }

  class UserButton extends React.Component{
    constructor(props){
      super(props);
    }

    render(){
      return <li className="dropdown">
        <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.user.username} <span className="caret"></span></a>
      </li>
    }
  };
  
  function NavBarNavRight() {
    const user = useTracker(() => Meteor.user());

    return <ul className="nav navbar-nav navbar-right">
        <li><p className="navbar-text">Уже есть аккаунт?</p></li>
        {this.user ? <UserButton user={this.user} /> : <LoginButton />}
      </ul>
  };
  
  function NavBarMenu(){
        return <div id="navbar" className="navbar-collapse collapse">
            <NavBarNavLeft />
            <NavBarNavRight />
          </div>;
  };

export function NavBar(){
      return <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <NavBarBrand brand="Дневник Трейдера" />
          <NavBarMenu />
        </div>
      </nav>;
    };