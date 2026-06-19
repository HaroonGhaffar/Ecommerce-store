const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve files from the frontend directory, which is one level up from backend
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
});
