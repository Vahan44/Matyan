import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from "../../../Redux/Employees";
import { fetchInstitutes } from "../../../Redux/InstitutesSlice";
import { FaPlus } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdSave } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import validator from "validator";
import "./Employees.css";
import bcrypt from "bcryptjs";
import PasswordChecklist from "react-password-checklist"
const Employees = () => {
    const { IdParam } = useParams();

    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees?.list);
    const Institutes = useSelector((state) => state.institutes?.list);
    const user = useSelector((state) => {
        return state.Employee
    })
    const [employeeData, setEmployeeData] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [newEmployee, setNewEmployee] = useState({
        FirstName: "",
        LastName: "",
        InstituteID: "",
        Role: "",
        Username: "",
        Password: "",
        Email: "",
        Profession: ""
    });
	const [emailError, setEmailError] = useState(true);
	const [emailError1, setEmailError1] = useState(true);


    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchInstitutes());
    }, [dispatch]);

    useEffect(() => {
        if (user.user.Role === "Ադմինիստրատոր") {
            setEmployeeData(employees.filter((s) => (s.InstituteID) == (IdParam)));
        }
        else {
            setEmployeeData(employees.filter((s) => (s.UserID) == user?.user?.UserID));
        }
        if (IdParam) {
            setNewEmployee(prevState => ({ ...prevState, InstituteID: IdParam }));
        }
    }, [employees, IdParam, user]);



    const handleChange = (id, field, value) => {

         if(field === 'Email'){
              const email = value
        
              if (validator.isEmail(email) || email === '') {
                setEmailError1(true);
              } 
              else {
                setEmailError1(false);
              }
            }

        setEmployeeData((prev) =>
            prev.map((employee) =>
                employee.UserID === id ? { ...employee, [field]: value } : employee
            )
        );
    };

    const handleSave = async (id) => {
        const updatedEmployee = employeeData.find((employee) => employee.UserID === id);
        if (isObjectComplete(updatedEmployee)) {
            if(emailError1){
            try {
                const hashedPassword = await Hashing(updatedEmployee.Password);
                const hashedNewEmployee = { ...updatedEmployee, Password: hashedPassword };

                dispatch(updateEmployee(hashedNewEmployee));
                setEditMode(null);
            } catch (error) {
            }
        }else alert("Ներմուծեք գործող էլ. հասցէ")
        }
        else alert('"Լռացրեք Աշխատակցի բոլոր տվյալները"')

    };

    const handleDelete = (id) => {
        dispatch(deleteEmployee(id));
        setEmployeeData((prev) => prev.filter((employee) => employee.UserID !== id));
    };

    const handleNewEmployeeChange = (e) => {

        if(e.target.name === 'Email'){
              const email = e.target.value;
        
              if (validator.isEmail(email) || email === '') {
                setEmailError(true);
              } 
              else {
                setEmailError(false);
              }
            }

        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };
    async function Hashing(password) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }
    const isObjectComplete = (obj) => {
        return Object.values(obj).every(value => value !== null && value !== undefined && value !== "");
    };
    const handleAddEmployee = async () => {
        if (isObjectComplete(newEmployee)) {
            if(emailError){

                try {
                    const hashedPassword = await Hashing(newEmployee.Password);
                    const hashedNewEmployee = { ...newEmployee, Password: hashedPassword };
    
                    dispatch(addEmployee(hashedNewEmployee));
                    setEmployeeData((prev) => [...prev, hashedNewEmployee]);
    
                    setNewEmployee({
                        FirstName: "",
                        LastName: "",
                        InstituteId: IdParam,
                        Role: "",
                        Username: "",
                        Password: "",
                        Email: "",
                        Profession: ""
                    });
                } catch (error) {
                    console.error("Error hashing password:", error);
                }
                setEmailError(true)

            }else alert("Ներմուծեք գործող էլ. հասցէ")
            
        } else alert("Լռացրեք Աշխատակցի բոլոր տվյալները")

    };

    return (
        <div className="employees-container">
            {user?.user?.Role === 'Ադմինիստրատոր' ? <h2>Աշխատակիցներ</h2> : <h2>Անձնական տվյալներ</h2>}
            <table>
                <thead>
                    <tr>
                        <th>Անուն</th>
                        <th>Ազգանուն</th>
                        {/* <th>Ինստիտուտ</th> */}
                        <th>Պաշտոն</th>
                        <th>Մուտքանուն</th>
                        <th>Գաղտնաբառ</th>
                        <th>Էլ. հասցե</th>
                        <th>Մասնագիտություն</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employeeData.map((employee) => (

                        <tr key={employee.UserID}>
                            {editMode === employee.UserID ? (
                                <>
                                    <td><input value={employee.FirstName} onChange={(e) => handleChange(employee.UserID, "FirstName", e.target.value)} /></td>
                                    <td><input value={employee.LastName} onChange={(e) => handleChange(employee.UserID, "LastName", e.target.value)} /></td>
                                   {user?.user?.Role === 'Ադմինիստրատոր' ? <td>
                                        <select
                                            className="custom-select"
                                            value={employee.Role}
                                            onChange={(e) => handleChange(employee.UserID, "Role", e.target.value)}
                                        >
                                            <option value="Ադմինիստրատոր">Ադմինիստրատոր</option>
                                            <option value="Դասախոս">Դասախոս</option>

                                        </select>
                                    </td> : <td>{employee.Role}</td>}
                                    <td><input value={employee.Username} onChange={(e) => handleChange(employee.UserID, "Username", e.target.value)} /></td>
                                    <td><input onChange={(e) => handleChange(employee.UserID, "Password", e.target.value)} /></td>

                                    <td><input type='email' style={{border : !emailError1 ? '2px solid red':''}} value={employee.Email} onChange={(e) => handleChange(employee.UserID, "Email", e.target.value)} /></td>
                                    <td><input value={employee.Profession} onChange={(e) => handleChange(employee.UserID, "Profession", e.target.value)} /></td>
                                    <td>
                                        <button onClick={() => handleSave(employee.UserID)}><MdSave /></button>
                                        <button onClick={() => setEditMode(null)}><MdCancel /></button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{employee.FirstName}</td>
                                    <td>{employee.LastName}</td>
                                    {/* <td  className="shorttd"><p style= {{width: '250px', overflow: 'hidden'}}>{Institutes.find(inst => inst.InstituteID == employee.InstituteID)?.InstituteName}</p></td> */}
                                    <td>{employee.Role}</td>
                                    <td>{employee.Username}</td>
                                    <td>*****</td>
                                    <td>{employee.Email}</td>
                                    <td>{employee.Profession}</td>
                                    <td>
                                        <button onClick={() => setEditMode(employee.UserID)}><FaPencil /></button>
                                        {user?.user?.Role === 'Ադմինիստրատոր' ? <button onClick={() => handleDelete(employee.UserID)}><MdDelete /></button> : <></>
}                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                     {user?.user?.Role === 'Ադմինիստրատոր' ? <>
                    <tr>
                        <td><input name="FirstName" value={newEmployee.FirstName} onChange={handleNewEmployeeChange} placeholder="Անուն" /></td>
                        <td><input name="LastName" value={newEmployee.LastName} onChange={handleNewEmployeeChange} placeholder="Ազգանուն" /></td>
                        
                        <td><select name="Role"
                            className="custom-select"
                            value={newEmployee.Role}
                            onChange={handleNewEmployeeChange}
                        >
                            <option value="">Պաշտոն</option>
                            <option value="Ադմինիստրատոր">Ադմինիստրատոր</option>
                            <option value="Դասախոս">Դասախոս</option>

                        </select>  </td>
                       
                        
                            <td><input name="Username" value={newEmployee.Username} onChange={handleNewEmployeeChange} placeholder="Մուտքանուն" /></td>
                        <td><input name="Password" value={newEmployee.Password} onChange={handleNewEmployeeChange} placeholder="Գաղտնաբառ" /></td>
                        <td><input name="Email" type='email' style={{border : !emailError ? '2px solid red':''}} value={newEmployee.Email} onChange={handleNewEmployeeChange} placeholder="Էլ. հասցե" /></td>
                        <td><input name="Profession" value={newEmployee.Profession} onChange={handleNewEmployeeChange} placeholder="Մասնագիտություն" /></td>
                        <td>
                            <button className="pls" onClick={handleAddEmployee}><FaPlus /></button>
                        </td>
                    </tr>
                    </> : <></>}
                </tbody>
            </table>
        </div>
    );
};

export default Employees;