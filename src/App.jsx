import "./App.css";
import React from "react";
import {SmartTodoList} from './components/index'
function App() {
  return (
    <>
      <div className="min-h-screen  mx-[auto]  bg-blue-50">
        {/* <div className="text-center"> */}
        <SmartTodoList />
        {/* </div>s */}
      </div>
    </>
  );
}

export default App;
