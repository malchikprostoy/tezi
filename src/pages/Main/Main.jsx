import React, { useEffect, useState } from 'react'
import logo from '../../assets/img/Manas_logo.png'
import './Main.scss'
import { useNavigate } from 'react-router-dom'
import Translation from '../../Data.json'
import Russian from '../Exam/Russian/Russian'

const Main = () => {
    const [name, setName] = useState('')
    const navigate = useNavigate();
    const [lang, setLang] = useState("tr")
    const [content, setContent] = useState({})

    const handleInputChange = (e) => {
        setName(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate(`/lesson?name=${name}`);
    };

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
    })
  return (
    <div className='main'>
        <div className="header">
            <div className="container" id="header">
                <div className="header__left">
                    <a href="#"><img src={logo} width={60} alt='Logo'/></a>
                </div>
                <div className="header__right">
                    <select value={lang} onChange={(e)=>{setLang(e.target.value)}} className="change-lang">
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
                    <input type="text" value={name} onChange={handleInputChange}/>
                </label>
                <button onClick={handleSubmit} type='submit'>{content.button}</button>
            </form>
        </div>
        <footer class="footer">
            <div class="container">
                <div class="lng-footer">{content.footer}</div>
            </div>
        </footer>
        <Russian name={name} />
    </div>
  )
}

export default Main