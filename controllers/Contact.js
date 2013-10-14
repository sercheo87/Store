var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/ContentModel"));

module.exports = BaseController.extend({ 
	name: "Blog",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.getContent(function() {
			var v = new View(res, 'contact');
			v.render(self.content);
		});
	},
	runArticle: function(req, res, next) {
		model.setDB(req.db);
		var self = this;
		this.getArticle(req.params.id, function() {
			var v = new View(res, 'inner');
			v.render(self.content);
		});
	},
	getContent: function(callback) {
		var self = this;
		this.content = {};
			model.getlist(function(err, records) {
				var blogArticles = [
                    {
                        picture:'imagen1',
                        title:'bonjovi',
                        text:'primer contacto'
                    },
                    {
                        picture:'imagen2',
                        title:'arjona',
                        text:'segundo contacto'
                    }
                ];
				if(records.length > 0) {
					for(var i=0; record=records[i]; i++) {
						var record = records[i];
						blogArticles += '\
							<section class="item">\
	                            <img src="' + record.picture + '" alt="" />\
	                            <h2>' + record.title + '</h2>\
	                            <p>' + record.text + '</p>\
	                            <br class="clear" />\
								<hr />\
	                        </section>\
						';
					}
				}
                console.log(blogArticles);
				self.content.blogArticles = blogArticles;
				callback();
		}, { type: 'contact' });
	},
	getArticle: function(ID, callback) {
		var self = this;
		this.content = {}
		model.getlist(function(err, records) {
			if(records.length > 0) {
				self.content = records[0];
			}
			callback();
		}, { ID: ID });
	}
});