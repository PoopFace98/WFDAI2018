const model = require('../models/user.model');
const express = require('express');
const router = express.Router();


router.get('/:Email', function (request, response) {
	model.read(request.params.Email, function (user) {
		if (user != undefined) {
			response.set("Content-Type", "text/html");
			response.render('user_index', {
				isNew: false,
				user: user,
				errors: []
			})
		} else {
			response.status(404).end();
		}
	})
});

router.post('/:Email', function (request, response) {
	request.checkBody('Nome', 'Nome should have between 5 and 10 chars').isLength({
		min: 5,
		max: 10
	});
	request.checkBody('Password', 'Password should have between 8 and 15 chars').isLength({
		min: 8,
		max: 15
	});
	request.checkBody('NIF', 'NIF should have 9 chars').isLength({
		min: 9,
		max: 9
	});
	request.checkBody('Contacto', 'Contacto should have between 0 and 150 chars').isLength({
		min: 0,
		max: 150
	});
	request.checkBody('Morada', 'Morada should have between 0 and 20 chars').isLength({
		min: 0,
		max: 20
	});
	var errors = request.validationErrors();
	if (errors) {
		response.render('user_index', {
			isNew: true,
			user: {},
			errors: errors
		});
	} else {
		var data = {
			'Nome': request.body.Nome,
			'Password': request.body.Password,
			'NIF': request.body.NIF,
			'Contacto': request.body.Contacto,
			'Morada': request.body.Morada,
			'tipo': "",
			'UI': request.body.UI,
		};
		model.update(request.body.Email, data, function () {
			response.redirect('/');
		});


	}
});

module.exports = router;