let testPage = (header="Test Page Header",paragraph="Test Page Paragraph")=>`
	<!DOCTYPE html>
	<html>
		<header>
			<meta charset="UTF-8">
			<title>Test Page Title</title>
		</header>
		<body>
			<h1>${header}</h1>
			<p>
				${paragraph}
			</p>
		</body>
		<script>
			console.log("Test Script");
		</script>
	</html>
	`;
exports.testPage=testPage;