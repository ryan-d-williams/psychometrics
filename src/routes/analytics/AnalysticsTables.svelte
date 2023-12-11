<script>
	import AnalyticValue from '../../modules/AnalyticValue';
	import { ProgressRadial, popup } from '@skeletonlabs/skeleton';
	import Gradient from 'javascript-color-gradient';
	import { tools } from '../../modules/analytics.js';
	import { assignments } from '../../store/assignments.js';
	import { onMount } from 'svelte';

	export let assignment_name = '';
	let assignment_ndx = 0;
	let question_data = [];
	let correlation_matrix = [];
	let KR_20 = new AnalyticValue();
	let loading = false;

	$: {
		if ($assignments.length > 0) {
			assignment_ndx = $assignments.findIndex((assignment) => assignment.name === assignment_name);
		}
	}

	$: {
		if ($assignments.length > 0 && assignment_ndx > -1) {
			loading = true;
			let current_assignment = JSON.parse(JSON.stringify($assignments[assignment_ndx]));

			const question_names = Object.keys(current_assignment.data[0]).sort((a, b) =>
				Number.parseInt(a) < Number.parseInt(b) ? -1 : 1
			);
			question_names.forEach((question_name, index) => {
				question_data[index] = {
					question_name: question_name
				};
			});
			tools.calculateDifficultyIndex(current_assignment.data, question_names, question_data);

			tools.calculateStudentScoreAndRank(current_assignment.data, question_names);
			tools.calculateDiscriminationIndex(current_assignment.data, question_names, question_data);
			KR_20 = tools.calculateKR20(current_assignment.data, question_names, question_data);
			tools.calculatePointBiserial(current_assignment.data, question_names, question_data);

			let gradientArray = new Gradient()
				.setColorGradient('#d5512d', '#669e53')
				.setMidpoint(11)
				.getColors();
			correlation_matrix = tools.calculateInterItemCorrelation(
				current_assignment.data,
				question_names,
				gradientArray
			);
			question_data = question_data;
			loading = false;
		}
	}
	onMount(async () => {
		let Statistics = (await import('../../../node_modules/statistics.js/statistics.js?id=165641'))
			.default;
		tools.setStatistics(Statistics);
	});
</script>

