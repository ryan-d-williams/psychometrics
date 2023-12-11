<header>
	<h1>Item Analysis</h1>
	<p>Below are basic metrics that go into the item analysis</p>
</header>

<section class="first-section">
	<h2>Difficulty Index</h2>
	<p>
		The Difficulty Index is a simple measure of the percentage of people who answered the question
		correctly. It ranges from 0 (everyone got it wrong) to 1 (everyone got it right). In general,
		0.2 represents a question that is too difficult, and 0.9 represents a question that is too easy.
		<br />
		<br />
		This measure is further broken down into <span class="item-name">Upper Difficulty Index</span>
		and
		<span class="item-name">Lower Difficulty Index</span>. These represent the percentages of people
		in the top 27% (upper) and bottom 27% (lower) of the class who answer a question correctly.
		These measures are heavily used in the Discrimination Index below.
	</p>
</section>

<section>
	<h2>Discrimination Index</h2>
	<p>
		The Discrimination Index (DI) measures how well a question discriminates between high performing
		and low performing individuals on a test. It is calculated as the difference between the higher
		performing group and lower performing group (number of people in those groups who answered the
		question correctly) divided by the total number of participants.
		<br /><br />
		In general, a low discrimination index indicates a question is not properly determining who understands
		a subject. A high discrimination index is favorable.
		<br /><br />
		The following guidelines have been developed to interpret Discrimination Index (Ebel, Frisbie, 1979):
		<br />
		<br />
		1. No revision if DI is greater than 0.4
		<br />2. Minor revision if DI between 0.3 and 0.4
		<br />3. Major revision if DI is between 0.2 and 0.3
		<br />4. Remove or completely rewrite if DI is less than 0.2
		<br />
		<br />
		This can be combined with Upper and Lower Difficulty Indices to determine how well a question is
		performing. For example, if you have a low discrimination index and both the Upper and Lower Difficulty
		Indices are high, that generally means the question is too easy and should either be removed or made
		more difficult. On the other hand, if the DI is low and the Difficulty Indices are low, that generally
		means the question is too difficult and should be revised to be easier.
	</p>
</section>

<section>
	<h2>KR-20 (Kuder-Richardson Formula 20)</h2>
	<p>
		The Kuder-Richardson Formula 20 (KR-20) is a measure of how reliable a test is. "Reliability" in
		this case means the ability to test a student's understanding of the material.
		<br /><br />
		A low KR-20 Index generally means the test is unreliable.
		<br />
		<br />The interpretation is generally interpreted based on the number of items on the test. If
		the test is 10-15 questions in length, then a coefficient of 0.5 or greater is considered
		reliable. Longer tests require a 0.8 coefficient or greater to be considered reliable.
	</p>
</section>

<section>
	<h2>Point-Biserial Correlation</h2>
	<p>
		The point biserial metric determines how correlated a particular question is to the overall
		grade a student receives on a test. It is calculated by taking the correlation coefficient
		(often Pearson coefficient) of the performance on an individual question with the overall
		performance on the test.
		<br /><br />
		A low correlation coefficient means that the student answering that question has no affect on their
		overall grade. You should expect that all questions on your test correlate to the overall score on
		the test. A low correlation can happen when a question is too difficult, too easy, or has confusing
		wording such that the student scores do not follow a normal distribution.
		<br /><br />
		In general, a coefficient of at least 0.25 is required for a question to be considered “good”.
	</p>
</section>

<section>
	<h2>External Validation</h2>
	<p>
		The external validation determines how correlated one particular assignment is to another. Like
		point-biserial, it often uses Pearson Correlation.
		<br /><br />
		A low correlation coefficient means that the student performing well on one assignment does not correlate
		to how well they do on another assignment. You should expect that assignments in the same block or
		assignments on the same topic are correlated. For example, a homework leading up to a test should
		be correlated with that test.
		<br /><br />
		In general, a coefficient of at least 0.25 is required for assignments to be considered correlated.
	</p>
</section>

<style>
	body {
		margin: 0;
		padding: 0;
		color: #fff;
		overflow-x: hidden;
	}

	header {
		text-align: center;
		padding: 20px;
		color: #fff;
		font-weight: 100;
		font-size: 22px;
	}

	main {
		padding: 20px;
	}

	section {
		padding: 80px 0;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		display: flex;
		border-bottom: 1px solid #6e6e6e;
	}

	.first-section {
		border-top: 1px solid #6e6e6e;
	}

	.item-name {
		color: #3498db;
	}

	h2 {
		color: #3498db;
		width: 35%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30px;
		font-weight: 100;
	}

	section > p {
		width: 65%;
		padding: 0 50px;
	}

	p {
		line-height: 1.8;
	}

	footer {
		text-align: center;
		padding: 10px;
		background-color: #3498db;
		color: #fff;
	}
</style>
