import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/posts" element={<PostList />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
