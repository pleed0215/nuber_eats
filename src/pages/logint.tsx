import React from "react";

export const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg text-gray-800 px-10 py-10 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log in</h3>
        <form className="flex flex-col mt-5 px-5">
          <input placeholder="Email"  className="auth__form_input"/>
          <input placeholder="Password" className="auth__form_input"/>
          <button className="auth__form_button">Log in</button>
        </form>
      </div>
    </div>
  );
};
