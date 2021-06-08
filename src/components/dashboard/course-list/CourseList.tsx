import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserCourse, Year } from "../../../resources/commonTypes";
import axios from "axios";
import {
  selectPlan,
  selectTotalCredits,
  updateCurrentPlanCourses,
  updateSelectedPlan,
  updateTotalCredits,
} from "../../../slices/currentPlanSlice";
import {
  selectPlaceholder,
  selectSearchStatus,
} from "../../../slices/searchSlice";
import YearComponent, { newYearTemplate } from "./YearComponent";
import { ReactComponent as AddSvg } from "../../../resources/svg/Add.svg";
import { toast } from "react-toastify";
import { selectUser } from "../../../slices/userSlice";
import { api } from "../../../resources/assets";

/**
 * Container component that holds all the years, semesters, and courses of the current plan.
 */
function CourseList() {
  // Setting up redux
  const dispatch = useDispatch();
  const currentPlan = useSelector(selectPlan);
  const user = useSelector(selectUser);
  const searching = useSelector(selectSearchStatus);
  const placeholder = useSelector(selectPlaceholder);
  const totalCredits = useSelector(selectTotalCredits);

  // Component State setup.
  const [elements, setElements] = useState<JSX.Element[]>([]);

  // Gets all courses for each year and generates year objects based on them.
  useEffect(() => {
    const jsx: JSX.Element[] = [];
    const totCourses: UserCourse[] = [];
    currentPlan.years.forEach((year) => {
      const courses: UserCourse[] = [];
      if (year.courses.length === 0) {
        jsx.push(
          <YearComponent
            key={year._id}
            id={year.year}
            customStyle="cursor-pointer"
            year={year}
            courses={[]}
          />
        );
        if (jsx.length === currentPlan.years.length) {
          jsx.sort((el1, el2) => el1.props.id - el2.props.id);
          dispatch(updateCurrentPlanCourses(totCourses));
          setElements(jsx);
        }
      } else {
        year.courses.forEach((courseId) => {
          axios
            .get(api + "/courses/" + courseId)
            .then((resp) => {
              const course: UserCourse = resp.data.data;
              courses.push(course);
              dispatch(updateTotalCredits(totalCredits + course.credits));
              totCourses.push(course);
              if (courses.length === year.courses.length) {
                jsx.push(
                  <YearComponent
                    key={year._id}
                    id={year.year}
                    customStyle="cursor-pointer"
                    year={year}
                    courses={courses}
                  />
                );
                if (jsx.length === currentPlan.years.length) {
                  jsx.sort((el1, el2) => el1.props.id - el2.props.id);
                  dispatch(updateCurrentPlanCourses(totCourses));
                  setElements(jsx);
                }
              }
            })
            .catch((err) => console.log(err));
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlan, currentPlan._id, searching, placeholder]);

  // add a new year, if preUni is true, add to the start of the plan, otherwise add to the end
  const addNewYear = (preUniversity: boolean) => {
    if (preUniversity) {
      let preAdded = false;
      currentPlan.years.forEach((currYear) => {
        if (currYear.year === 0) {
          preAdded = true;
          return;
        }
      });
      if (preAdded) {
        toast.error("Already added pre-year!");
        return;
      }
    }

    if (currentPlan.years.length < 8) {
      const body = {
        name: newYearTemplate.name,
        plan_id: currentPlan._id,
        preUniversity: preUniversity,
        user_id: user._id,
      }; // add to end by default
      axios
        .post(api + "/years", body)
        .then((response: any) => {
          const newYear: Year = { ...response.data.data };
          const newYearArray = [...currentPlan.years, newYear]; // NOT THE CORRECT ID??
          const newUpdatedPlan = { ...currentPlan, years: newYearArray };
          dispatch(updateSelectedPlan(newUpdatedPlan));
          toast.success("New Year added!");
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Can't add more than 8 years!");
    }
  };
  return (
    <>
      <div className="flex flex-row flex-wrap justify-between thin:justify-center mt-4 h-auto">
        <AddSvg
          onClick={() => addNewYear(true)}
          className="w-6 h-6 stroke-2 cursor-pointer select-none transform hover:translate-x-0.5 hover:translate-y-0.5 transition duration-200 ease-in"
        />
        {elements}
        <AddSvg
          onClick={() => addNewYear(false)}
          className="w-6 h-6 stroke-2 cursor-pointer select-none transform hover:translate-x-0.5 hover:translate-y-0.5 transition duration-200 ease-in"
        />
      </div>
    </>
  );
}

export default CourseList;
