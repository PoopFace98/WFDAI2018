const model = require('../models/user.model');
const userModel = require('../models/sms.model');
const express = require('express');
const router = express.Router();
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
	apiKey: '5144f6ab',
	apiSecret: '6US4EeIT9xW6CO2c'
}, {
	debug: true
});


router.get('/', function (request, response) {
	var user = request.user;
	if (request.isAuthenticated()) {
		model.list(function (users) {
			userModel.listRegrasUsers(function (usersRegras) {
				response.set('Content-Type', 'text/html');
				if (user.Pagamento === 'Pago') {
					response.render('user_index', {
						users: users,
						usersRegras: usersRegras
					})
				} else {
					response.render('free_index', {
						users: users
					})
				}
			})
		})
	} else {
		response.redirect('/');
	}

})


router.get('/listar', function (request, response) {
	model.list(function (users) {
		response.set("Content-Type", "text/html");
		response.render('users_list', {
			users: users
		});
	});
});

router.get('/empresa', function (request, response) {
	var user = request.user;
	if (request.isAuthenticated()) {
		model.listempresa(user.Empresa, function (users) {
			response.set("Content-Type", "text/html");
			response.render('empresa_index', {
				users: users
			})
		})
	}
});

router.get('/empresareg', function (request, response) {
	response.set("Content-Type", "text/html");
	response.render('empresa_registar_users', {
		isNew: true,
		user: {},
		errors: []
	});
});

router.post('/empresareg', function (request, response) {
	var user = request.user;
	model.read(user.Email, function (users) {
		request.checkBody('Nome', 'O Nome deve ter entre 3 e 20 caracteres').isLength({
			min: 3,
			max: 20
		});
		request.checkBody('Password', 'A Password deve ter entre 8 e 20 caracteres').isLength({
			min: 8,
			max: 20
		});
		request.checkBody('Email', 'Email inválido').isLength({
			min: 5,
			max: 150
		});
		request.checkBody('NIF', 'O NIF pode apenas ter 9 caracteres').isLength({
			min: 9,
			max: 9
		});
		request.checkBody('Contacto', 'O Contacto deve ter apenas 9 numeros').isLength({
			min: 9,
			max: 9
		});
		request.checkBody('Morada', 'A Morada deve ter entre 3 e 100 caracteres').isLength({
			min: 3,
			max: 100
		});
		var errors = request.validationErrors();
		if (errors) {
			response.render('empresa_registar_users', {
				isNew: true,
				user: {},
				errors: errors
			});
		} else {
			var data = {
				'Nome': request.body.Nome,
				'Email': request.body.Email,
				'NIF': request.body.NIF,
				'Contacto': request.body.Contacto,
				'Morada': request.body.Morada,
				'tipo': "subscritor individual",
				'Password': request.body.Password,
				'empresa': user.Empresa,
				'UI': request.body.UI,
			};
			model.create(data, function () {
				response.redirect('/users/empresa');
			});
		}
	})
});


router.get('/registar', function (request, response) {
	response.set("Content-Type", "text/html");
	response.render('user_registar', {
		isNew: true,
		user: {},
		errors: []
	});
});

router.post('/registar', function (request, response) {
	request.checkBody('Nome', 'O Nome deve ter entre 3 e 20 caracteres').isLength({
		min: 3,
		max: 20
	});
	request.checkBody('Email', 'Email inválido').isLength({
		min: 5,
		max: 150
	});
	request.checkBody('NIF', 'O NIF pode apenas ter 9 caracteres').isLength({
		min: 9,
		max: 9
	});
	request.checkBody('Contacto', 'O Contacto deve ter apenas 9 numeros').isLength({
		min: 9,
		max: 9
	});
	request.checkBody('Morada', 'A Morada deve ter entre 3 e 100 caracteres').isLength({
		min: 3,
		max: 100
	});
	var errors = request.validationErrors();
	if (errors) {
		response.render('user_registar', {
			isNew: true,
			user: {},
			errors: errors
		});
	} else {
		var data = {
			'Nome': request.body.Nome,
			'Email': request.body.Email,
			'Contacto': request.body.Contacto,
			'NIF': request.body.NIF,
			'Morada': request.body.Morada,
			'tipo': "subscritor individual",
			'Password': request.body.Password,
			'UI': request.body.UI,
			'Pagamento': 'Pago',
		};
		const from = 'WFDAI ';
		const to = '351' + request.body.Contacto;
		const text = 'Efetue o pagamento no valor de 10€ para: PT50 XXXX XXXX XXXXXXXXXXX XX'
		nexmo.message.sendSms(from, to, text, (error, response) => {
			if (error) {
				throw (error);
			} else if (response.messages[0].status != '0') {
				console.error(response);
				throw 'Nexmo returned back a non-zero status';
			} else {
				console.log(response);
			}
		});
		model.create(data, function () {
			response.redirect('/');
		});


	}
});

