import express from 'express';
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const policyRoutes = require("./routes/policy.routes");
app.use("/", policyRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running 🚀');
});

app.listen(port, () => {
  console.log(`🚀  Server ready at ${port}`);
});
