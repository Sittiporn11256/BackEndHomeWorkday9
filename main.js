const express = require('express');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load environment variables
dotenv.config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Swagger options
const swaggerOptions = require('./swagger');

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Get all pokemons
/**
 * @swagger
 * /pokemons:
 *   get:
 *     summary: Get all pokemons
 *     responses:
 *       200:
 *         description: A list of pokemons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 *       500:
 *         description: Internal server error
 */
app.get('/pokemons', (req, res) => {
    const sql = 'SELECT * FROM pokemons';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({
                message: 'Error occurred while retrieving pokemons.',
                error: err,
            });
        } else {
            res.status(200).json(result);
        }
    });
});

// Get pokemon by id
/**
 * @swagger
 * /pokemons/{id}:
 *   get:
 *     summary: Get a pokemon by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pokemon to get
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The pokemon object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Pokemon not found
 *       500:
 *         description: Internal server error
 */
app.get('/pokemons/:id', (req, res) => {
    let id = req.params.id;
    const sql = 'SELECT * FROM pokemons WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({
                message: 'Error occurred while retrieving pokemon by id.',
                error: err,
            });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'Pokemon not found.' });
            } else {
                res.status(200).json(result);
            }
        }
    });
});

// Create new pokemon and add to database
/**
 * @swagger
 * /pokemons:
 *   post:
 *     summary: Create a new pokemon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: The created pokemon
 *       500:
 *         description: Internal server error
 */
app.post('/pokemons', (req, res) => {
    const pokemon = req.body;
    const sql = 'INSERT INTO pokemons SET ?';

    db.query(sql, pokemon, (err, result) => {
        if (err) {
            res.status(500).json({
                message: 'Error occurred while create new pokemon.',
                error: err,
            });
        } else {
            res.status(200).json({
                message: 'Create pokemon success',
                result: pokemon,
            });
        }
    });
});

// Update pokemon in database
/**
 * @swagger
 * /pokemons/{id}:
 *   put:
 *     summary: Update a pokemon by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pokemon to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: The updated pokemon
 *       500:
 *         description: Internal server error
 */
app.put('/pokemons/:id', (req, res) => {
    let id = req.params.id;
    let updatePokemon = req.body;
    const sql = 'UPDATE pokemons SET ? WHERE id = ?';

    db.query(sql, [updatePokemon, id], (err, result) => {
        if (err) {
            res.status(500).json({
                message: 'Error occurred while updating pokemon.',
                error: err,
            });
        } else {
            res.status(200).json({
                message: 'Update Pokemon success',
                result: result,
            });
        }
    });
});

// Delete pokemon in database
/**
 * @swagger
 * /pokemons/{id}:
 *   delete:
 *     summary: Delete a pokemon by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pokemon to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pokemon deleted successfully
 *       500:
 *         description: Internal server error
 */
app.delete('/pokemons/:id', (req, res) => {
    let id = req.params.id;

    const sql = 'DELETE FROM pokemons WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({
                message: 'Error occurred while deleting pokemon.',
                error: err,
            });
        } else {
            res.status(200).json({ message: 'Pokemon Deleted' });
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Starting run on port ${port}`);
});