router.get('/registarfree', function (request, response) {
	response.set("Content-Type", "text/html");
	response.render('free_registar', {
		isNew: true,
		user: {},
		errors: []
	});
});

router.post('/registarfree', function (request, response) {

	request.checkBody('Nome', 'O Nome deve ter entre 3 e 20 caracteres').isLength({
		min: 3,
		max: 20
	});
	request.checkBody('Password', 'A Password deve ter entre 8 e 20 caracteres').isLength({
		min: 8,
		max: 20
	});
	request.checkBody('Email', 'Email inválido').isLength({
		min: 5,
		max: 150
	});
	request.checkBody('NIF', 'O NIF pode apenas ter 9 caracteres').isLength({
		min: 9,
		max: 9
	});
	request.checkBody('Contacto', 'O Contacto deve ter apenas 9 numeros').isLength({
		min: 9,
		max: 9
	});
	request.checkBody('Morada', 'A Morada deve ter entre 3 e 100 caracteres').isLength({
		min: 3,
		max: 100
	});
	var errors = request.validationErrors();
	if (errors) {
		response.render('free_registar', {
			isNew: true,
			user: {},
			errors: errors
		});
	} else {
		var data = {
			'Nome': request.body.Nome,
			'Email': request.body.Email,
			'NIF': request.body.NIF,
			'Contacto': request.body.Contacto,
			'Morada': request.body.Morada,
			'tipo': "free",
			'Password': request.body.Password,
			'UI': request.body.UI,
		};
		model.createfree(data, function () {
			response.redirect('/');
		});


	}
});
router.get('/preferencias', function (request, response) {
	if (request.isAuthenticated()) {
		model.listpreferencias(function (preferencias) {
			response.set("Content-Type", "text/html");
			response.render('admin', {
				preferencias: preferencias
			})
		});
	} else {
		response.redirect('/');
	}
});

router.get('/:UserID', function (request, response) {
	model.readEmpresas(request.params.UserID, function (user) {
		response.set("Content-Type", "text/html");
		response.render('empresa_edit_user', {
			isNew: false,
			user: user,
			errors: []
		})
	})
});

router.post('/:UserID', function (request, response) {
	var data = {
		'Nome': request.body.Nome,
		'Email': request.body.Email,
		'Contacto': request.body.Contacto,
		'UI': request.body.UI,
	};
	var errors = request.validationErrors();
	if (errors) {
		data.Nome = request.user.Nome;
		response.render('empresa_edit_user', {
			user: data,
			errors: errors
		})
	} else {
		model.updateFuncionario(request.params.UserID, data, function () {
			response.redirect('/users/empresa');
		});
	}
});

router.get('/email/delete', function (request, response) {
	model.remove(request.params.email, function () {
		response.redirect('/');
	})
});

/*Gravar Localizações Selecionadas */


router.get('/create_preferencia', function (request, response) {
	response.set("Content-Type", "text/html");
	response.render('user_index', {
		isNew: true,
		user: {},
		errors: []
	});
});

router.post('/', function (request, response) {

	var errors = request.validationErrors();
	if (errors) {
		response.render('user_index', {
			isNew: true,
			user: {},
			errors: errors
		});
	} else {
		var data = {};
		model.create(data, function () {
			response.redirect('/');
		});


	}
});

/* Ler Localizações Selecionadas */

router.get('/preferencias', function (request, response) {
	model.readpreferencias(request.params.Email, function (user) {
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

router.post('/preferencias', function (request, response) {
	var errors = request.validationErrors();
	if (errors) {
		response.render('user_index', {
			isNew: true,
			user: {},
			errors: errors
		});
	} else {

		model.readpreferencias(request.body.Email, function () {
			response.redirect('/');
		});


	}
});







module.exports = router;