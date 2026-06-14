import React from 'react'
import './header.css'
import { Link, NavLink } from 'react-router-dom'

const header = () => {
  return (
    <>
       <header>
      <div className="header-top">
        <div className="img-container">
          <Link to="/">
            <img src="https://raw.githubusercontent.com/DevJuanP/proyecto_CIBERTEC/refs/heads/main/img/logo.webp" alt="logo" />
          </Link>
        </div>

        <div className="Login-container">
          <Link to="/login" className="login-link">
            <span className="login-icon">👤</span>
            <span>Iniciar sesión</span>
          </Link>
        </div>
      </div>

      <nav className="header-bottom">
        <div className="menu-container">
          <ul className="menu">
            <li className="main-items">
              CATÁLOGO
              <ul className="submenu">
                <li className="Laptops">Laptops
                  <ul className="Laptops-submenu sub-submenu">
                    <li className="third-item">
                      <NavLink to="/productos/laptops_gaming">Laptops Gamer</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/laptops_otras">Otros</NavLink>
                    </li>
                  </ul>
                </li>

                <li className="armadas">PC Armadas
                  <ul className="armadas-submenu sub-submenu">
                    <li className="third-item">
                      <NavLink to="/productos/pc_combos">Combos Gamer</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/pc_profesional">PC Profesional</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/pc_oficinas">PC Oficina</NavLink>
                    </li>
                  </ul>
                </li>

                <li className="componentes">Componentes
                  <ul className="componentes-submenu sub-submenu">
                    <li className="third-item">
                      <NavLink to="/productos/componentes_monitores">Monitores</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/componentes_cases">Cases</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/componentes_mb">Placas madre</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/componentes_ram">Ram</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/componentes_cpus">CPU</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/componentes_memorias">Memorias HDD-SSD</NavLink>
                    </li>
                    <li className="third-item">
                      <NavLink to="/productos/componentes_otros">Otros</NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <h2>•</h2>
            <li className="main-items">
              <Link to="/servicios">NUESTROS SERVICIOS</Link>
            </li>

            <h2>•</h2>

            <li className="main-items">
              <Link to="/locales">NUESTROS LOCALES</Link>
            </li>

            <h2>•</h2>

            <li className="main-items">
              <Link to="/pago">MODALIDAD DE PAGO</Link>
            </li>

            <h2>•</h2>

            <li className="main-items">
              <Link to="/delivery">DELÍVERY</Link>
            </li>

            <h2>•</h2>

            <li className="main-items">
              <Link to="/negocio">MODELO DE NEGOCIO</Link>
            </li>

            <h2>•</h2>

            <li className="main-items">
              <Link to="/citas">CITAS</Link>
            </li>
            

          </ul>
      
        </div>
      </nav>
    </header>
    </>
  )
}

export default header