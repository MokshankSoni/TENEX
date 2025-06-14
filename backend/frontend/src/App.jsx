// src/App.js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthenticationContext';
import { routes } from './config/routes';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="loading-container">
              <div className="loading-spinner" />
            </div>
          }
        >
          <Routes>
            {routes.map(({ path, element: Element, title }) => (
              <Route
                key={path}
                path={path}
                element={
                  <React.Fragment>
                    <title>{title}</title>
                    <Element />
                  </React.Fragment>
                }
              />
            ))}
          </Routes>
        </Suspense>
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
};

export default App;


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App
