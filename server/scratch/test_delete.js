const axios = require('axios');

async function testDelete() {
  try {
    // 1. Get a board to find a list ID
    const boardRes = await axios.get('http://localhost:5000/api/boards');
    const boardId = boardRes.data[0].id;
    
    const boardDetail = await axios.get(`http://localhost:5000/api/boards/${boardId}`);
    if (boardDetail.data.lists.length === 0) {
      console.log('No lists to delete');
      return;
    }
    
    const listId = boardDetail.data.lists[0].id;
    console.log(`Attempting to delete list ${listId}...`);
    
    // 2. Try to delete the list
    const delRes = await axios.delete(`http://localhost:5000/api/lists/${listId}`);
    console.log('Delete response:', delRes.data);
    
    // 3. Verify it's gone
    const verifyRes = await axios.get(`http://localhost:5000/api/boards/${boardId}`);
    const listExists = verifyRes.data.lists.some(l => l.id === listId);
    console.log('List exists after delete?', listExists);
    
  } catch (err) {
    console.error('Test failed:', err.response ? err.response.data : err.message);
  }
}

testDelete();
