import React, { useState } from 'react';
import { useTracker } from "meteor/react-meteor-data";
import { Accounts } from 'meteor/accounts-base';

// TODO:
// 1. обработка ошибок авторизации, и регистрации
// 2. Добавить кнопки настройки пользователя

// Заголовок меню
const NavBarBrand =(props)=> {
  function onClickHandle(){
    props.setItemMenu(0);
  }
  return <div className="navbar-header">
    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
      <span className="sr-only">Toggle navigation</span>
      <span className="icon-bar"></span>
      <span className="icon-bar"></span>
      <span className="icon-bar"></span>
    </button>
    <a className="navbar-brand" onClick={onClickHandle}>{props.brand}</a>
  </div>;
};

// кнопки слева
const NavBarNavLeft = (props) => {
  function onClickHandle(){
    props.setItemMenu(0);
  }

  return <ul className="nav navbar-nav">
    <li className={props.itemMenu == 0? "active":""}><a onClick={onClickHandle}>Дневник <span className="sr-only">(current)</span></a>
    </li></ul>
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

// выпадающее меню авторизации
const LoginFormFunc = () => {
  const [isLoginForm, toggleRegister] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSPassw] = useState("");

  function onSubmitLogin(e){
    e.preventDefault();
    Meteor.loginWithPassword(email, password);
  }

  function registerNewUser(e){
    Accounts.createUser({email: email, 
      password: password,
      profile:{name: username}});
    
    Meteor.call('settings.insert','1h'); // default tf
    e.preventDefault();
  }

  let userName = "";
  let loginButton = <button type="submit" className="btn btn-primary" onClick={onSubmitLogin}>Войти</button>;
  let formSecondPassword = "";
  if (!isLoginForm){
    userName = <div className="form-group">
      <label htmlFor="FormUserName">Name</label>
      <input type="text" className="form-control" id="FormUserName" placeholder="Name" onChange={(e)=>setUsername(e.target.value)}/>
    </div>;

    formSecondPassword = <div className="form-group">
      <label htmlFor="FormConfirmPassword">Confirm-password</label>
      <input type="password" className="form-control" id="FormConfirmPassword" placeholder="confirm password" onChange={(e)=> setSPassw(e.target.value)}/>
    </div>;

    loginButton = <button type="submit" className="btn btn-primary" onClick={registerNewUser}>Регистрация</button>;
  }

  return <form className="dropdown-menu" style={{padding: "15px", paddingBottom: "10px", minWidth: "240px"}}>
    <ul className="nav nav-pills">
      <li role="presentation" className={isLoginForm?("active"):("")}><a onClick={() => toggleRegister(!isLoginForm)}>Войти</a>
      </li>
      <li role="presentation" className={isLoginForm?(""):("active")}><a onClick={() => toggleRegister(!isLoginForm)}>Регитсрация</a>
      </li>
    </ul>
    {userName}
    <div className="form-group">
      <label htmlFor="FormEmail">Email address</label>
      <input type="email" className="form-control" id="FormEmail" placeholder="email@example.com" required onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div className="form-group">
      <label htmlFor="FormPassword">Password</label>
      <input type="password" className="form-control" id="FormPassword" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
    </div>
    {formSecondPassword}
    {loginButton}
  </form>
}

// кнопка логин регистрация
const LoginButton =()=>{
  return <li className="dropdown">
      <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Войти <span className="caret"></span></a>
      <LoginFormFunc />
    </li>
}

const ExitButton = (props) => {
  function onClickExit(){
    Meteor.logout();
  }

  return <li><a onClick={onClickExit}>Выйти</a></li>
}

const SettingsButton = (props) => {
  function handeSettings(e){
    props.setItemMenu(1);
  }

  return <li><a onClick={handeSettings}>Настройки</a></li>
}

// кнопка пользователя
const UserButton = (props) => {
  return <li className="dropdown">
    <a className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{props.user.profile.name} <span className="caret"></span></a>
      <ul className="dropdown-menu">
        <SettingsButton setItemMenu={props.setItemMenu}/>
        <li role="separator" className="divider"></li>
        <ExitButton />
      </ul>
  </li>
};
 
// либо кнопка доступа к настройкам, либо логин регистрация
const NavBarNavRight = (props) => {

  return <ul className="nav navbar-nav navbar-right">
      <li><p className="navbar-text">Уже есть аккаунт?</p></li>
      {props.user ? 
      <UserButton user={props.user} setItemMenu={props.setItemMenu}/> : 
      <LoginButton />}
    </ul>
};

// меню из двух частей, та что к заголовку и справа
const NavBarMenu = (props) => {
      return <div id="navbar" className="navbar-collapse collapse">
          <NavBarNavLeft setItemMenu={props.setItemMenu} itemMenu={props.itemMenu}/>
          <NavBarNavRight user={props.user} setItemMenu={props.setItemMenu}/>
        </div>;
};

// сам NavBar, тут заголовок + меню
export const NavBar = (props) => {
  return <nav className="navbar navbar-default navbar-fixed-top">
    <div className="container">
      <NavBarBrand brand="Дневник Трейдера" setItemMenu={props.setItemMenu} itemMenu={props.itemMenu} />
      <NavBarMenu user={props.user} setItemMenu={props.setItemMenu} itemMenu={props.itemMenu}/>
    </div>
  </nav>;
};