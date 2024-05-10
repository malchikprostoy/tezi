import React, { useEffect, useState } from 'react'
import logo from '../../assets/img/Manas_logo.png'
import './Main.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'
import Translation from '../../Data.json'

const Main = ({setUserName}) => {
    const [ name, setName] = useState('')
    const navigate = useNavigate();
    const [lang, setLang] = useState("tr")
    const [content, setContent] = useState({})
    

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            setUserName(savedName);
            setName(savedName)
        }

        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            setLang(savedLang);
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserName(name);
        localStorage.setItem('userName', name);
        navigate(`/lesson?name=${name}`);
    }

    const handleLangChange = (e) => {
        const selectedLang = e.target.value;
        setLang(selectedLang);
        localStorage.setItem('language', selectedLang);
    }

    useEffect(()=>{
        if(lang==="tr"){
            setContent(Translation.tr)
        } else if(lang==="kg") {
            setContent(Translation.kg)
        } else if(lang==="ru") {
            setContent(Translation.ru)
        } else if(lang==="en") {
            setContent(Translation.en)
        }
    }, [lang])
  return (
    <div className='main'>
        <div className="header">
            <div className="container" id="header">
                <div className="header__left">
                    <a href="#"><img src={logo} width={60} alt='Logo'/></a>
                </div>
                <div className="header__right">
                    <select value={lang} onChange={handleLangChange} className="change-lang">
                        <option value="tr" selected>TR</option>
                        <option value="kg">KG</option>
                        <option value="ru">RU</option>
                        <option value="en">EN</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="middle">
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">  
                {content.text}
                    <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                <button type='submit'>{content.button}</button>
            </form>
        </div>
        <footer class="footer d-flex justify-content-center align-items-center fixed">
            <div class="container d-flex justify-content-center align-items-center">
                <div class="lng-footer">{content.footer}</div>
            </div>
        </footer>
    </div>
  )
}

export default Main