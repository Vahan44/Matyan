import { useSelector } from "react-redux"
import { RootState } from '../Redux/store';
import { FC, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const Employee = useSelector((state) => state.Employee);


    


    // console.log(workspaces)
      const navigate = useNavigate()

        
    Employee.isAuthenticated ? navigate('/MainPage') : navigate('/LogInPage')
      return (
        <h1 style={{color: 'white'}}>
            Loading ...
        </h1>
      )
}


export default Dashboard