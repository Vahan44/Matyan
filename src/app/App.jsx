import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styles from './App.module.css';
import Header from '../Header/ui/Header';
import LogInPage from '../pages/LogInPage/ui/LogInPage';
import ClassShedule from '../pages/ScheduleForm/ui/ScheduleForm';
import Dashboard from './Dashboaard';
import { useSelector, } from 'react-redux';
import Students from '../pages/Students/ui/Students';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { autoLogIn } from '../Redux/userSlice';
import PageNotFound from '../pages/PageNotFound';
import Course from '../pages/Course/ui/Course';
import AdminData from '../pages/AdminData/ui/AdminData';
import Employees from '../pages/Employees/ui/Employees';
import Institute from '../pages/Institutes/ui/Institutes';
import Schedules from '../pages/Schedules/ui/Schedules';
import Lessons from '../pages/Lessons/ui/Lessons';
import TeacherInterface from '../pages/TeacherInterface/ui/TeacherInterface';
import EmployeeSchedule from '../pages/EmployeeSchedule/ui/EmployeeSchedule';
import PublicSchedule from '../pages/PublicSchedule/ui/PublicSchedule';
import Matyan from '../pages/Matyan/ui/Matyan';
const App = () => {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(autoLogIn())
  }, [])


  const Employee = useSelector((state) => {
    return state.Employee
  })

  console.log(90909909090909090, Employee)




  return (
    <BrowserRouter>
      <Header />

      <div className={styles.App} id='app'>
        <Routes >
          <Route path='*' element={<PageNotFound />} />
          <Route path='PublicSchedule/:course' element={<PublicSchedule />} />
          <Route path='/Schedules' element={<Schedules />} />

          {Employee.isAuthenticated ? <>



            {Employee.user.Role === 'Ադմինիստրատոր' ?

              <>
                <Route path='/' element={<AdminData />} />

                <Route path='/Schedules' element={<Schedules />} />
                <Route path='/Schedule/:course' element={<ClassShedule />} />
                <Route path='/AdminData/' element={<AdminData />} />
                <Route path='/Course/:page' element={<Course />} />
                <Route path='/Institutes' element={<Institute />} />
                <Route path='/Lessons/:course' element={<Lessons />} />
                <Route path='/Students/:course' element={<Students />} />
                <Route path='/Employees/:IdParam' element={<Employees />} />


              </> : <>
              <Route path='/' element={<TeacherInterface/>} />
              <Route path='/EmployeeSchedule' element={<EmployeeSchedule />} />
              <Route path='/Matyan/:data' element={<Matyan />} />
              <Route path='/Employees/:IdParam' element={<Employees />} />

              </>

            }

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
