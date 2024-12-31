import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/posts', { title, content, tags: tags.split(',') });
      console.log('Post created:', response.data);
      // Redirigir o limpiar el formulario después de crear el post
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Content:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div>
        <label>Tags:</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma separated" />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
