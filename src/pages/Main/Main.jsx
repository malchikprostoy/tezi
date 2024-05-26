import React, { useContext, useState } from 'react';
import logo from '../../assets/img/Manas_logo.png';
import './Main.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../LanguageContext';
import Footer from '../../components/footer/Footer';

const Main = ({ setUserName }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { lang, content, changeLanguage } = useContext(LanguageContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserName(name);
    localStorage.setItem('userName', name);
    navigate(`/lesson?name=${name}`);
  };

  const handleLangChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="main">
      <div className="header">
        <div className="container" id="header">
          <div className="header__left">
            <img src={logo} width={60} alt='Logo'/>
          </div>
          <div className="header__right">
            <select value={lang} onChange={handleLangChange} className="change-lang">
              <option value="tr">TR</option>
              <option value="kg">KG</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>
        </div>
      </div>
      <div className="middle d-flex justify-content-center align-items-center">
        <form className='form d-flex flex-column align-items-center justify-content-center' onSubmit={handleSubmit}>
          <label className="d-flex flex-column" htmlFor="name">  
            {content.text}
            <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button type='submit'>{content.button}</button>
        </form>
      </div>
      <Footer content={content} />
    </div>
  );
};

export default Main;
