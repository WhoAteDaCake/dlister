const { start, when, tag } = require('@atecake/builder');

start([ when('tag', [ tag() ]) ]);
