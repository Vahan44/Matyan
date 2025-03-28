import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import { RiArrowDropDownLine } from "react-icons/ri";
import './AdminData.css'
const AdminData = () => {
    const navigate = useNavigate()
       const Employee = useSelector((state) => state.Employee);
    return (
         <div className="admin-container">
              <div className="workspaceHeader">
            <img
              src={'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg'}
              alt='' />
            <p>{Employee.user.FirstName} {Employee.user.LastName} {Employee.user.Role === "Ադմինիստրատոր" ? "Ադմինիստրատոր" : "Դասախոս"}</p>
          </div>
          <h4>Հասանելի տվյալներ</h4>
          <hr />
          <ul ></ul>
              <div className="admin-list">
                  <div onClick={()=> navigate(`/Course/Students`)} className="admin-item">
                   
                      <h4>Ուսանողներ</h4>
                    

                  </div>
                  <div onClick={()=>navigate('/Institutes')} className="admin-item">
                      <h4>Դաասխոսներ</h4>

                  </div>
                  <div onClick={()=> navigate(`/Course/Lessons`)} className="admin-item">
                      <h4>Դասընթացներ</h4>
                    

                  </div>
                  <div  onClick = {()=> navigate(`/Schedules`)}className="admin-item">
                    
                      <h4>Դասացուցակներ</h4>
                    

                  </div>
              </div>
              
            </div>
    )
}

export default AdminData