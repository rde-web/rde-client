import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Project from './pages/Project';


class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}></Route>
                    <Route path='signin' element={<SignIn/>}></Route>
                    <Route path='project' element={<Project/>}></Route>
                </Routes>
            </BrowserRouter>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);