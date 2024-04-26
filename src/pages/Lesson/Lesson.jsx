import React from 'react'
import logo from '../../assets/img/Manas_logo.png'
import './Lesson.scss'
import { useLocation, useNavigate } from 'react-router-dom'

const Lesson = ({userName}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const name = searchParams.get('name');

    const handleLogoClick = () => {
        navigate('/')
    }

    const handleRussianClick = () => {
        navigate('/russian')
    }

    
  return (
    <div className='lesson'>
        <div className="header">
            <div className="container" id="header">
                <div className="header__left">
                    <a onClick={handleLogoClick}><img src={logo} width={60} alt='Logo'/></a>
                </div>
                <div className="header__right">
                    <span className="name-user">{userName}</span>
                </div>
            </div>
        </div>  
        <div className="middle">
            <div className="mid">
                <button className='btn'>Türkçe</button>
                <button className='btn'>Кыргыз тили</button>
                <button className='btn'onClick={handleRussianClick}>Русский язык</button>
                <button className='btn'>English</button>
            </div>
        </div>
        <footer class="footer">
            <div class="container">
                <div class="lng-footer">© 2023 KIRGIZİSTAN-TÜRKİYE MANAS ÜNİVERSİTESİ</div>
            </div>
        </footer>
    </div>
  )
}

export default Lesson