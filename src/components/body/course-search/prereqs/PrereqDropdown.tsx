import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { ReactComponent as ChevronRight } from "../../../svg/ChevronRight.svg";
import { ReactComponent as ChevronDown } from "../../../svg/ChevronDown.svg";
import { ReactComponent as CheckMark } from "../../../svg/CheckMark.svg";

/* 
  This is one of the open-close prereq pill dropdowns.
*/
const PrereqDropdown = (props: {
  text: string;
  satisfied: boolean;
  element: string[];
  getNonStringPrereq: Function;
  or: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const [trulySatisfied, setTrulySatisfied] = useState<boolean>(false);
  const [rootHovered, setRootHovered] = useState<boolean>(false);

  useEffect(() => {
    if (props.satisfied) {
      setOpen(false);
    }
  }, [props.satisfied]);

  const updateSatisfied = () => {
    setTrulySatisfied(true);
  };

  const getChildPrereqs = () => {
    let orAndSatisfied = false;

    // eslint-disable-next-line array-callback-return
    return props.element.map((el: any, index) => {
      if (typeof el !== "number") {
        const parsed: {
          satisfied: boolean;
          jsx: JSX.Element;
        } = props.getNonStringPrereq(el);

        // If it's not an or statement, the first course must be satisfied.
        if (index === 0) {
          orAndSatisfied = parsed.satisfied;
        }

        // If it's an or statement, only one course would need to be satisfied. Otherwise, every course would need to be satisfied.
        if (props.or && parsed.satisfied) {
          orAndSatisfied = true;
        } else if (!props.or && !parsed.satisfied) {
          orAndSatisfied = false;
        }

        // Updates satisfied condition if recursive depth first search prereq processing produces true.
        if (
          index === props.element.length - 1 &&
          orAndSatisfied &&
          !trulySatisfied
        ) {
          updateSatisfied();
        }
        return (
          <p className="ml-2" key={el}>
            {parsed.jsx}
          </p>
        );
      }
    });
  };

  return (
    <div
      onMouseEnter={() => {
        setRootHovered(true);
      }}
      onMouseLeave={() => {
        setRootHovered(false);
      }}
    >
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className={clsx("transition duration-100 ease-in", {
          "text-green-700 hover:text-green-900": props.satisfied,
          "text-red-700 hover:text-red-900": !props.satisfied,
        })}
      >
        <div className="flex flex-row w-auto h-auto font-medium">
          {props.satisfied ? (
            <CheckMark
              className={clsx("mr-1 w-5 h-5", {
                "text-green-700 group-hover:text-red-900": !props.satisfied,
                "text-green-700 group-hover:text-green-900": props.satisfied,
              })}
            />
          ) : (
            <>
              {open ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </>
          )}

          <div className="text-sm">{props.text}</div>
        </div>
      </button>
      <div
        className={clsx("ml-2 border-l-2 border-opacity-50", {
          "border-green-200": props.satisfied && !rootHovered,
          "border-green-900": props.satisfied && rootHovered,
          "border-red-200 ": !props.satisfied && !rootHovered,
          "border-red-900 ": !props.satisfied && rootHovered,
        })}
        // style = {{
        //   borderLeft: '1px solid',
        //   marginLeft: '1%'}}
      >
        {open ? getChildPrereqs() : null}
      </div>
    </div>
  );
};

export default PrereqDropdown;
