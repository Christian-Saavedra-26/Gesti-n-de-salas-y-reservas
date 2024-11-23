const express = require('express');
const router = express.Router();
const {getSalas, createSala, updateSala, deleteSala} = require('../controller/salasController')


router.get('/', getSalas);

router.post('/', createSala);

router.put('/:id', updateSala);

router.delete('/:id', deleteSala);

module.exports = router