import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>Author: {post.author.username}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
