import React from 'react';
import Year from './Year';
import { Course } from '../commonTypes';

function CourseList() {
  return (
    <div style={courseListBody}>
      <div style={courseListTitleStyle}>My Courses</div>
      <Year yearName={'Freshman'} courses={[]} />
      <Year yearName={'Sophomore'} courses={[]} />
      <Year yearName={'Junior'} courses={[]} />
      <Year yearName={'Senior'} courses={[]} />
    </div>
  );
}

const courseListTitleStyle = {
  margin: '1rem',
  fontSize: 'x-large',
  paddingLeft: '1rem',
};

const courseListBody = {
  backgroundColor: '#ECECEC',
  position: 'relative',
  right: '0rem',
  width: '23%',
  fontWeight: 'bold',
  margin: '0rem',
  zIndex: 0,
} as React.CSSProperties;

export default CourseList;
