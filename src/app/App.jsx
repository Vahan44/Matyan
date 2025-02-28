import React , {useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styles from './App.module.css';
import Header from '../Header/ui/Header';
import LogInPage from '../pages/LogInPage/ui';
import ClassShedule from '../pages/ScheduleForm/ui/ScheduleForm';
import Dashboard from './Dashboaard';
import { useSelector,  } from 'react-redux';
//import SignUp from '../pages/SignUp/ui/SignUp';
import Students from '../pages/Students/ui/Students';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { autoLogIn } from '../Redux/userSlice';
import PageNotFound from '../pages/PageNotFound';
import Course from '../pages/Course/ui/Course';
import AdminData from '../pages/AdminData/ui/AdminData';
import Employees from '../pages/Employees/ui/Employees';
import Institute from '../pages/Institutes/ui/Institutes';
import Schedules from '../pages/Schedules/ui/Schedules';
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
        <Route path='*' element={<PageNotFound />} />
        {Employee.isAuthenticated ? <>
          <Route path='/' element={<AdminData />} />
          
         

            <Route path='/Schedules' element={<Schedules />} />
            <Route path='/Schedule/:course' element={<ClassShedule />} />
            <Route path='/AdminData' element={<AdminData />} />
            <Route path='/Course' element={<Course/>} />
            <Route path='/Institutes' element={<Institute />} />

            <Route path='/Students/:course' element={<Students />} />
            <Route path='/Employees/:Institute' element={<Employees />} />

          </> : <>
            <Route path='/LogInPage' element={<LogInPage />} />
            <Route path='/' element={<LogInPage />} />
            {/* <Route path='/SignUpPage' element={<SignUp />} /> */}
          </>
          }


        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
