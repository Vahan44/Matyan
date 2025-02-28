import React, { FC, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import { RiArrowDropDownLine } from "react-icons/ri";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai"
import { RootState } from "../../Redux/store";
import { useSelector } from 'react-redux';
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../Redux/userSlice";
import { server } from "typescript";
import { FaBookOpen } from "react-icons/fa"
const Header = () => {

  const user = useSelector((state) => {
    return state.Employee
  })




  const [isUserMenuOpen, setUserMenuOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [search, searchChange] = useState('')
  const navigate = useNavigate()

  const dispach = useAppDispatch()



  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  }

  const toggleCloaseUserMenu = (event) => {
    if (event.target.className !== styles.userImage && event.target.className !== styles.search) {
      setUserMenuOpen(false);
      setIsSearching(false)
    }
  }



  const toggleCloaseSearchBar = (event) => {
    if (event.target.className !== styles.search) {
      setIsSearching(false)
    }
  }



  const onSearch = (event) => {
    searchChange(event.target.value)
  }

  document.addEventListener('click', toggleCloaseSearchBar);
  document.addEventListener('click', toggleCloaseUserMenu);

  const logOut = () => {

    dispach(logout())
    navigate('/LogInPage')
  }
  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <ul className={styles.mainMenu}>

          <li>
            <Link className={styles.link} to='/'>

              <h1>Matyan</h1>
              <FaBookOpen style={{marginLeft: "5p", marginBottom: '-5px', fontSize: '18px'}}/>
            </Link>
          </li>
          {user.isAuthenticated ? <li>
            <Link className={styles.link} to='/AdminData'>
              <h3 >Տվյալներ</h3>
              <RiArrowDropDownLine />
            </Link>
          </li> : null}
          <li>
            {user.isAuthenticated ? <Link className={styles.button} to='/MainPage?creatingBoard=true'>
              Create
            </Link> : null}
          </li>
          <li>
          </li>
        </ul>


        <div className={styles.userContainer}>
          <Link to='https://github.com/Vahan44' className={styles.questiones}>
            <AiOutlineQuestionCircle />
          </Link>
          {user.isAuthenticated ? (
            <>
              <input onChange={onSearch} onClick={() => setIsSearching(true)} className={styles.search} type="text" placeholder="search" />
              {isSearching ? <div className={styles.results}>

              </div> : null}


              <img onClick={toggleUserMenu}
                src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW6M4NWghKPuAh1lEjThjCMcdSp9cn029guiwej3QjFg&s'}
                alt=""
                className={styles.userImage}

              />

              {
                isUserMenuOpen ? (
                  <div onClick={toggleUserMenu} className={styles.userMenu}>
                    <ul>
                      <li>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to='/'>
                          Matyan
                          <FaBookOpen style={{marginLeft: "5p", marginBottom: '-5px', fontSize: '18px'}}/>
                        </Link>
                      </li>
                      <li>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to='/Schedule'>
                          Դասացուցակ
                        </Link >
                      </li>
                      <li>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to='/AdminData'>
                          Տվյալներ
                        </Link>
                      </li>
                      <button className={styles.signOutButton} onClick={logOut}>Sign Out</button>
                    </ul>

                  </div>
                ) : null
              }
            </>
          ) : (
            <div className={styles.registers}>
              <Link className={styles.button} to='/logInPage'>Log in</Link>
              {/* <Link className={styles.button} to='/SignUpPage'>Sign Up</Link> */}

            </div>
          )}

        </div>
      </nav>
    </header>
  )
}

export default Header
