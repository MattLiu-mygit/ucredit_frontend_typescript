import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  selectToAddName,
  updateToAddName,
  updateAddingStatus,
  selectPlanList,
  updateToAddMajor,
  selectToAddMajor,
} from "../../slices/userSlice";
import { testMajorArray } from "../../testObjs";

const PlanAdd = (props: { setGenerateNew: Function }) => {
  // Redux setup
  const dispatch = useDispatch();
  const toAddName = useSelector(selectToAddName);
  const toAddMajor = useSelector(selectToAddMajor);
  const planList = useSelector(selectPlanList);

  const createNewPlan = () => {
    if (toAddMajor === null) {
      toast.error("Please choose a valid major!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(updateAddingStatus(false));
      props.setGenerateNew(true);
    }
  };

  const handleNameChange = (event: any) => {
    dispatch(updateToAddName(event.target.value));
  };

  const handleCancel = () => {
    if (planList.length === 0) {
      toast.error("Please create at least one plan to continue!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      dispatch(updateAddingStatus(false));
    }
  };

  const handleMajorChange = (event: any) => {
    if (event.target.value >= 0) {
      dispatch(updateToAddMajor(testMajorArray[event.target.value]));
    }
  };

  return (
    <div className="absolute top-0">
      {/* Background Grey */}
      <div className="fixed z-20 left-0 top-0 m-0 w-full h-screen bg-black opacity-50"></div>
      <div
        className={
          "fixed flex flex-col bg-primary rounded z-20 w-9/12 h-5/6 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3"
        }
      >
        <div className="px-4 py-2 text-white text-coursecard font-semibold select-none">
          Adding a new plan!
        </div>
        {/* Search area */}
        <div className="flex w-full h-full text-coursecard">
          <div
            className={
              "flex flex-col rounded bg-gray-200 w-full h-full flex-none"
            }
          >
            <input
              autoFocus
              className="mr-2 px-1 w-full w-full h-6 rounded outline-none"
              type="text"
              placeholder={
                "Course title or number (ie. Physics, 601.280, etc.)"
              }
              defaultValue={toAddName}
              onChange={handleNameChange}
            />
            Select Major
            <select
              className="w-36 h-6 rounded outline-none"
              onChange={handleMajorChange}
            >
              <option value={-1}>Choose a major</option>
              {testMajorArray.map((major, index) => (
                <option key={major.name} value={index}>
                  {major.name}
                </option>
              ))}
            </select>
            <button onClick={createNewPlan}>Add</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanAdd;
