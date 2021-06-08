import React, { useState, useEffect } from "react";
import CourseBar from "./right-column-info/CourseBar";
import CourseList from "./course-list/CourseList";
import Search from "./course-search/Search";
import { selectSearchStatus } from "../../slices/searchSlice";
import { selectAllCourses, selectDeleteStatus } from "../../slices/userSlice";
import { useSelector } from "react-redux";
import InfoCards from "./right-column-info/InfoCards";
import DeletePlanPopup from "./DeletePlanPopup";
import {
  selectCurrentPlanCourses,
  selectPlan,
} from "../../slices/currentPlanSlice";
import {
  getRequirements,
  requirements,
  updateFulfilled,
} from "./right-column-info/distributionFunctions";
import { getMajor } from "../../resources/assets";
import clsx from "clsx";

/**
 * Holds all dashboard components.
 */
function Content() {
  // Component state setup.
  const [distributions, setDistributions] = useState<
    [string, requirements[]][]
  >([]);
  const [distributionOpen, setDistributionOpen] = useState<boolean>(true);
  const [displayGeneral, setDisplayGeneral] = useState<boolean>(true);

  // Redux setup.
  const searching = useSelector(selectSearchStatus);
  const currentPlan = useSelector(selectPlan);
  const deleteStatus = useSelector(selectDeleteStatus);
  const allCourses = useSelector(selectAllCourses);
  const currPlanCourses = useSelector(selectCurrentPlanCourses);

  // Gets distribution everytime a plan changes.
  useEffect(() => {
    const distr = getDistributions();
    if (distr !== null) {
      updateFulfilled(distr, currPlanCourses, allCourses, currPlanCourses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currPlanCourses]);

  // Sets all distributions for distribution bars.
  const getDistributions = () => {
    let major = currentPlan.majors[0];
    if (major === undefined) {
      return null;
    }
    let majorObj = getMajor(major);
    if (majorObj === undefined) {
      return null;
    }
    let distr = getRequirements(majorObj);
    setDistributions(distr);
    return distr;
  };

  return (
    // <div className="flex flex-row flex-wrap-reverse mt-content medium:px-48 h-full">
    <div className="flex flex-row flex-wrap-reverse mt-content medium:px-48 h-full">
      <div className="flex-grow h-auto">
        <CourseList />
      </div>
      <div className="flex flex-col ml-auto mr-auto my-4 w-coursebars h-auto">
        <div className="ml-4 mr-4">
          <InfoCards />
        </div>
        <div className="flex-none ml-4 mr-4 p-6 h-auto bg-white rounded shadow">
          <div className="flex flex-row mb-3 w-full">
            <div className="self-start text-xl font-medium">
              Overall Distribution
            </div>
            <div className="relative flex-grow">
              <button
                className="absolute bottom-0 right-0 underline"
                onClick={() => {
                  setDistributionOpen(!distributionOpen);
                }}
              >
                {distributionOpen ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-evenly my-4">
            <button 
              onClick={() => setDisplayGeneral(true)}
              className={clsx({"underline" : displayGeneral})}
            >
              General
            </button>
            <button 
              onClick={() => setDisplayGeneral(false)}
              className={clsx({"underline" : !displayGeneral})}>
                Fine
            </button>
          </div>
          {distributionOpen
            ? distributions.map((pair) => {
                if (displayGeneral) {
                  const dis = pair[1][0];
                  return (
                    <div key={dis.name}>
                      <CourseBar
                        maxCredits={dis.required_credits}
                        plannedCredits={dis.fulfilled_credits}
                        currentCredits={dis.required_credits}
                        section={dis.name}
                        general={true}
                      />
                    </div>
                  );
                } else {
                  let general = "";
                  return pair[1].map((dis, index) => {
                    if (index === 0) {
                      general = dis.name;
                      return;
                    }
                    return (
                      <div key={dis.name}>
                        <div className="font-bold">
                          {index === 1 ? general : null}
                        </div>
                        <CourseBar
                          maxCredits={dis.required_credits}
                          plannedCredits={dis.fulfilled_credits}
                          currentCredits={dis.required_credits}
                          section={dis.name}
                          general={false}
                        />
                      </div>
                    );
                  });
                }
              })
            : null}
        </div>
        {searching ? <Search /> : null}
        {deleteStatus ? <DeletePlanPopup /> : null}
      </div>
    </div>
  );
}

export default Content;