{#each question_data as question}
	{#if question.difficulty_index.warning_low.is_active}
		<div data-popup="popup_{question.difficulty_index.warning_low.warning_number}">
			<div class="popup">
				Questions with a difficulty index less than 0.2 often indicate that the question is too
				hard. Consider revising the question to make it slightly easier or less tricky.
			</div>
			<div class="arrow popup-arrow" />
		</div>
	{/if}
	{#if question.difficulty_index.warning_high.is_active}
		<div data-popup="popup_{question.difficulty_index.warning_high.warning_number}">
			<div class="popup">
				Questions with a difficulty index greater than 0.8 often indicate that the question is too
				easy. Consider revising the question to make it slightly harder.
			</div>
			<div class="arrow popup-arrow" />
		</div>
	{/if}

	{#if question.difficulty_upper.warning_low.is_active}
		<div data-popup="popup_{question.difficulty_upper.warning_low.warning_number}">
			<div class="popup">
				Questions with an upper difficult index below 0.5 mean that even the top performers on your
				test struggled with this question. If this question is not discriminating (check
				discrimination index) then consider revising the question.
			</div>
			<div class="arrow popup-arrow" />
		</div>
	{/if}
	{#if question.difficulty_lower.warning_high.is_active}
		<div data-popup="popup_{question.difficulty_lower.warning_high.warning_number}">
			<div class="popup">
				Questions with a lower difficulty index above 0.9 mean that low performing students on this
				test found this question very easy. If this question is not discriminating (check
				discrimination index) then consider revising the question.
			</div>
			<div class="arrow popup-arrow" />
		</div>
	{/if}
	{#if question.discrimination_index.warning_low.is_active}
		<div data-popup="popup_{question.discrimination_index.warning_low.warning_number}">
			<div class="popup">
				{#if question.difficulty_index.value > 0.5}
					Questions with a discrimination index below 0.2 indicate that this question does not
					properly test which students understand the concept or not. Since the difficulty index is
					high, consider either removing the question or revising it to make it more difficult so it
					will better discriminate.
				{:else}
					Questions with a discrimination index below 0.2 indicate that this question does not
					properly test which students understand the concept or not. Since the difficulty index is
					low, consider either removing the question or revising it to make it more difficult so it
					will better discriminate.
				{/if}
			</div>
			<div class="arrow popup-arrow" />
		</div>
	{/if}

	{#if question.point_biserial.warning_low.is_active}
		<div data-popup="popup_{question.point_biserial.warning_low.warning_number}">
			<div class="popup">
				Questions with a point biserial less than 0.25 often indicate that the question does not
				correlate enough with the final score (performing well on this question does not correlate
				enough with performing well on the overall test). Consider revising the question.
			</div>
			<div class="arrow popup-arrow" />
		</div>
	{/if}
{/each}

{#if loading}
	<ProgressRadial value={undefined} />
{:else}
	<div class="analytics-table" style="overflow-x: scroll !important;">
		<div class="section-header">KR-20</div>
		<div class="kr-20">
			<div><span class="kr-20-title">KR-20 Index: </span>{KR_20.display_val}</div>
		</div>
		<div class="section-header">Item Analysis</div>
		<table>
			<thead>
				<tr>
					<th>Question Name</th>
					<th>Difficulty Index</th>
					<th>Difficulty Index Upper</th>
					<th>Difficulty Index Lower</th>
					<th>Discrimination Index</th>
					<th>Point Biserial</th>
				</tr>
			</thead>
			<tbody>
				{#each question_data as question}
					<tr>
						<td>{question.question_name}</td>
						{#if question.difficulty_index.warning_low.is_active}
							<td
								class="warning-low"
								use:popup={{
									event: 'click',
									target: 'popup_' + question.difficulty_index.warning_low.warning_number
								}}
							>
								{question.difficulty_index.display_val}
							</td>
						{:else if question.difficulty_index.warning_high.is_active}
							<td
								class="warning-high"
								use:popup={{
									event: 'click',
									target: 'popup_' + question.difficulty_index.warning_high.warning_number
								}}
							>
								{question.difficulty_index.display_val}
							</td>
						{:else}
							<td>
								{question.difficulty_index.display_val}
							</td>
						{/if}
						{#if question.difficulty_upper.warning_low.is_active}
							<td
								class="warning-low"
								use:popup={{
									event: 'click',
									target: 'popup_' + question.difficulty_upper.warning_low.warning_number
								}}
							>
								{question.difficulty_upper.display_val}
							</td>
						{:else}
							<td>
								{question.difficulty_upper.display_val}
							</td>
						{/if}
						{#if question.difficulty_lower.warning_high.is_active}
							<td
								class="warning-low"
								use:popup={{
									event: 'click',
									target: 'popup_' + question.difficulty_lower.warning_high.warning_number
								}}
							>
								{question.difficulty_lower.display_val}
							</td>
						{:else}
							<td>
								{question.difficulty_lower.display_val}
							</td>
						{/if}
						{#if question.discrimination_index.warning_low.is_active}
							<td
								class="warning-low"
								use:popup={{
									event: 'click',
									target: 'popup_' + question.discrimination_index.warning_low.warning_number
								}}
							>
								{question.discrimination_index.display_val}
							</td>
						{:else}
							<td>
								{question.discrimination_index.display_val}
							</td>
						{/if}
						{#if question.point_biserial.warning_low.is_active}
							<td
								class="warning-low"
								use:popup={{
									event: 'click',
									target: 'popup_' + question.point_biserial.warning_low.warning_number
								}}
							>
								{question.point_biserial.display_val}
							</td>
						{:else}
							<td>
								{question.point_biserial.display_val}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="section-header">Inter-Item Correlation</div>
		<table>
			<thead>
				<tr>
					<th />
					{#each question_data as question}
						<th style="white-space:nowrap;">{question.question_name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each correlation_matrix as row, i}
					<tr>
						<th style="white-space:nowrap;">{question_data[i].question_name}</th>
						{#each row as correlation_coeff, j}
							<td class="w-12 h-12 text-center" style:background-color={correlation_coeff.color}
								>{correlation_coeff.val}</td
							>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.analytics-table {
		text-align: center;
	}

	.analytics-table td,
	.analytics-table th {
		padding: 3px 8px;
	}

	.analytics-table tr {
		border-bottom: 1px solid #4f4f4f;
	}

	.analytics-table {
		margin: 20px 40px;
	}

	.warning-low {
		color: rgb(241, 193, 105);
	}

	.warning-high {
		color: rgb(241, 193, 105);
	}

	.kr-20 {
		text-align: left;
		margin: 20px 0;
	}

	.kr-20-title {
		font-weight: bold;
	}

	.popup {
		padding: 10px 15px;
		background-color: #fff;
		border-radius: 2px;
		font-size: 12px;
		max-width: 200px;
		line-height: normal;
		color: #000;
	}

	.popup-arrow {
		color: #fff;
		background-color: #fff;
	}

	.section-header {
		font-size: 25px;
		font-weight: 300;
		margin: 20px 0;
		text-align: left;
		color: #6385d2;
	}
</style>
