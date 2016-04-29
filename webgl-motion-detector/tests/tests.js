QUnit.test("code1-sayHello", function() {
  equal(sayHello("Markus"), "Hello, Markus");
});

QUnit.test("code2-sayGoodbye", function() {
  equal(sayGoodbye("Markus"), "Goodbye, Markus");
});

QUnit.test( "code2-simple", function( assert ) {
	  assert.ok( 1 == "1", "Passed!" );
});