import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { fetchEmployees } from "../../../Redux/Employees";
import { fetchInstitutes } from "../../../Redux/InstitutesSlice";
import "./Institutes.css"
const Institute = () => {

  const navigate = useNavigate();
  const employees = useSelector((state) => state.employees?.list);
  const Institutes = useSelector((state) => state.institutes?.list);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchInstitutes())
  }, [dispatch]);
  // Ստանում ենք առկա կուրսերի ցանկը
  const uniqueInstitutes = [...new Set(employees.map(employees => employees.InstituteID))].sort((a, b) => a - b);

  const [addingInstitute, setAddingInstitute] = useState(false);
  const [newInstitute, setNewInstitute] = useState("");


  const handleAddInstitute = () => {
    if (newInstitute.trim() && !uniqueInstitutes.includes(parseInt(newInstitute))) {
      navigate(`/Employees/${newInstitute}`); // Տեղափոխում ենք նոր կուրսի էջը
    }
    setNewInstitute("");
    setAddingInstitute(false);
  };

  return (
    <div className="course-container">
      <h1 className="workspaceHeader">Ինստիտուտներ</h1>
      <div className="course-list">
        {uniqueInstitutes.map((id) => (
          <div key={id} className="course-item" onClick={() => navigate(`/Employees/${id}`)}>
            <h4>{Institutes.find(inst => inst.InstituteID === id)?.InstituteName}</h4>
          </div>
        ))}
      </div>
      <div className="course-add">
        {addingInstitute ? (
          <div className="course-add-form">
            <select
              className="custom-select"
              value={Institutes.InstituteID}
              onChange={(e) => setNewInstitute(e.target.value)}
            >
              <option value="">Ընտրեք Ինստիտուտը</option>
                      {(Institutes).map(inst => (
                        <option key={inst.InstituteName} value={inst.InstituteName}>{inst.InstituteName}</option>
                      ))}

            </select>
            
            <button className="add-btn" onClick={handleAddInstitute}>
              Հաստատել
            </button>
            <button className="cancel-btn" onClick={() => setAddingInstitute(false)}>
              Չեղարկել
            </button>
          </div>
        ) : (
          <button className="create-btn" onClick={() => setAddingInstitute(true)}>
            Ավելացնել նոր Ինստիտուտ<FaPlus className="plus-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Institute;
