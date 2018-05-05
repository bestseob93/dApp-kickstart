import React from 'react';
import Header from './Header';

function Layout(props) {
  return (
    <div>
      <Header />
      {props.children}
      <h1>I'm footer</h1>
    </div>
  );
}

export default Layout;
