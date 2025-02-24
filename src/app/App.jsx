import React , {useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage/ui/MainPage';
import styles from './App.module.css';
import Header from '../Header/ui/Header';
import LogInPage from '../pages/LogInPage/ui';
import ClassShedule from '../pages/ClassShedules/ui/ScheduleForm';
import Dashboard from './Dashboaard';
import { useSelector,  } from 'react-redux';
//import SignUp from '../pages/SignUp/ui/SignUp';
import Workspaces from '../pages/Workspaces/ui/Workspaces';
import Students from '../pages/Students/ui/Students';
import Board from '../pages/Board/ui/Board';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { autoLogIn } from '../Redux/userSlice';
import PageNotFound from '../pages/PageNotFound';
import AdminData from '../AdminData/ui/AdminData';
const App = () => {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(autoLogIn())
  }, [])


  const Employee = useSelector((state) => {
    return state.Employee
  })

console.log(90909909090909090,Employee)




  return (
    <BrowserRouter>
      <Header />

      <div className={styles.App} id='app'>
        <Routes >

          <Route path='/' element={<Dashboard />} />
          <Route path='*' element={<PageNotFound />} />
          
          {Employee.isAuthenticated ? <>

            <Route path='/MainPage' element={<ClassShedule />} />
            <Route path='/Workspaces' element={<Students />} />
            <Route path='/board/:id' element={<Board />} />
            <Route path='/AdminData' element={<AdminData />} />
            <Route path='/Students/:cours' element={<Students />} />
          </> : <>
            <Route path='/LogInPage' element={<LogInPage />} />
            {/* <Route path='/SignUpPage' element={<SignUp />} /> */}
          </>
          }


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
