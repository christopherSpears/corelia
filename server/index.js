const express = require('express');
const fs = require('fs'); //for editing files - probably wont use here on index...most likely will use in separate routes
const categoriesRoute = require('./routes/categories');
const createAccountRoute = require('./routes/create-account');
const userRolesRoute = require('./routes/user-roles');
const passwordResetRoute = require('./routes/password-reset');

const app = express();
app.use(express.json());

const PORT = 5500;

// routes
app.use('/api/categories', categoriesRoute);
app.use('/api/create-account', createAccountRoute);
app.use('/api/roles', userRolesRoute);
app.use('/api/password-reset', passwordResetRoute);

app.listen(PORT, () => {
    console.log(`Server running at port 5500`);
});