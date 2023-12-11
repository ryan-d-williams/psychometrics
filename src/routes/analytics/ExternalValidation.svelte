<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Gradient from 'javascript-color-gradient';
	import { tools } from '../../modules/analytics.js';
	import { assignments } from '../../store/assignments.js';
	import { onMount } from 'svelte';

	let correlation_matrix = [];
	let loading = false;
	let assignment_names;

	$: {
		if ($assignments.length > 0) {
			let gradientArray = new Gradient()
				.setColorGradient('#d5512d', '#669e53')
				.setMidpoint(11)
				.getColors();
			assignment_names = $assignments.map((assignment) => assignment.name);
			correlation_matrix = tools.calculateExternalValidation($assignments, gradientArray);
			console.log(correlation_matrix);
		}
	}
	onMount(async () => {
		let Statistics = (await import('../../../node_modules/statistics.js/statistics.js?id=165641'))
			.default;
		tools.setStatistics(Statistics);
	});
</script>

{#if loading}
	<ProgressRadial value={undefined} />
{:else}
	<div class="analytics-table" style="overflow-x: scroll !important;">
		<table>
			<thead>
				<tr>
					<th />
					{#each assignment_names as assignment_name}
						<th>{assignment_name}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each correlation_matrix as row, i}
					<tr>
						<th>{assignment_names[i]}</th>
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
</style>
